var electron = require('electron')
var fs = electron.remote.require('fs');
var app = electron.remote.app;

const filePath = "./data"

var video;
var canvas;
var ctx
var localMediaStream = null;

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
  $(".glyphicon-play").on("click",function(){
    $(".glyphicon-play").hide()
    $(".glyphicon-stop").show()
    $(".glyphicon-pause").show()
  })
  $(".glyphicon-stop").on("click",function(){
    $(".glyphicon-stop").hide()
    $(".glyphicon-pause").hide()
    $(".glyphicon-play").show()
  })
  $(".glyphicon-pause").on("click",function(){
    $(".glyphicon-pause").hide()
    $(".glyphicon-play").show()
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
  $(".glyphicon-stop").hide()
  $(".glyphicon-pause").hide()
  $(".glyphicon-volume-off").hide()

  //사진
  $(".glyphicon-chevron-left").on("click",function(){
    var imgs = $("img")
    var length = imgs.length
    var node;

    for(let i=0;i<length;i++){
      if($("img").eq(i).is(":visible")){
          node =  i
          console.log(node)
          break
      }
    }

    if(node === 0){
      $(".glyphicon-chevron-left").attr("disabled", true);
    }else{
      $(".glyphicon-chevron-right").removeAttr("disabled", true);
      imgs.hide()
      imgs.eq(node-1).show()
    }
  })
  $(".glyphicon-chevron-right").on("click",function(){
    var imgs = $("img")
    var length = imgs.length
    var node;

    for(let i=0;i<length;i++){
      if($("img").eq(i).is(":visible")){
          node =  i
          console.log(node)
          break
      }
    }

    if(node === length-1){
      $(".glyphicon-chevron-right").attr("disabled", true);
    }else{
      $(".glyphicon-chevron-left").removeAttr("disabled", true);
      imgs.hide()
      imgs.eq(node+1).show()
    }
  })

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

  //카메라 세팅
  $(".glyphicon-camera").on("click",function(){
    ctx.drawImage(video, 0, 0, 750, 440);
    var img = document.createElement('img');
    img.src = canvas.toDataURL('image/webp');
    $(".body.picture").append(img)
    $("img").hide()
    $("img").eq($("img").length-1).show()
    //document.querySelector('img').src = canvas.toDataURL('image/webp');
  })

  //영상 세팅
  if (hasGetUserMedia()) {
    // Good to go!
    var errorCallback = function(e) {
      console.log('Reeeejected!', e);
    };

    video = document.querySelector('video');
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    localMediaStream = null;

    // Not showing vendor prefixes.
    navigator.getUserMedia({
      video: true,
      audio: true,
      video: {
        mandatory: {
          minWidth: 700,
          minHeight: 300,
          maxWidth: 750,
          maxHeight: 440
        }
      }
    }, function(stream) {
      video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream);
      localMediaStream = stream;
      // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
      // See crbug.com/110938.
      video.onloadedmetadata = function(e) {
        // Ready to go. Do some stuff.
      };
    }, errorCallback);
  } else {
    alert('getUserMedia() is not supported in your browser');
  }
})
