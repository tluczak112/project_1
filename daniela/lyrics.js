$(document).ready(function () {
    // var artistName = "drake";
    // var songTitle = "gods plan";
    // var apiLyrics = "3ovTtzy3bh4BgFmV33tZ1xoRY5DbXgj7azJKfxROe8b6kbMhc8tIWBPnP5dHDypJ";
    // var queryUrlLyrics = "https://orion.apiseeds.com/api/music/lyric/" + artistName + "/" + songTitle + "?apikey=" + apiLyrics;
  


    // $.ajax({
    //     url: queryUrlLyrics,
    //     method: "GET"
    // }).then(function (response) {

    //     // console.log(response.result)
    //     // console.log(response.result.artist.name)
    //     // console.log(response.result.track.name)
    //     // console.log(response.result.track)
    //     $(".artist-name").text(JSON.stringify(response.result.artist.name));
    //     $(".song-name").text(JSON.stringify(response.result.track.name));
    //     $(".lyrics").text(JSON.stringify(response.result.track.text));

    // });




// var apiTickets = "hkwzBibHMfcvN0cppcq6tQrtKdHlCp44";
// var city = "Los Angeles";
// var keyword = "maroon 5";
// var querlyUrlTicketmaster = "https://app.ticketmaster.com/discovery/v2/attractions.json?city=" + city + "&keyword=" + keyword + "&classificationName=music&dmaId=324&apikey=" + apiTickets; 




//     $.ajax({
//         url: querlyUrlTicketmaster,
//         method: "GET"
//     }).then(function (response) {
//         var results = response._embedded.attractions;
//         // console.log(response._embedded.events)

//         for(i = 0; i < results.length; i++){
//             // console.log(results[i]);

//             // console.log(results[i].name);
//             // console.log(results[i].url);
//             // console.log(results[i].images);
//             // console.log(results[i].images[0].url);

         
//             $(".d-block").attr("src", results[i].images[1].url);
//             $(".d-block").append(results[i].images[1].url);
//             var slide = ".slide" + i;
//             $(slide).append(results[i].name + i);
//             $(".tickets").attr("href", results[i].url);
//         }


//         $(".map-widget").attr("w-keyword", keyword);
//         $('body').append("<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyADTX9e9tTjKQGNM7GwtlGCfwGWGg2298U&libraries=visualization,places' async defer> </script>");
//         $('body').append("<script src='https://ticketmaster-api-staging.github.io/products-and-docs/widgets/map/1.0.0/lib/main-widget.js'> </script>");

//     });


























    var apiTickets = "hkwzBibHMfcvN0cppcq6tQrtKdHlCp44";
    var city = "Los Angeles";
    var keyword = "korn";
    var querlyUrlTicketmaster = "https://app.ticketmaster.com/discovery/v2/attractions.json?city=" + city + "&keyword=" + keyword + "&classificationName=music&dmaId=324&apikey=" + apiTickets;

    $.ajax({
        type: "GET",
        url: querlyUrlTicketmaster,
        async: true,
        dataType: "json",
        success: function (response) {
            var results = response._embedded.attractions;
            // console.log(response._embedded.attractions)

            for (i = 0; i < results.length; i++) {
                // console.log(results[i]);

                // console.log(results[i].name);
                var slide = ".slide" + i;
                $(slide).append(results[i].name + i);

                console.log(results[i].url);
                $(".tickets").attr("href", results[i].url);
                // console.log(results[i].images);
                // console.log(results[i].images[1].url);
                $(".d-block").attr("src", results[i].images[1].url);
                $(".d-block").append(results[i].images[1].url);


                // $(".d-block").attr("src", results[i].images[1].url);
                // $(".d-block").append(results[i].images[1].url);
                // var slide = ".slide" + i;
                // $(slide).append(results[i].name + i);
                // $(".tickets").attr("href", results[i].url);
            }


        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });

});