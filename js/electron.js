$(document).ready(function(){
  //키보드 설정
  Mousetrap.bind('f1', function() {
    console.log('f1');
  }, 'keyup');

  Mousetrap.bind('ctrl+s', function() {
    $('#myModal').modal('show');
  }, 'keyup');


  //저장
  //modal event init
  $("#save").on("click",function(){
    var fileName = $("#fileName").val()
    $("#fileName").val('')
    var text = $(".editable")

    fs.writeFile(filePath+"/"+fileName, text.html(), (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });

  })

  //불러오기
  $(".nav.nav-tabs .list").on("click",function(){
    //파일 경로 파일들 가져오기

    fs.readdir(filePath,function(err,files){
        if(err)throw err;

        if(files.length>0){
          $(".list-group").html("")
          for(file in files){
            let tag = '<li class="list-group-item list-group-item-info">'+files[file]+'</li>'
            $(".list-group").append(tag)
          }
        }else{

        }
    })

  })//불러오기
})//function end
