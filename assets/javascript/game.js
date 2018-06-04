$(document).ready(function() {
    var artistDetailDiv = $(".artist-detail-div");
    artistDetailDiv.hide();
    var trackDiv = $(".tracks-div");
    trackDiv.hide();
    var artistTrackDiv = $("#artist-track");
    var playDiv = $(".youtube-vdo");
    playDiv.hide();
    var nowplayDiv = $(".now-play");
    var ticketsDiv = $(".tickets-div")
    ticketsDiv.hide();
    var i = 0;

   // generate top 10 tags
    function generateGenre(){
        var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";
        var queryURLGenre = "http://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key="+apiKeyLastFm+"&format=json";
        $.ajax({
            url: queryURLGenre,
            method: "GET"
          }).then(function(response) {
            console.log(response);
            var genreArray = response.toptags.tag;
            for(var i = 0; i < 10; i++){
                console.log(genreArray[i].name);
                var genre = genreArray[i].name;
                var genreLink = $("<a>").text(genre);
                genreLink.addClass("waves-effect waves-light btn-small cyan darken-2");
                genreLink.attr("data-genre",genre);
                $("#genre").append(genreLink);
            }
          });
    }//end of function generateGenre

    generateGenre();

    function searchBandsInTown(artist) {
        i = 0;
        var apiKeyBandInTown = "codingbootcamp";
        var queryURLArtist  = "https://rest.bandsintown.com/artists/" + artist + "?app_id="+apiKeyBandInTown;
        console.log(queryURLArtist);
        artistTrackDiv.empty();
        playDiv.hide();
        nowplayDiv.empty();
        //1st api call
        $.ajax({
          url: queryURLArtist,
          method: "GET"
        }).then(function(response) {
           console.log(response);
           var artistName = response.name;
           var mbid = response.mbid;
           var trackers = response.tracker_count;
           var artistNameHtml = $("#artist-name").html(artistName);
      
           var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";
           queryURLArtist = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artistName+"&mbid="+mbid+"&api_key="+apiKeyLastFm+"&format=json";
       
          
          //2nd api call
          $.ajax({
                url: queryURLArtist,
                method: "GET"
           }).then(function(response) {
                console.log(response);
                var artistBio = response.artist.bio.summary;
                var artistImageUrl = response.artist.image[3]["#text"];
                var artistImageHtml = $("#artist-image").attr("src",artistImageUrl);
                artistImageHtml.attr("data-caption",artistName);
                var artistBioHtml = $("#artist-bio").html(artistBio);
                artistDetailDiv.show();

                var queryURLTrack = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="+artistName+"&mbid="+mbid+"&api_key="+apiKeyLastFm+"&format=json";
                console.log("3rd: "+queryURLTrack); 
    
                //3rd api call
                $.ajax({
                    url: queryURLTrack,
                    method: "GET"
                }).then(function(response) {
                    console.log(response);
                    var trackArray = response.toptracks.track;
                    var tracks = [];
                    for(var i = 0; i<10;i++){
                        console.log("*"+trackArray[i].name);
                        var track = trackArray[i].name;
                        tracks.push(track);
                        getVideo(track,artistName);
                    }

                    //4th api call
                    var apiTickets = "hkwzBibHMfcvN0cppcq6tQrtKdHlCp44";
                    var city = "Los Angeles";
                    // var keyword = "korn";
                    var querlyUrlTicketmaster = "https://app.ticketmaster.com/discovery/v2/attractions.json?city=" + city + "&keyword=" + artistName + "&classificationName=music&dmaId=324&apikey=" + apiTickets;

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
                                $(".ticket-link").attr("href", results[i].url);
                                // console.log(results[i].images);
                                // console.log(results[i].images[1].url);
                                $(".background").attr("src", results[i].images[1].url);
                                $(".background").append(results[i].images[1].url);
                                ticketsDiv.show();
                                $('.slider').slider({height:300});
                            }
                        },
                        error: function (xhr, status, err) {

                        }
                    });   //4th api call  
                });//3rd api
            });//2nd api
        });//1st api
      }//end of function searchBandsInTown

      function getVideo(track,artistName){
        var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q="+track+" by "+artistName+"&type=video&key=AIzaSyDxxuZIfzfQ8B49df69ZPTapVglg6HJd5Q";
        console.log(queryURL);
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);
            var youtubeTitle = response.items[0].snippet.title;
            var vid = response.items[0].id.videoId;
            var icon = $("<i>").addClass("material-icons right play").html("play_circle_outline");
            var artistTrackHtml = $("<p>").addClass("track left-align");
            artistTrackDiv.append(artistTrackHtml.html(track).append(icon));
            artistTrackHtml.attr("data-artist",artistName);
            artistTrackHtml.attr("data-title",track);
            artistTrackHtml.attr("data-vid",vid);
            artistTrackHtml.attr("data-youtubetitle", youtubeTitle);
            trackDiv.show();         
            //initial video
            if(i===0){
                showYoutubeVideo(vid, youtubeTitle);
                artistTrackHtml.addClass("red-text");
                icon.removeClass("play").addClass("now-play").html("play_circle_filled");
            }
            i++;
        });
      }


       //play video
       $("#artist-track").on("click", ".track",function(event) {
            nowplayDiv.empty();
            $(".track").removeClass("red-text");
            var allIcons = $(".track").children();
            allIcons.removeClass("now-play").addClass("play").html("play_circle_outline");
            var inputTrack = $(this).attr("data-title");
            var artist = $(this).attr("data-artist");
            var vid = $(this).attr("data-vid");
            var youtubeTitle = $(this).attr("data-youtubetitle");
            showYoutubeVideo(vid, youtubeTitle);
            var icon = $(this).children();
            icon.removeClass("play").addClass("now-play").html("play_circle_filled");
            $(this).addClass("red-text");
      });

      
      function showYoutubeVideo(vid, youtubeTitle){
        var embedlyCard = $("<blockquote class='embedly-card'>");
        var videoDiv = $("<h4>");
        var link = $("<a>").attr("href","https://www.youtube.com/watch?v="+vid+"?autoplay=1&cc_load_policy=1&loop=1");
        var hDiv = videoDiv.append(link);
        var embedlyDiv = embedlyCard.append(hDiv);
        var titleDiv =  $("<div>").addClass("youtube-title");
        var scroll = $("<marquee behavior='scroll' direction='left'>").text(youtubeTitle);
        titleDiv.append(scroll);
        nowplayDiv.append(titleDiv, embedlyDiv);
        playDiv.show();
      }

      //lyric to be added



      $("#select-artist").on("click", function(event) {
        event.preventDefault(); 
        var inputArtist = $(".artist-input").val().trim();  
        searchBandsInTown(inputArtist);
      });


    






















});