//begin test soundcloud code, no node
//all of this happens outside of soundlcoud so no user authentication is needed
//basically a user searchs for a song and then adds it to the playlist
//which then firebase chold and also pushes the song object to an
//array with the playlist
//whenever a song ends the next sing url is loaded to the widget and starts playing...
//and here we have a colloboratie playlist


function mixed(){
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

//hide the library selection
    $('.mainLibrary').hide();
    $(".libraryShow").click( function(event){
      // console.log("library clicked");

      $('.mainPlaylist').hide();
      $('.mainLibrary').show();
    });
    $(".playlistShow").click( function(event){
      $('.mainLibrary').hide();
      $('.mainPlaylist').show();

    });

    //add playlist function probably need to check if the name exists already...
    var plNameGlobal;
    var plRefGlobal;
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

      plNameGlobal = plName;
      //populate plylist header title
      $('#playlistTitle').html(plName);
      $('#noPlaylist').hide();
      var playlistRef = dbRef.child('playlists');
      plRefGlobal = playlistRef.child(plName);
      plRefGlobal.set({
        name: plName,
        songs: ""
      });
      plChangedListener  = plRefGlobal.child('songs');
      //the listener for when the playlist is ammended
      var songCounter = 0;
    //   plChangedListener.on('child_added', function(snapshot) {
    //
    //   var scURI = snapshot.val().scURI;
    //   var artist = snapshot.val().artist;
    //   var imgURL = snapshot.val().imgURL;
    //   var trackURL = snapshot.val().trackURL;
    //   var title = snapshot.val().title;
    //   var comment = snapshot.val().comment;
    //   var addedBy = snapshot.val().addedBy;
    //
    //   var track = {
    //       title:title,
    //       trackURL:trackURL,
    //       imgURL:imgURL,
    //       artist:artist,
    //       scURI:scURI,
    //       comment:comment,
    //       addedBy:addedBy
    //   };
    //   // console.log("scURI "+scURI);
    //   //create soundcloud widget
    //  addSongToPL(track, songCounter);
    //   // identify the correct element
    //   //createWidgetBinds(songCounter);
    //   songCounter++; //increment the song counter
    //
    // });

    } //end add playlist

    function createWidgetBinds(i){

    }

    //load playlists as cards divs
    var playlistsOldStorage;
    const dbPlRef = firebase.database().ref('playlists');
    var plIt = 0;

    dbPlRef.on('child_added', function(snapshot) {

          var playlistNames = snapshot.val().name;
          var plDiv = $(`<div class="card" value="${plIt}">`).append(playlistNames).appendTo($('#loadPlaylist'));
          plIt++;

      //this is where we would like to load a playlist when a user clicks on the card
      // THIS IS THE CALLBACK FOR SLECTING A PLAYLIST

      plDiv.on('click', function(event){
        //if playlist buttom clicked load playlist

          plLoc = $(this).attr('value');

              plNameGlobal = snapshot.val().name;
              playlist = [];
              $('#playlistTitle').text(plNameGlobal);
              $('#noPlaylist').hide();
              $('#currentPlaylist tr').not(':first').empty();
              //reset where we are looking in the db
              var playlistRef = dbRef.child('playlists');

              plRefGlobal = playlistRef.child(plNameGlobal);

              //this is what is called when a user adds a song to existing playlist
              var songCounter = 0;
              plRefGlobal.child('songs').on('child_added', function(snapshot) {


               console.log("child "+JSON.stringify(snapshot));
              // //create soundcloud widget

              var scURI = snapshot.val().scURI;
              var artist = snapshot.val().artist;
              var imgURL = snapshot.val().imgURL;
              var trackURL = snapshot.val().trackURL;
              var title = snapshot.val().title;
              var comment = snapshot.val().comment;
              var addedBy = snapshot.val().addedBy;

              var track = {
                  title:title,
                  trackURL:trackURL,
                  imgURL:imgURL,
                  artist:artist,
                  scURI:scURI,
                  comment:comment,
                  addedBy:addedBy
              };
              // console.log("scURI "+scURI);

              addSongToPL(track, songCounter);
              songCounter++; //increment the song counter

                });

              });

    });

    dbPlRef.once('value').then(function(data) {
        // console.log(JSON.stringify(data));
        playlistsOldStorage = data;


    });

//this function creates a soundcloud widget for a song
    function addSongToPL(track, index){
          // console.log(JSON.stringify(track) + "track object");
          playlist.push(track);
          var playlistRow = '';

          playlistRow += '<tr data-pos="'+index+'"data-uri="' + track.scURI + '" data-url="'+track.trackURL+'" data-img="'+track.imgURL+'" data-title="'+track.title+'" data-artist="'+track.artist+'"><td>' +(index+1)+ '</td><td>' + track.title + '</td><td>' + track.artist + '</td><td>' + track.addedBy + '</td><td>' + track.comment + '</td></tr>';

          $('#currentPlaylist tr').last().after(playlistRow);

      }


