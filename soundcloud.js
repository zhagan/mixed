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
        var playlistRef = dbRef.child('playlists');
        plRefGlobal = playlistRef.push();
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
        playlist.push($('<iframe>', {
           src: 'https://w.soundcloud.com/player/?url='+scURI+'&amp',
           id:  'songWidget'+songCounter,
           frameborder: 0,
           scrolling: 'no',
           width: '50%',
           position: songCounter
          //  height: '50px'

        }).appendTo(playlistContainer));
        //array of widgets
        var iframeElement  = document.getElementById('songWidget'+songCounter);

        var scWidget = SC.Widget(iframeElement);
        widgetArray.push(scWidget);

          scWidget.bind(SC.Widget.Events.READY, function() {
               // load new widget
               var index = songCounter;
               scWidget.bind(SC.Widget.Events.PLAY, function() {

                 widgetArray.forEach(function callback(currentValue, index, array) {
                     //your iterator
                    //  console.log(index);

                    widgetArray[index].isPaused(function(isPaused) {
                       if(!isPaused)currentPlayPosition=index;
                       //console.log(currentPlayPosition);
                    });
                 });


                //current position... what to trigger with play

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
          songCounter++; //increment the song counter
        // widgetArray.forEach(function (eachIFrame, index){
        // //  console.log("i fram id "+JSON.stringify(eachIFrame, null, 4));
        // //  var iframeElement   = document.querySelector('iframe');
        //   var scWidget = SC.Widget(eachIFrame);
        //

        //
        // });


      });

    } //end add playlist


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
        redirect_uri: 'http://localhost:8080/callback'
      });


    var tracksContainer = $("#tracks");

    $('#inputSet').submit(function (event) {
          event.preventDefault();
          var playlistTitle = $('#inputST').val().trim();
          if(playlistTitle != null && playlistTitle != "")addPlaylist(playlistTitle);

        });

    $('#createSet').click(function (event) {
          event.preventDefault();
          var playlistTitle = $('#inputST').val().trim();
          if(playlistTitle != null && playlistTitle != "")addPlaylist(playlistTitle);

        });

    $('#inputSearch').submit(function (event) {
          event.preventDefault();

        });

    $('#inputSearch').submit(function(event){
          event.preventDefault();

      });

    $('#search').click(function (event) {

      event.preventDefault();
      tracksContainer.empty();

      searchTerm = $('#inputST1').val().trim();
      var genre = $('#inputST2').val().trim();
      var artist = $('#inputST3').val().trim();
      searchSC(searchTerm, genre, artist);

      //console.log(searchTerm + " click");


    });

    //seach for a term

    function searchSC(sTerm, genre, artist){
           if (sTerm == "" && genre == "" &&  artist == "") {
          txt = "User cancelled the prompt.";
      } else {
          //this is where we search if the user has completed a field
        SC.get('/tracks', {
            q: searchTerm,
            genre: genre,
            artist, artist
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
