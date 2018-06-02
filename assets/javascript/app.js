
 $(document).ready(function() {
     function generateTags(){
    var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";
    queryURLTags = "http://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key="+apiKeyLastFm+"&format=json";
    $.ajax({
        url: queryURLTags,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        var tagArray = response.toptags.tag;
        for(var i = 0; i < 10; i++){
            console.log(tagArray[i].name);
            var tag = tagArray[i].name;
            var tagBtn = $("<button>").text(tag);
            tagBtn.addClass("tagBtn");
            tagBtn.attr("data-genre",tag);
            $("#tag").append(tagBtn);
        }
      });
}


 generateTags();

function searchBandsInTown(artist) {
    var apiKeyBandInTown = "codingbootcamp";
    var queryURLArtist  = "https://rest.bandsintown.com/artists/" + artist + "?app_id="+apiKeyBandInTown;
   
    //1st api call
    $.ajax({
      url: queryURLArtist,
      method: "GET"
    }).then(function(response) {

      $("#artist-div").empty();
      $("#artist-div").removeClass();
      $("#top-track-div").empty();
      $("#top-track-div").removeClass();
      $("#lyric-div").removeClass();
      $("#lyric-div").empty();
      $("#genre-div").empty();
      $("#video-div").empty();
       console.log(queryURLArtist);
       console.log(response);
      
       var artistName = response.name;
       var mbid = response.mbid;
       var trackers = response.tracker_count;
       $("#artist-div").addClass("artist-div");
       var artistDiv = $("<div>");
       var name = $("<h1>").text(artistName);
       var trackersP = $("<p>").text("Trackers: "+trackers);
                  
       
        var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";
        queryURLArtist = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artistName+"&mbid="+mbid+"&api_key="+apiKeyLastFm+"&format=json";
        console.log("2nd: "+queryURLArtist);      
        
        //2nd api call
        $.ajax({
            url: queryURLArtist,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var artistBio = response.artist.bio.summary;
            var artistImageUrl = response.artist.image[3]["#text"];
            var imageDiv = $("<div>");
            var artistImage = $("<img>").attr("src",artistImageUrl);
            imageDiv.append(artistImage);
            var bioP = $("<p>").html("Bio:"+artistBio);
            artistDiv.append(imageDiv, name,bioP,trackersP);
            $("#artist-div").append(artistDiv);    

            queryURLArtist = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="+artistName+"&mbid="+mbid+"&api_key="+apiKeyLastFm+"&format=json";
            console.log("3rd: "+queryURLArtist); 
    
            //3rd api call
            $.ajax({
                url: queryURLArtist,
                method: "GET"
            }).then(function(response) {
               // console.log(response);
                var trackArray = response.toptracks.track;
                $("#top-track-div").html("<h1>Top Tracks</h1>")
                $("#top-track-div").addClass("track-div");
                var tracks = [];
                for(var i = 0; i<10;i++){
                    console.log("*"+trackArray[i].name);
                    var track = trackArray[i].name;
                    tracks.push(track);
                    playVideo(track,artistName);
                }
            });
        });   
    });
  }

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
        var trackDiv = $("<div>");
        trackDiv.addClass("track")
        trackDiv.attr("data-artist",artistName);
        trackDiv.attr("data-title",title);
        trackDiv.attr("data-vid",vid);
        trackDiv.html(title);
        // var link = $("<a target='_blank'>");
        // link.attr("href","https://www.youtube.com/watch?v="+vid);
        // link.text(track);
       // trackDiv.append(link);
        $("#top-track-div").append(trackDiv);
    });
  }


  $("#select-artist").on("click", function(event) {
    event.preventDefault(); 
    var inputArtist = $("#artist-input").val().trim();  
    searchBandsInTown(inputArtist);
  });

  var players = [];


  $("#top-track-div").on("click", ".track",function(event) {
    $("#lyric-div").empty();
    $("#video-div").empty();
    var inputTrack = $(this).text();
    var artist = $(this).attr("data-artist");
    var vid = $(this).attr("data-vid");
    var apiKey = "S0unXXfz6D5EzyIM6971qYOyXZa96p0TB8WIPPxH1NCAPNT17QMNVPlrWFEMg6mL";
    $("#lyric-div").addClass("lyric");
    var queryURLLyric = "https://orion.apiseeds.com/api/music/lyric/"+artist+"/"+inputTrack+"?apikey="+apiKey;
    console.log(queryURLLyric);
    var blk = $("<blockquote class='embedly-card'>");
    var link = $("<a>");
    link.attr("href","https://www.youtube.com/watch?v="+vid+"?autoplay=1&cc_load_policy=1&loop=1");
    var linkH = $("<h4>");
    linkH.append(link);
    blk.append(linkH,$("<p>"));
    $("#video-div").append(blk);
   
   
    $.ajax({
        url: queryURLLyric,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var lyric = response.result.track.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        var inputTrackHtml = $("<h1>").text("Lyric: "+inputTrack);
        $("#lyric-div").append(inputTrackHtml, JSON.stringify(lyric));         
    }).fail(function() {
        console.log("error");
        var inputTrackHtml = $("<h1>").text("Lyric: "+inputTrack);
        $("#lyric-div").append(inputTrackHtml, "Lyric Not Found"); 
    });
 });

 $("#tag").on("click",".tagBtn",function(){
     var genre = $(this).attr("data-genre");
     console.log(genre+" this is clicked");
     var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";
     var queryURLTag = "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag="+genre+"&api_key="+apiKeyLastFm+"&format=json";
     console.log(queryURLTag);
     $("#genre-div").empty();
     $("#top-track-div").empty();
     $("#artist-div").empty();
     $("#top-track-div").removeClass();
     $("#artist-div").removeClass();
     $("#lyric-div").empty();
     $("#lyric-div").removeClass();
     $.ajax({
        url: queryURLTag,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var toptrackArrayByGenre = response.tracks.track;
        for(var i = 0; i < 10; i++){
              var track = toptrackArrayByGenre[i].name;
              var artist = toptrackArrayByGenre[i].artist.name;
              console.log(track, artist);
              var trackDiv = $("<div>").html(track+" by "+artist);
              trackDiv.addClass("track");
              $("#genre-div").append(trackDiv);
        }
    }).fail(function() {
        console.log("error");
    });
     
  })
});
