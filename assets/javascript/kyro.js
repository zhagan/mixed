$(document).ready(function () {

    //// VIMEO–player API //
   var idPlayer = new Vimeo.Player('video');
   idPlayer.pause();
   setTimeout(function(){idPlayer.pause();},1000); //SAFARI  play on -load BUG


   var RP_cont = $(".reel-player-cont"),
    rp_h1 = $(".player-bar-top h1"),
    rp_h2 = $(".player-bar-top h2"),
    h1_h2 = $(".player-bar-top h1, .player-bar-top h2"),
    rp_BTM = $(".player-bar-btm"),
    Vol_cont = $(".volume-slide-cont"),
    vol_prog = $(".volume-slide-cont .progress"),
    vol_handle = $(".volume-slide-cont .handle"),
    center_button = $(".center-button"),
    btm_right = $(".btm-right-cont"),
    Play_SVG = $("#Play-SVG-Circle"),
    i_fullscreen = $(".i-fullscreen"),
    video_BG = $(".video-BG"),
    rp_img = $(".player-img");




    //// Intro-Open Anim. //
   function introOpen(){

  //   var introTween = new TweenMax({x: 100, paused:true} );
   TweenMax.set(RP_cont, {transformPerspective:1750})

   TweenMax.from(RP_cont, 0.45, {scaleX: 0, autoAlpha: 0.5, ease:Power3.easeInOut})
   TweenMax.from(RP_cont, 0.6, { scaleY: 0.01, delay:0.0, ease:Power3.easeInOut})
   TweenMax.from(RP_cont, 1.33, {y: -500, rotationX:125, ease:Expo.easeOut, onCompleteParams:[".reel-player-cont, .rp-img-cont"], onComplete: endFix })
   TweenMax.from(".rp-img-cont", 1.1, {scale: 1, autoAlpha: 0.00, delay:0.2, ease:Power2.easeInOut, force3D: false})
   TweenMax.fromTo(".amb-heavy-shadow", 1.1, {boxShadow:"0em 0em 0em 0em rgba(0,2,6,0.05), 0em 0em 0em 0em rgba(0,2,6,0.05), 0em 0em 0em 0em rgba(0,2,6,0.05), 0em 0em 0em 0em rgba(0,2,6,0.05), 0em 0em 0em 0em rgba(0,2,6,0.05) " , force3D: true},
           {delay:0.4, boxShadow: "0em 14em 21em 0em rgba(0,2,6,0.05), 0em 40em 15em -23em rgba(0,2,6,0.08), 0em 55em 30em -23em rgba(0,2,6,0.12), 0em 60em 55em -23em rgba(0,2,6,0.10), 0em 50em 120em -23em rgba(0,2,6,0.24)" , ease:Power3.easeOut, force3D: true})

};
   introOpen();

   $('b').click(function (){
     introOpen();
  });

   function endFix(x) {
    TweenMax.set(x,{ clearProps:"all"});
 /*  x.each(function(index, param) {
   $('body').append("<p style='pointer-events: none; position: relative; top: -500em; font-size: 24%; font-family: monospace;'>"
              + "no. " + index  + " " + $(this).prop("tagName") + " " + $(this).prop("className") + " Props Cleared</p>"); //Logs Tag name of cleared tweens selector (aka param:)
  // $("#msg").html($(x).attr("id")+" onComplete fired");
    //console.log(o);
    }); */
  };


////// Custom VOLUME SLIDER!    *Start*
  var jHorizontalHandle = $('.slider_horizontal .handle');
  var jHorizontalProgress = jHorizontalHandle.closest('.progress');

  jHorizontalHandle.on('mousedown', function (e) {
      if (1 === e.which) { // left click
          dragSlider(jHorizontalHandle, '.slider_horizontal', true, function (v, p) {
              jHorizontalProgress.css('width', (p * 1) + '%');
              jHorizontalHandle.css('left', (v * 1) + 'px');
            document.getElementById('volume-result').innerHTML = 'Vol: ' + Math.floor(p) + '% ' + Math.floor(v) + '/' + $('.slider_horizontal').css('width') ;
          });
      }
    // Run!
  });
////// VOLUME SLIDER    *END*




////// RP-Hover Timeline

var RPhover_tl = new TimelineMax({paused:true});

RPhover_tl
// .set(RP_cont,  {overflow: 'hidden'})
.set('#Circle-Outline', {opacity: 0.25, rotation: 90, transformOrigin:'50% 50%'})
.set(rp_img, { orce3D:true})

.addLabel('label--0X', '+=0')
.addLabel('label--0A', '+=0.225')
.addLabel('label--0B', '+=0.0')
// .addLabel('label--0Z', '+=3.0')

//.to(rp_img, 0.7, {opacity:1, marginBottom:'0%', ease:Power2.easeOut, force3D:true}, "label--0X-=0.0")
//.to(rp_img, 0.2, {opacity:.5, transformOrigin:'50% 0%', ease:Power2.easeInOut, force3D:true}, "label--0X-=0.0")

.from(rp_h1, 0.9, {  x:-12, letterSpacing:'+=0.0em', ease:Expo.easeOut}, "label--0A+=0.0")
.from(rp_h2, 0.9, {  x:12, letterSpacing:'+=0.0em', ease:Expo.easeOut}, "label--0A+=0.0")
.from(h1_h2, 0.9, {autoAlpha: 0, ease:Power1.easeOut}, "label--0A+=0.0")


.from(rp_BTM, 0.6, { autoAlpha: 0, y:'4em', ease:Expo.easeOut, force3D:true}, "label--0B+=0.0")

.from(Vol_cont, 0.9, { yPercent:8,  ease:Expo.easeOut, force3D:true}, "label--0B+=0.0")
.from(center_button, 0.9, { y:8,  ease:Expo.easeOut, force3D:true}, "label--0B+=0.0")
.from(btm_right, 0.9, { y:8,  ease:Expo.easeOut, force3D:true}, "label--0B+=0.0")

.to(vol_prog, 0.9, { width:'75%', ease:Expo.easeOut, force3D:true}, "label--0B+=0.0")
.to(vol_handle, 0.9, { left:'100%', ease:Expo.easeOut, force3D:true}, "label--0B-=0.075")

.set('#Circle-Outline', {rotation: -90, }, "label--0X+=0.0")
.to('#Circle-Outline', 0.9, {opacity: 0.1, strokeDasharray: '133 133', strokeDashoffset: 266, ease:Power2.easeOut}, "label--0X+=0.0")

.from($("#Play-Pause").find('i'), 0.3, {scale: 0.25, opacity: 0.15, ease:Power3.easeInOut}, "label--0B+=0.12")
//.from($("#Play-Pause").find('i'), 0.6, {opacity: 0.25, ease:Power1.easeOut}, "label--0B+=0.06")

.fromTo("#Circle-gsap", 1.2, { opacity: 0.05}, {opacity: 0.00, ease:Power0.easeOut}, "label--0B+=0.12")
.fromTo("#Circle-gsap", 1.2, {attr:{r:'0em'} }, {attr:{r:'21.0em'}, ease:Expo.easeOut}, "label--0B+=0.18")
;

  RP_cont.hover(function(){
    $(this).toggleClass('active');
    rp_img.toggleClass('active');

      if ( $(this).hasClass('active') ) {
        RPhover_tl.play().timeScale(1.0);
     }
      else {
        RPhover_tl.reverse().timeScale(2.5); ;
     }
  });



  Play_SVG.click(function(){
      rp_BTM.toggleClass('active');
      $('#Btm-Img-Blur').toggleClass('active');
      $(this).toggleClass('active');

     if ( $(this).hasClass('active') ) {
       setTimeout(function(){idPlayer.play();},1500);

       TweenMax.set('iframe', { autoAlpha:0, scaleY: 1,});
       TweenMax.to('iframe', 0.6, {delay:0.6, autoAlpha:1, ease:Power1.easeIn});
       //container shadow
       TweenMax.to(RP_cont, 1.25, {width: 640, height:360, boxShadow: '0.5em 1em 1em 0em rgba(0,2,6,0.08), 1em 2em 4em 0em rgba(0,2,6,0.08), 0em 0em 0em 0em rgba(0,2,6,0.06), 0em 0em 0em -4em rgba(0,2,6,0.12), 0em 0em 2em -4em rgba(0,2,6,0.12)',  ease:Cubic.easeInOut});
       //BTM-bar shadow
    //   var tween_RP_Expands = TweenMax.to(rp_BTM, 1.5, {boxShadow: '0em -4em 8em 0em rgba(0,2,6,0.03)', ease:Expo.easeOut});
   //   var tween_RP_Expands = TweenMax.to('#Btm-Img-Blur', 2, {scale: 0.67, opacity:0,  ease:Expo.easeOut});
       TweenMax.to(rp_BTM, 0.5, {backgroundColor: 'rgba(253, 254, 255, 0.95)', ease:Power2.easeInOut});
       TweenMax.to(video_BG, 1.0, {delay:0.1, height:'100%', opacity:1, ease:Expo.easeInOut});
       TweenMax.to(rp_img, 1.10, {delay:0.0, scale:0.5, opacity:0.0, ease:Expo.easeInOut});

       TweenMax.set(rp_h1, {transformOrigin:'10% 15em'});
       TweenMax.set(rp_h2, {transformOrigin:'10% 10em'});
       TweenMax.to(h1_h2, 1.10, {delay:0.0, scale:0.75, opacity:0.0, ease:Expo.easeInOut, force3D:false,});
     }
      else {
        setTimeout(function(){idPlayer.pause();},500);
        TweenMax.set('iframe', { autoAlpha:1, scaleY: 1,});
        TweenMax.to('iframe', 0.5, { autoAlpha:0, scaleY: 0, ease:Power4.easeOut});

        TweenMax.to(RP_cont, 1.5, {width: 360, height: 360,boxShadow: '0em 14em 21em 0em rgba(0,2,6,0.05), 0em 40em 15em -23em rgba(0,2,6,0.08), 0em 55em 30em -23em rgba(0,2,6,0.12), 0em 60em 55em -23em rgba(0,2,6,0.10), 0 50em 120em -23em rgba(0,2,6,0.24)',  ease:Expo.easeOut});

      //  var tween_RP_Expands = TweenMax.to(rp_BTM, 1.5, {boxShadow: '0em 0em 0em 0em rgba(0,2,6,0.02)',  ease:Expo.easeOut});
      //  var tween_RP_Expands = TweenMax.to('#Btm-Img-Blur', 1.5, {scale: 1, opacity:0.3,  ease:Expo.easeOut});
        TweenMax.to(rp_BTM, 1.0, {backgroundColor: 'rgba(253, 254, 255, 0.3)', ease:Expo.easeInOut});
        TweenMax.to(video_BG, 1.25, {height:'65em',opacity:0, ease:Expo.easeOut});
     //   TweenMax.to(video_BG, 0.1, {delay:0.25, opacity:0.0,  ease:Power0.easeOut});
        TweenMax.to(rp_img, 1.5, {delay:0.0, scale:1, opacity:0.95, ease:Expo.easeOut});

        TweenMax.to(rp_h1, 1, {transformOrigin:'38% 9em', opacity:0.7});
        TweenMax.to(rp_h2, 1, {transformOrigin:'38% 7em', opacity:0.4});
        TweenMax.to(h1_h2, 1.5, {delay:0.0, scale:1, ease:Expo.easeOut, force3D:false,});
     }
  });



});
