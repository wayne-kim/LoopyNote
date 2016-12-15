$(document).ready(function(){
  //영상
  $(".glyphicon-play.start").on("click", startRecording)
  $(".glyphicon-stop").on("click", stopRecording)
  $(".glyphicon-pause").on("click",pauseRecording)
  $(".glyphicon-play.resume").on("click", resumeRecording)

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
