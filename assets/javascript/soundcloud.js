//begin test soundcloud code, no node
//all of this happens outside of soundlcoud so no user authentication is needed
//basically a user searchs for a song and then adds it to the playlist
//which then creates a soundcloud wiget in a div and also saves pushes the song object to an
//array with the playlist name to firebase and locally
//whenever a song ends the next widget in the div/playlist is selected and starts playing...
//and here we have a colloboratie playlist

$(document).ready(function() {

  //begin firebase connect
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBBSuiQ1csn_BILjiP7_VBw4fkS0hIxjeo",
      authDomain: "mixed-64cd6.firebaseapp.com",
      databaseURL: "https://mixed-64cd6.firebaseio.com",
      projectId: "mixed-64cd6",
      storageBucket: "",
      messagingSenderId: "402860987192"
      };
    firebase.initializeApp(config);

    const dbRef = firebase.database().ref();


    //dbRef.on('value', snap => console.log("db " +snap.val()));

    //add playlist function probably need to check if the name exists already...
    var plNameGlobal;
    var plRefGlobal;
    var user = "Zack";
    var plChangedListener;
    var playlist =[];
    var track = {
                  url: "",
                  uri: "",
                  artworkURL:"",
                }
    var searchTerm;
    var widgetArray = [];
    var currentPlayPosition;


    function addPlaylist(plName){
      //var rootRef = firebase.database().ref();
        plNameGlobal = plName;
        //populate plylist header title
        $('#plTitle').html(plName);
        var playlistRef = dbRef.child('playlists');
        plRefGlobal = playlistRef.child(plName);
        plRefGlobal.set({
          name: plName,
          songs: ""
        });
        plChangedListener  = plRefGlobal.child('songs');
        //the listener for when the playlist is ammended
        var songCounter = 0;
        plChangedListener.on('child_added', function(snapshot) {

        var scURI = snapshot.val().scURI;
        console.log("scURI "+scURI);
        //create soundcloud widget
        playlist.push(addSongToPL(scURI, songCounter));
        // identify the correct element
        createWidgetBinds(songCounter);
        songCounter++; //increment the song counter

      });

    } //end add playlist

    function createWidgetBinds(i){

      var iframeElement  = document.getElementById('songWidget'+i);
      var scWidget = SC.Widget(iframeElement);
      //make that ever important widget array
      widgetArray.push(scWidget);
      //bind listeners to widgets
        scWidget.bind(SC.Widget.Events.READY, function() {
             // load new widget
             var index = i;
             scWidget.bind(SC.Widget.Events.PLAY, function() {

               widgetArray.forEach(function callback(currentValue, index, array) {
                   //your iterator
                  //  console.log(index);

                  widgetArray[index].isPaused(function(isPaused) {
                     if(!isPaused)currentPlayPosition=index;
                     //console.log(currentPlayPosition);
                  });
               });

           });
             scWidget.bind(SC.Widget.Events.FINISH, function() {

               if(currentPlayPosition<widgetArray.length-1){
                  currentPlayPosition++;
                  widgetArray[currentPlayPosition].play();

                }else{
                  currentPlayPosition = 0;
                  widgetArray[currentPlayPosition].play();
                }
              // widgetArray[this.index+1].play();
              //   scWidget.load("https://soundcloud.com/zack-hagan/escape-by-jesse-kolber", {
              //    auto_play: true
              //  });
           });
        });
    }

    //load playlists as buttons
    var playlistsOldStorage;
    const dbPlRef = firebase.database().ref('playlists');
    dbPlRef.once('value').then(function(data) {
        console.log(JSON.stringify(data));
        playlistsOldStorage = data;
        var plIt = 0;
        data.forEach(function (element, index){

            console.log(element.val().name);
            var btnNames = element.val().name;
            //var playlistKey = datas
            console.log(plIt);
            $(`<button class="loadPL" value="${plIt}">`).append(btnNames).appendTo($('#loadPlaylist'));
            plIt++;
        });
        //callback for playlist buttons
        var loadPLBtnArray = $('.loadPL');
        //this is where we would like to load a playlist
        loadPLBtnArray.click(function(event){
          //if playlist buttom clicked load playlist
              // console.log("click playlist");
            btnVal = $(this).text();
            plLoc = $(this).attr('value');
            console.log(btnVal + " btn val "+plLoc);
            //console.log(JSON.stringify(playlistsOldStorage));
            playlistsOldStorage.forEach( function (element){
              //element = element.toString();
              //console.log(element[0].name);
                if(element.val().name === btnVal){
                //console.log(element.val().songs);
                var songs = Object.values(element.val().songs);

                plNameGlobal = element.val().name;

                $('#plTitle').text(plNameGlobal);

                //reset where we are looking in the db
                var playlistRef = dbRef.child('playlists');

                plRefGlobal = playlistRef.child(plNameGlobal);
                plRefGlobal.on('child_added', function(snapshot) {

                // var scURI = snapshot.val().scURI;
                 console.log("child "+snapshot);
                // //create soundcloud widget

                // // identify the correct element
                // createWidgetBinds(songCounter);
                //songCounter++; //increment the song counter

                  });

                songs.forEach(function (song, index){
                    console.log(song.scURI);
//                     addSongToPL(song.scURI,index);
//
                    playlist.push(addSongToPL(song.scURI, index));
                    createWidgetBinds(index);

                });



                }

            });

            var selectedPlaylist = data.val().songs;
            console.log(selectedPlaylist + "playlist data");
      });

    });

    function addSongToPL(uri,i){

        playlist.push($('<iframe>', {
           src: 'https://w.soundcloud.com/player/?url='+uri+'&amp',
           id:  'songWidget'+i,
           frameborder: 0,
           scrolling: 'no',
           width: '50%',
           position: i
          //  height: '50px'

        }).appendTo(playlistContainer));
      }



    function addTrack(artist, trackURL, scURI){
      var newTrkRef = plRefGlobal.child('songs').push();
      newTrkRef.set({
        artist: artist,
        trackURL: trackURL,
        scURI: scURI
      });
    }

    SC.initialize({
        client_id: '8381923c813162186cf2ef8bc7d4e9f3',
        redirect_uri: 'http://localhost:8080/callback' //this callback won't work until soundclud reregisters the app
      });

    var tracksContainer = $("#tracks");

    $('#inputSet').submit(function (event) {
          event.preventDefault();
          var playlistTitle = $('#inputST').val().trim();
          if(playlistTitle != null && playlistTitle != "")addPlaylist(playlistTitle);

          $('#inputST').val('');

        });

    $('#createSet').click(function (event) {
          event.preventDefault();
          var playlistTitle = $('#inputST').val().trim();

          if(playlistTitle != null && playlistTitle != "")addPlaylist(playlistTitle);

          $('#inputST').val('');

        });

    $('#inputSearch').submit(function(event){
          event.preventDefault();
          searchTerm = $('#inputST1').val().trim();
          var genre = $('#inputST2').val().trim();
          var artist = $('#inputST3').val().trim();

          searchSC(searchTerm, genre, artist);

          $('#inputST1').val('');
          $('#inputST2').val('');
          $('#inputST3').val('');

      });

    $('#search').click(function (event) {

          event.preventDefault();
          tracksContainer.empty();

          searchTerm = $('#inputST1').val().trim();
          var genre = $('#inputST2').val().trim();
          var artist = $('#inputST3').val().trim();

          searchSC(searchTerm, genre, artist);

          $('#inputST1').val('');
          $('#inputST2').val('');
          $('#inputST3').val('');

    });

    //seach for a term

    function searchSC(sTerm, genre, artist){
           if (sTerm == "" && genre == "" &&  artist == "") {
          console.log("User cancelled the prompt.");
      } else {
          //this is where we search if the user has completed a field
        SC.get('/tracks', {
            q: searchTerm,
            genre: genre,
            user: artist
          }).then(function(tracks) {
            console.log(tracks);

        for(var i = 0; i<tracks.length; i++){
          //console.log("ping");

          var trackName =  tracks[i].title;
          var artistName = tracks[i].user.permalink;
          var imgURL = tracks[i].artwork_url;
          var trackURL = tracks[i].permalink_url;
          var trackURI = tracks[i].uri;

          // console.log(trackName);

           var trackDiv = $('<div id="trackEntry">');
           trackDiv.attr('artistName', artistName);
           trackDiv.attr('trackURL', trackURL);
           trackDiv.attr('uri', trackURI);
           trackDiv.attr('position', i);
           trackDiv.append(`${trackName} - ${artistName}`);
           tracksContainer.append(trackDiv);
         } // end of for loop

        });// end of tracks search returnx

      } //end of search complete

    }

    var trackEntry = $('#trackEntry');
    var playlistContainer = $('#playlist');

    tracksContainer.on('click','div', function(){
                  var artist = $(this).attr('artistName');
                  var trackURL = $(this).attr('trackURL');
                  var scURI =   $(this).attr('uri');
                  addTrack(artist,trackURL,scURI);

        });

});//end of on doc ready