// this actually pushes the song to the firebase
    function addTrack(artist, trackURL, scURI, comment, addedBy, imgURL, title){
      var newTrkRef = plRefGlobal.child('songs').push();
      newTrkRef.set({
        artist: artist,
        trackURL: trackURL,
        scURI: scURI,
        comment: comment,
        addedBy: addedBy,
        imgURL: imgURL,
        title: title
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
          if(playlistTitle != null && playlistTitle != ""){
            //addPlaylist(playlistTitle);
            }
          $('#inputST').val('');

        });

    $('#createSet').click(function (event) {
          event.preventDefault();
          var playlistTitle = $('#inputST').val().trim();
          // console.log(playlistTitle);
          if(playlistTitle != null && playlistTitle != ""){
            //addPlaylist(playlistTitle);
            // console.log("add playlist");
          }
          $('#inputST').val('');

        });

    $('#inputSearch').submit(function(event){
          event.preventDefault();
          searchTerm = $('#inputST1').val().trim();

          searchSC(searchTerm, genre, artist);

          $('#inputST1').val('');

      });

    $('#search').click(function (event) {

          event.preventDefault();

          searchTerm = $('#inputST1').val().trim();

          searchSC(searchTerm);

          $('#inputST1').val('');

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
            // console.log(tracks);


        $('#songTable tr').not(':first').remove();



        for(var i = 0; i<tracks.length; i++){
          // console.log("ping");

          var trackName =  tracks[i].title;
          var artistName = tracks[i].user.permalink;
          var imgURL = tracks[i].artwork_url;
          var trackURL = tracks[i].permalink_url;
          var trackURI = tracks[i].uri;

          // create row for each song
          var songRow = '';

          songRow += '<tr data-uri="' + trackURI + '" data-url="'+trackURL+'" data-img="'+imgURL+'" data-title="'+trackName+'" data-artist="'+artistName+'"><td>' + trackName + '</td><td>' + artistName + '</td></tr>';
          $('#songTable tr').first().after(songRow);

         } // end of for loop

        });// end of tracks search returnx

      } //end of search complete

    }//end of seach soundcloud

    var trackEntry = $('#trackEntry');
    var playlistContainer = $('#playlist');
    var songContainer = $('.songRow');
    // songContainer.click(function() {
    tracksContainer.on('click','tr', function(){

                  var scURI = $(this).data('uri');
                  var title = $(this).data('title');

                  var artist = $(this).data('artist');
                  var trackURL = $(this).data('url');

                  var imgURL = $(this).data('img');

                  var trackObj = $(this).clone();

                  var ySong =  $('#yourSong');
                  ySong.empty().append(trackObj);
                  ySong.attr('uri', scURI).attr('title', title).attr('imgURL', imgURL).attr('artist', artist).attr('trackURL',trackURL);

        });

    $('#addSong').click( function(event){
        event.preventDefault();
        var addByUser = $('#nameInput').val().trim();
        var comment = $('#userComment').val().trim();
        var ySong =  $('#yourSong');
        var artist = ySong.attr('artist');
        var scURI = ySong.attr('uri');
        var title = ySong.attr('title');

        var imgURL = ySong.attr('imgURL');
        if(imgURL == null || imgURL == ""){
          imgURL =  "not available";
        }
        var trackURL = ySong.attr('trackURL');
        //console.log($('#yourSong'));
        addTrack(artist, trackURL, scURI, comment, addByUser, imgURL, title);


    });

    //when a song in the playlist is clicked
    $('#currentPlaylist').on('click','tr', function(event){

      var url = $(this).data('url');
      var position = $(this).data('pos');
      console.log("playlist clicked "+position);

      player.show();
      var iframeElement   = document.querySelector('iframe');
      var widget         = SC.Widget(iframeElement);
      widget.load(url, {auto_play:'true'});

      widget.bind(SC.Widget.Events.READY, function() {
           // load new widget
           widget.bind(SC.Widget.Events.PLAY, function() {


         });
           widget.bind(SC.Widget.Events.FINISH, function() {
             if(position<playlist.length-1){
               position++;
             }else{
               position = 0;
             }
              widget.load(playlist[position].trackURL, {auto_play:'true'});

         });
      });

    });

    var player = $('<iframe>', {
       src: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/10502040&amp',
       id:  'songWidget',
       frameborder: 0,
       scrolling: 'no',
       width: '100%'
    }).appendTo($('.main_body')).hide();
} //end mixed function