var electron = require('electron')
var fs = electron.remote.require('fs');
var app = electron.remote.app;

const filePath = "./data"

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
  });
  
  //tab quit init
  $("#btnQuit").on("click",function(){
    app.quit()
  })

  //node.js & elctron init
})
