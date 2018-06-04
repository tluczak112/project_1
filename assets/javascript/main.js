$(".main-page").hide();
var timerId = setTimeout(myTimer, 4000);

function myTimer(){
    // $("body").removeClass("main");
    // $("body").addClass("main2");
    $(".wrapper").remove();
     $(".main-page").show();
}

//materialize funtions
$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('.tooltipped').tooltip();
  });



