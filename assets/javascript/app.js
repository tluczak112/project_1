function searchBandsInTown(artist) {
    var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";

    var queryURLArtist = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + artist + "&api_key="+apiKeyLastFm+"&format=json";

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
       console.log(queryURLArtist);
       console.log(response);

       var artistArray = response.results.artistmatches.artist;
       for(var i = 0; i< artistArray.length; i++){
           var artistName = artistArray[i].name;
           var artistImageUrl = artistArray[i].image[2]["#text"];
           var mbid = artistArray[i].mbid;
           var listeners = artistArray[i].listeners;
           if(artistName.toLowerCase() === artist.toLowerCase()){
             $("#artist-div").addClass("artist-div");
              var artistDiv = $("<div>");
              artistDiv.attr("data-mbid",mbid);
              var imageDiv = $("<div>");
              var artistImage = $("<img>").attr("src",artistImageUrl);
              var name = $("<h1>").text(artistName);
              var listenersP = $("<p>").text("Listeners: "+listeners);
              imageDiv.append(artistImage);
              artistDiv.append(imageDiv, name);

             
              console.log(mbid);
              queryURLArtist = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist+"&mbid="+mbid+"&api_key="+apiKeyLastFm+"&format=json";
              console.log("2nd: "+queryURLArtist);      
              
              //2nd api call
               $.ajax({
                   url: queryURLArtist,
                   method: "GET"
               }).then(function(response) {
                   console.log(response);
                   var artistBio = response.artist.bio.summary;
                   var bioP = $("<p>").html("Bio:"+artistBio);
                   artistDiv.append(bioP,listenersP);
                   $("#artist-div").append(artistDiv);    
   
               });

               
               queryURLArtist = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="+artist+"&mbid="+mbid+"&api_key="+apiKeyLastFm+"&format=json";
               console.log("3rd: "+queryURLArtist); 
               //3rd api call
               $.ajax({
                   url: queryURLArtist,
                   method: "GET"
               }).then(function(response) {
                   console.log(response);
                    var trackArray = response.toptracks.track;
                    $("#top-track-div").html("<h1>Top 10 Tracks</h1>")
                    $("#top-track-div").addClass("track-div");
                    for(var i = 0; i<10;i++){
                        console.log(trackArray[i].name);
                        var track = trackArray[i].name;
                       // var playCount = trackArray[i].playcount;
                        var trackDiv = $("<div>");
                        trackDiv.addClass("track")
                        trackDiv.attr("data-artist",artistName);
                        trackDiv.html(track);
                        $("#top-track-div").append(trackDiv);

                    }                
               });
              
               break;
           }     
       }
      
    });
  }

  $("#select-artist").on("click", function(event) {
   
    event.preventDefault();
    
    var inputArtist = $("#artist-input").val().trim();

    
    searchBandsInTown(inputArtist);
  });


  $("#top-track-div").on("click", ".track",function(event) {
    $("#lyric-div").empty();
    var inputTrack = $(this).text();
    var artist = $(this).attr("data-artist");
    var apiKey = "S0unXXfz6D5EzyIM6971qYOyXZa96p0TB8WIPPxH1NCAPNT17QMNVPlrWFEMg6mL";
    $("#lyric-div").addClass("lyric");
    var queryURLLyric = "https://orion.apiseeds.com/api/music/lyric/"+artist+"/"+inputTrack+"?apikey="+apiKey;
    $.ajax({
        url: queryURLLyric,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var lyric = response.result.track.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        var inputTrackHtml = $("<h1>").text("Lyric: "+inputTrack);
        $("#lyric-div").append(inputTrackHtml, JSON.stringify(lyric));         
    });

  });