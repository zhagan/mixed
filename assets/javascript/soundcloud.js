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

    } //end add playlist

    function createWidgetBinds(i){

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

    var tracksContainer = $("#songTable");

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
          // var genre = $('#inputST2').val().trim();
          // var artist = $('#inputST3').val().trim();

          searchSC(searchTerm, genre, artist);

          $('#inputST1').val('');
          // $('#inputST2').val('');
          // $('#inputST3').val('');

      });

    $('#search').click(function (event) {

          event.preventDefault();
          //tracksContainer.empty();

          searchTerm = $('#inputST1').val().trim();
          // var genre = $('#inputST2').val().trim();
          // var artist = $('#inputST3').val().trim();

          searchSC(searchTerm);

          $('#inputST1').val('');
          // $('#inputST2').val('');
          // $('#inputST3').val('');

    });

    //seach for a term

    function searchSC(sTerm){
           if (sTerm == "") {
          console.log("User cancelled the prompt.");
      } else {
          //this is where we search if the user has completed a field
        SC.get('/tracks', {
            q: searchTerm
//             genre: genre,
//             user: artist
          }).then(function(tracks) {
            console.log(tracks);


        $('#songTable tr').not(':first').remove();



        for(var i = 0; i<tracks.length; i++){
          console.log("ping");


          var trackName =  tracks[i].title;
          var artistName = tracks[i].user.permalink;
          var imgURL = tracks[i].artwork_url;
          var trackURL = tracks[i].permalink_url;
          var trackURI = tracks[i].uri;

          // create row for each song
          var songRow = '';

          songRow += '<tr data-uri="' + trackURI + '" data-url="'+trackURL+'" data-img="'+imgURL+'" data-title="'+trackName+'" data-artist="'+artistName+'"><td>' + trackName + '</td><td>' + artistName + '</td></tr>';
          //songRow.attr('class', 'songRow');
          $('#songTable tr').first().after(songRow);
          //  var trackDiv = $('<div id="trackEntry">');
          //  songRow.attr('artistName', artistName);
          //  songRow.attr('trackURL', trackURL);
          //  songRow.attr('uri', trackURI);
          //  songRow.attr('position', i);
           //songRow.append(`${trackName} - ${artistName}`);
           //tracksContainer.append(trackDiv);


         } // end of for loop

        });// end of tracks search returnx

      } //end of search complete

    }//end of seach soundcloud

    var trackEntry = $('#trackEntry');
    var playlistContainer = $('#playlist');
    var songContainer = $('.songRow');
    // songContainer.click(function() {
    tracksContainer.on('click','tr', function(){

                  // var artist = $(this).attr('artistName');
                  // var trackURL = $(this).attr('trackURL');
                  var scURI = $(this).data('uri');
                  var title = $(this).data('title');
                  // console.log($(this).children("innerText"));
                  var trackObj = this;
                  $('#yourSong').append(trackObj);
                  //addTrack(artist,trackURL,scURI);

        });




});//end of on doc ready
