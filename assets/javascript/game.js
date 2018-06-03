$(document).ready(function() {
    var artistDetailDiv = $(".artist-detail-div");
    artistDetailDiv.hide();
    var trackDiv = $(".tracks-div");
    trackDiv.hide();

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
        var apiKeyBandInTown = "codingbootcamp";
        var queryURLArtist  = "https://rest.bandsintown.com/artists/" + artist + "?app_id="+apiKeyBandInTown;
        console.log(queryURLArtist);
        var artistTrackDiv = $("#artist-track");
        artistTrackDiv.empty();
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
                        var artistTrackHtml = $("<p>").addClass("track left-align");
                         artistTrackDiv.append(artistTrackHtml.html(track).append($("<i>")
                         .addClass("material-icons right play").text("play_circle_outline")));
                         trackDiv.show();
                       
                        // playVideo(track,artistName);
                    }     
                });//3rd api
            });//2nd api
        });//1st api
      }//end of function searchBandsInTown

      function playVideo(track,artistName){
        var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q="+track+" by "+artistName+"&type=video&key=AIzaSyDxxuZIfzfQ8B49df69ZPTapVglg6HJd5Q";
        console.log(queryURL);
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);
            var title = response.items[0].snippet.title;
            var vid = response.items[0].id.videoId;
            var videoDiv = $("");
            var link = $("<a>");
            link.attr("href","https://www.youtube.com/watch?v="+vid+"?autoplay=1&cc_load_policy=1&loop=1");
            videoDiv.append(link);
        });
      }
      //lyric to be added



      $("#select-artist").on("click", function(event) {
        event.preventDefault(); 
        var inputArtist = $(".artist-input").val().trim();  
        searchBandsInTown(inputArtist);
      });


    






















});