//begin test soundcloud code, no node js
//all of this happens outside of soundlcoud so no user authentication is needed
//basically a user searchs for a song and then adds it to the playlist
//which then firebase holds and also pushes the song object to an
//array with the playlist
//whenever a song ends the next song url is loaded to the widget and starts playing...
//and here we have a colloboratie playlist

//Copyright 2018 Zack Hagan and the DUers

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

    //hide main sections until user logs in
    $('.mainSection').hide();
    //run the login function
    //login();

      //hide the library selection
    $('.mainLibrary').hide();
    $('.selectSongArea').hide(); //hide select and search song area
    $('.selectAddArea').hide();
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
    var plGlobalLocation = "";


    function addPlaylist(plName){

      plNameGlobal = plName;
      //populate plylist header title
      //$('#playlistTitle').html(plName);
      $('#noPlaylist').hide();
      var playlistRef = dbRef.child('playlists');
      plRefGlobal = playlistRef.child(plName);
      plRefGlobal.set({
        name: plName,
        location: plGlobalLocation,
        songs: ""
      });
      plChangedListener  = plRefGlobal.child('songs');
      //the listener for when the playlist is ammended
      var songCounter = 0;

    } //end add playlist


    //load playlists as cards divs
    var playlistsOldStorage;
    const dbPlRef = firebase.database().ref('playlists');
    var plIt = 0;

    dbPlRef.on('child_added', function(snapshot) {

          var playlistNames = snapshot.val().name;
          var plLocSpan = $('<span id="locationSpan">');

          var playlistLocation = "<br>" + snapshot.val().location
          plLocSpan.append(playlistLocation)
          var plDiv = $(`<div class="card" value="${plIt}">`).append(playlistNames).append(plLocSpan).appendTo($('#loadPlaylist'));
          plIt++;

      //this is where we would like to load a playlist when a user clicks on the card
      // THIS IS THE CALLBACK FOR SLECTING A PLAYLIST

      plDiv.on('click', function(event){
        //if playlist buttom clicked load playlist

              plLoc = $(this).attr('value');

              plNameGlobal = snapshot.val().name;
              playlist = [];
              $('#playlistTitle').text(plNameGlobal);
              $('#noPlaylist').hide();//hide playlist
              $('.main_body').hide();
              $('.selectSongArea').show(); //show select and search song area
              $('.selectAddArea').show();
              $('#currentPlaylist tr').not(':first').empty();
              //reset where we are looking in the db
            //  var playlistRef = dbRef.child('playlists');

              plRefGlobal =  dbRef.child('playlists').child(plNameGlobal);

              //this is what is called when a user adds a song to existing playlist




                  plRefGlobal.child('songs').once('child_removed', function(snapshot) {
                      console.log("child removed");
                      //plDiv.trigger('click');
                      songCounter--;
                      //plDiv.off();
                  });

                  plRefGlobal.child('songs').on('value', function(snapshot) {
                    var songCounter = 0;
                    playlist = [];
                    $('#currentPlaylist tr').not(':first').empty();
                    console.log("child "+JSON.stringify(snapshot));
                      // //create soundcloud widget
                    snapshot.forEach( function(snapshot){
                      var scURI = snapshot.val().scURI;
                      var artist = snapshot.val().artist;
                      var imgURL = snapshot.val().imgURL;
                      var trackURL = snapshot.val().trackURL;
                      var title = snapshot.val().title;
                      var comment = snapshot.val().comment;
                      var addedBy = snapshot.val().addedBy;
                      var songDbRef = snapshot.ref.path.n[snapshot.ref.path.n.length-1];

                      var track = {
                          title:title,
                          trackURL:trackURL,
                          imgURL:imgURL,
                          artist:artist,
                          scURI:scURI,
                          comment:comment,
                          addedBy:addedBy,
                          songDbRef: songDbRef
                      };
                      // console.log("scURI "+scURI);

                      addSongToPL(track, songCounter);
                      songCounter++; //increment the song counter
                    });

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

          playlistRow += '<tr ><td>'+(index+1)+ '</td><td>' + track.title + '</td><td>' + track.artist + '</td><td>' + track.addedBy
          + '</td><td>' + track.comment + '</td><td>' + '<div><button type="submit" id="deleteSong" data-dbref="'+track.songDbRef+'"><i class="fa fa-trash"></i></button><button id="playSong" data-pos="'+index+'"data-uri="' + track.scURI + '" data-url="'+track.trackURL
          +'" data-img="'+track.imgURL+'" data-title="'+track.title+'" data-artist="'+track.artist+'"><i class="fa fa-play"></i></button></div>'+ '</td></tr>';

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
            addPlaylist(playlistTitle);
            }
          $('#inputST').val('');

        });

    $('#createSet').click(function (event) {
          event.preventDefault();
          var playlistTitle = $('#inputST').val().trim();
          // console.log(playlistTitle);
          if(playlistTitle != null && playlistTitle != ""){
            addPlaylist(playlistTitle);
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

                  $('.main_library').hide();
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

        $('.main_library').show();
    });

    $('#currentPlaylist').on('click', '#deleteSong', function(event){
      console.log("delete");
      var songDbRef = $(this).data('dbref');
      plRefGlobal.child('songs').child(songDbRef).remove();



    });

    //when a song in the playlist is clicked
    $('#currentPlaylist').on('click', '#playSong', function(event){
    //$('#playSong').click( function(event){
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
         widget.bind(SC.Widget.Events.PAUSE, function() {
           // player.hide();

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
         width: '100%',
         id: 'player'
    }).appendTo($('.main')).hide();

    $('#playlistShow').click(function(event){

      $('.main_body').show();
    });

    $('#selectSongShow').click(function(event){

      $('.main_library').show();
    });

     // geolocation info
      navigator.geolocation.getCurrentPosition(function(position) {
        var address = getAddress(position.coords.latitude, position.coords.longitude);
      //  console.log(address);

        address.then(function(value) {
            console.log(value.city);
            console.log(value.state);
            plGlobalLocation = value.city + ", " + value.state;
            // expected output: "Success!"
          });

        // console.log(address._result.formatted_address);
      });

        function getAddress (latitude, longitude) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            var method = 'GET';
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
            var async = true;

            request.open(method, url, async);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var data = JSON.parse(request.responseText);
                        var address = data.results[0];
                      //  resolve(address);
                        console.log(address);
                        var city = address.address_components[4].short_name;
                        var state = address.address_components[6].short_name;
                        plLocation = {
                          city:city,
                          state:state
                        };
                        resolve(plLocation);
                    }
                    else {
                        reject(request.status);
                    }
                }
            };
            request.send();
          });
        };
} //end mixed function
