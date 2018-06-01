var timerId = setTimeout(myTimer, 4000);

function myTimer(){
    console.log(10);
    $("body").removeClass("main");
    $("body").addClass("main2");
    $("g").remove();
    $("svg").remove();
}
