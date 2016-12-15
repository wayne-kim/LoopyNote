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

  //save modal event init
  $("#save").on("click",function(){
    //text
    var folderName = $("#fileName").val()
    $("#fileName").val('')

    fs.mkdirSync(filePath+"/"+folderName)

    var text = $(".editable")
    fs.writeFile(filePath+"/"+folderName+"/text", text.html(), (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
      $(".editable").html('')
    });

    //img
    let imgs = $("img")
    let length = imgs.length
    for(let i=length-1; i>=0; i--){
      let data = imgs.eq(i).attr("src")
      let buf = new Buffer(data);
      imgs.eq(i).remove()

      fs.writeFile(filePath+"/"+folderName+"/IMG"+i, buf , (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    }

    //video : 구글링하면 분명 나오겠지만 몹시 귀찮
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
    $(".editable").html('')
    //text
    let contents = fs.readFileSync(filePath+"/"+$(event.target).text()+"/text", {
      encoding : "utf-8",
      flag : "r"
    })
    $(".editable").append(contents)
    //picture
    let imgs = fs.readdir(filePath+"/"+$(event.target).text(), function(err, files){
      if(err)throw err;
      if(files.length>1){
        for(let i=0; i<files.length; i++){
          let temp = files[i];
          let temp2 = temp.split("IMG")
          if(temp2.length>1){
            fs.readFile(filePath+"/"+$(event.target).text()+"/"+temp, (err,data)=>{
              if(err) throw err;
              let decodedImage = new Buffer(data, 'base64').toString('binary');
              let img = document.createElement("IMG");
              img.src = decodedImage;
              $(".body.picture").append(img)
            })
          }
        }
      }
    })
    //video

    $('#myModal2').modal('hide');
  })
})
