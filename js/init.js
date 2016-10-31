var electron = require('electron')
var fs = electron.remote.require('fs');
var app = electron.remote.app;

const filePath = "./data"

var video, video2;
var canvas;
var ctx;

var chunks = new Array();
var downloadLink = document.createElement('a');
var videoElement = document.createElement('video');
var mediaRecorder;

$(document).ready(function(){

  //tab init
  var tabs = $(".nav.nav-tabs .tab")
  $(".body").hide()
  $(".body.memo").show();

  tabs.on("click", function(e){
    tabs.removeClass("active")
    $(e.target).parent().addClass("active")

    var classNames = $(e.target).parent().attr("class").split(" ")
    $(".body").hide()
    $(".body."+classNames[1]).show()
    console.log(classNames[1])
  });

  //tab quit init
  $("#btnQuit").on("click",function(){
    app.quit()
  })

  //Key setting
  $(window).keypress(function(event) {
    if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
    $('#myModal').modal('show')
  });

  //녹화-재생
  $(".glyphicon-play.start").on("click",function(){
    $(".glyphicon-play.start").hide()
    $(".glyphicon-stop").show()
    $(".glyphicon-pause").show()
  })
  $(".glyphicon-stop").on("click",function(){
    $(".glyphicon-stop").hide()
    $(".glyphicon-pause").hide()
    $(".glyphicon-play.resume").hide()
    $(".glyphicon-play.start").show()
  })
  $(".glyphicon-pause").on("click",function(){
    $(".glyphicon-pause").hide()
    $(".glyphicon-play.resume").show()
    //$(".glyphicon-play").show()
  })
  $(".glyphicon-play.resume").on("click",function(){
    $(".glyphicon-pause").show()
    $(".glyphicon-play.resume").hide()
  })
  //소리
  $(".glyphicon-volume-up").on("click",function(){
    $(".glyphicon-volume-up").hide()
    $(".glyphicon-volume-off").show()
  })
  $(".glyphicon-volume-off").on("click",function(){
    $(".glyphicon-volume-off").hide()
    $(".glyphicon-volume-up").show()
  })
  //아이콘 기본 세팅
  $(".glyphicon-play.resume").hide()
  $(".glyphicon-pause").hide()
  $(".glyphicon-stop").hide()
  $(".glyphicon-volume-off").hide()

  //이전 사진
  $(".glyphicon-chevron-left.picture").on("click",function(){
    var imgs = $("img")
    var length = imgs.length
    var i;

    for(i=0;i<length;i++){
      if($("img").eq(i).is(":visible")){
        break
      }
    }
    if(i === 0){
      $(".glyphicon-chevron-left.picture").attr("disabled", true);
    }else{
      $(".glyphicon-chevron-right.picture").removeAttr("disabled", true);
      imgs.hide()
      imgs.eq(i-1).show()
    }
  })
  //다음 사진
  $(".glyphicon-chevron-right.picture").on("click",function(){
    var imgs = $("img")
    var length = imgs.length
    var i;

    for(i=0;i<length;i++){
      if($("img").eq(i).is(":visible")){
        break
      }
    }

    if(i === length-1){
      $(".glyphicon-chevron-right.picture").attr("disabled", true);
    }else{
      $(".glyphicon-chevron-left.picture").removeAttr("disabled", true);
      imgs.hide()
      imgs.eq(i+1).show()
    }
  })

  //이전 영상
  $(".glyphicon-chevron-left.video").on("click",function(){
    var videos = $(".body.video video")
    var length = videos.length
    var i;

    for(i=0;i<length;i++){
      if($(".body.video video").eq(i).is(":visible")){
        break
      }
    }
    if(i === 0){
      $(".glyphicon-chevron-left.video").attr("disabled", true);
    }else{
      $(".glyphicon-chevron-right.video").removeAttr("disabled", true);
      videos.hide()
      videos.eq(i-1).show()
    }
  })
  //다음 영상
  $(".glyphicon-chevron-right.video").on("click",function(){
    var videos = $(".body.video video")
    var length = videos.length
    var i;

    for(i=0;i<length;i++){
      if($(".body.video video").eq(i).is(":visible")){
        break
      }
    }
    if(i === length-1){
      $(".glyphicon-chevron-right.video").attr("disabled", true);
    }else{
      $(".glyphicon-chevron-left.video").removeAttr("disabled", true);
      videos.hide()
      videos.eq(i+1).show()
    }
  })

  //영상
  $(".glyphicon-play.start").on("click", startRecording)
  $(".glyphicon-stop").on("click", stopRecording)
  $(".glyphicon-pause").on("click",pauseRecording)
  $(".glyphicon-play.resume").on("click", resumeRecording)

  //save modal event init
  $("#save").on("click",function(){
    var fileName = $("#fileName").val()
    $("#fileName").val('')
    var text = $(".editable")

    fs.writeFile(filePath+"/"+fileName, text.html(), (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });

  })

  //load modal event init
  $(".nav.nav-tabs .list").on("click",function(){
    $('#myModal2').modal('show');

    fs.readdir(filePath,function(err,files){
      if(err)throw err;
      if(files.length>0){
        $(".list-group").html("")
        for(file in files){
          let tag = '<li class="list-group-item list-group-item-info">'+files[file]+'</li>'
          $(".list-group").append(tag)
        }
      }else{
        $(".list-group").html("")
        let tag = '<li class="list-group-item list-group-item-danger">저장된 파일 없음</li>'
        $(".list-group").append(tag)
      }
    })
  })
  $(".list-group").on("click", ".list-group-item", function(event){
    console.log($(event.target).text())
    var contents = fs.readFileSync(filePath+"/"+$(event.target).text(), {
      encoding : "utf-8",
      flag : "r"
    })
    $(".editable").append(contents)
    $('#myModal2').modal('hide');
  })

  //비디오 & 오디오
  function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  //영상 세팅
  if (hasGetUserMedia()) {
    // Good to go!
    var errorCallback = function(e) {
      console.log('Reeeejected!', e);
    };

    video = document.querySelector('video');
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    navigator.getUserMedia({
      video: {
        mandatory: {
          minWidth: 700,
          minHeight: 300,
          maxWidth: 750,
          maxHeight: 440
        }
      },audio: true
    }, function(stream) {
      //video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream);

      mediaRecorder = new MediaRecorder(stream,{
        audioBitsPerSecond : 128000,
        videoBitsPerSecond : 2500000,
        mimeType : 'video/webm'
      });

      mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
      };

      mediaRecorder.onerror = function(e){
        console.log('Error: ', e);
      };

      mediaRecorder.onstart = function(){
        console.log('Started, state = ' + mediaRecorder.state);
      };

      mediaRecorder.onstop = function(){
        console.log('Stopped, state = ' + mediaRecorder.state);
        let blob = new Blob(chunks, {type: "video/webm"});
        console.log(blob)
        chunks = [];

        let videoURL = window.URL.createObjectURL(blob);
        downloadLink.href = videoURL;
        videoElement.src = videoURL;
        downloadLink.innerHTML = 'Download video file';

        let rand = Math.floor((Math.random() * 10000000));
        let name = "video_"+rand+".mp4" ;
        downloadLink.setAttribute( "download", name);
        downloadLink.setAttribute( "name", name);

        //$(".body.picture").append(downloadLink)
        let video = document.createElement('video');
        video.src =  videoURL;
        video.controls = true;
        video.autoplay = false;
        video.width = 750;
        video.height = 440;

        $(".body.video").append(video);
        $(".body.video video").hide()
        $(".body.video video").eq($(".body.video video").length-1).show()
      };

      mediaRecorder.onwarning = function(e){
        console.log('Warning: ' + e);
      };

      video.onloadedmetadata = function(e) {
        // Ready to go. Do some stuff.
      };
    }, errorCallback);
  } else {
    alert('getUserMedia() is not supported in your browser');
  }

  //카메라 세팅
  $(".glyphicon-camera").on("click",getPicture)

  function getPicture(){
    ctx.drawImage(video, 0, 0, 750, 440);
    var img = document.createElement('img');
    img.src = canvas.toDataURL('image/webp');
    $(".body.picture").append(img)
    $(".glyphicon-chevron-left.picture").removeAttr("disabled", true);

    $("img").hide()
    $("img").eq($("img").length-1).show()
    //document.querySelector('img').src = canvas.toDataURL('image/webp');
  }

  function startRecording() {
    console.log("촬영시작");
    mediaRecorder.start();
  }
  function stopRecording() {
    console.log("촬영종료");
    mediaRecorder.stop();
  }
  function pauseRecording(){
    console.log("촬영 일시중지")
    mediaRecorder.pause();
  }
  function resumeRecording(){
    console.log("촬영 재개")
    mediaRecorder.resume();
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

})
