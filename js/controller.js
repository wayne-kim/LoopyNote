$(document).ready(function(){

  //탭 초기화 시
  var tabs = $(".nav.nav-tabs .tab")
  $(".panel-body").hide()
  tabs.on("click", function(e){
    tabs.removeClass("active")
    $(e.target).parent().addClass("active")

    var classNames = $(e.target).parent().attr("class").split(" ")
    $(".panel-body").hide()
    $(".panel-body."+classNames[1]).show()
  });
  //탭 초기화 끝
})
