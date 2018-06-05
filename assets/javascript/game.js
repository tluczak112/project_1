$(document).ready(function () {
    var artistDetailDiv = $(".artist-detail-div");
    artistDetailDiv.hide();
    var trackDiv = $(".tracks-div");
    trackDiv.hide();
    var artistTrackDiv = $("#artist-track");
    var playDiv = $(".youtube-vdo");
    playDiv.hide();
    var nowplayDiv = $(".now-play");
    var ticketsDiv = $(".tickets-div");
    ticketsDiv.hide();
    var i = 0;
    var lyricsDiv = $(".lyrics-div");
    lyricsDiv.hide();
    var genreDiv = $(".genre-div");
    genreDiv.hide();
    var bottomDiv = $(".bottom-video");
    bottomDiv.hide();
    var favoriteDiv = $(".favorite-div");
    favoriteDiv.hide();
    var errorDiv = $(".error-div");
    errorDiv.hide();
    var apiKeyLastFm ="c5170f76db40cf305fa1f7989ee80687";
    // local Storage
    var favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // generate top 10 tags
    function generateGenre() {
        var apiKeyLastFm = "c5170f76db40cf305fa1f7989ee80687";
        var queryURLGenre = "https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=" + apiKeyLastFm + "&format=json";
        $.ajax({
            url: queryURLGenre,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var genreArray = response.toptags.tag;
            for (var i = 0; i < 10; i++) {
                console.log(genreArray[i].name);
                var genre = genreArray[i].name;
                var genreLink = $("<a>").text(genre);
                genreLink.addClass("waves-effect waves-light btn-small cyan darken-2 tag");
                genreLink.attr("data-genre", genre);
                $("#genre").append(genreLink);
            }
        });
    }//end of function generateGenre

    generateGenre();

    function searchBandsInTown(artist) {
        i = 0;
        var apiKeyBandInTown = "codingbootcamp";
        var queryURLArtist = "https://rest.bandsintown.com/artists/" + artist + "?app_id=" + apiKeyBandInTown;
        console.log(queryURLArtist);
        artistTrackDiv.empty();
        playDiv.hide();
        nowplayDiv.empty();
        genreDiv.hide();
        bottomDiv.empty();
        favoriteDiv.hide();
        errorDiv.hide();
        clearSelectedGenre();

        //1st api call
        $.ajax({
            url: queryURLArtist,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var artistName = response.name;
            var mbid = response.mbid;
            var trackers = response.tracker_count;
            var artistNameHtml = $("#artist-name").html(artistName);

            var apiKeyLastFm = "c5170f76db40cf305fa1f7989ee80687";
            queryURLArtist = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistName + "&mbid=" + mbid + "&api_key=" + apiKeyLastFm + "&format=json";


            //2nd api call
            $.ajax({
                url: queryURLArtist,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var artistBio = response.artist.bio.summary;
                var artistImageUrl = response.artist.image[3]["#text"];
                var artistImageHtml = $("#artist-image").attr("src", artistImageUrl);
                artistImageHtml.attr("data-caption", artistName);
                var artistBioHtml = $("#artist-bio").html(artistBio);
               
                
                $(".favt").attr("data-fav",artistName);
                $(".favt").attr("data-favImg",artistImageUrl);

                 //favorite check
                favIconOnLoad(artistName,artistImageUrl);

                artistDetailDiv.show();

                var queryURLTrack = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artistName + "&mbid=" + mbid + "&api_key=" + apiKeyLastFm + "&format=json";
                console.log("3rd: " + queryURLTrack);

                //3rd api call
                $.ajax({
                    url: queryURLTrack,
                    method: "GET"
                }).then(function (response) {
                    console.log(response);
                    var trackArray = response.toptracks.track;
                    var tracks = [];
                    for (var i = 0; i < 10; i++) {
                        console.log("*" + trackArray[i].name);
                        var track = trackArray[i].name;
                        tracks.push(track);
                        getVideo(track, artistName);


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
                            $("#caro").html("");
                            for (i = 0; i < results.length; i++) {
       
                                var list = $("<li>");
                                    var img = $("<img>");
                                    img.addClass("background");
                                    img.attr("src", results[i].images[1].url)
                        
                                list.append(img);

                                var div = $("<div>");
                                div.addClass("caption center-align")
                                
                                    var h3 = $("<h3>");
                                    h3.html(results[i].name);
                                    div.append(h3);
                                    var h5 = $("<h5>");
                                    h5.addClass("light grey-text text-lighten-3");
                                
                                        var a = $("<a>");
                                        a.addClass("ticket-link");
                                        a.attr("href", results[i].url);
                                        a.text("Buy Tickets");
                                        h5.append(a);
                                
                                    div.append(h5);

                                list.append(div);

                                $("#caro").append(list)

                                ticketsDiv.show();
                                $('.slider').slider({ height: 300 });
                            }
                        },
                        error: function (xhr, status, err) {

                        }
                    });   //4th api call  
                });//3rd api
            });//2nd api
        }).fail(function(){
            console.log("error");
            artistDetailDiv.hide();
            trackDiv.hide();
            playDiv.hide();
            ticketsDiv.hide();
            errorDiv.show();
        });//1st api
    }//end of function searchBandsInTown

    function getVideo(track, artistName) {
        var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + track + " by " + artistName + "&type=video&key=AIzaSyDxxuZIfzfQ8B49df69ZPTapVglg6HJd5Q";
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var youtubeTitle = response.items[0].snippet.title;
            var vid = response.items[0].id.videoId;
            var icon = $("<i>").addClass("material-icons right play").html("play_circle_outline");
            var artistTrackHtml = $("<p>").addClass("track left-align");
            artistTrackDiv.append(artistTrackHtml.html(track).append(icon));
            artistTrackHtml.attr("data-artist", artistName);
            artistTrackHtml.attr("data-title", track);
            artistTrackHtml.attr("data-vid", vid);
            artistTrackHtml.attr("data-youtubetitle", youtubeTitle);
            trackDiv.show();
            //initial video
            if (i === 0) {
                showYoutubeVideo(vid, youtubeTitle);
                getLyrics(artistName, track);
                artistTrackHtml.addClass("red-text");
                icon.removeClass("play").addClass("now-play").html("play_circle_filled");
                lyricsDiv.hide();
            }
            i++;
        });
    }


    //play video
    $("#artist-track").on("click", ".track", function (event) {
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

        getLyrics(artist, inputTrack);


    });

    //lyrics function
    
    function getLyrics(artist, inputTrack) {
        var apiLyrics = "3ovTtzy3bh4BgFmV33tZ1xoRY5DbXgj7azJKfxROe8b6kbMhc8tIWBPnP5dHDypJ";
        var queryUrlLyrics = "https://orion.apiseeds.com/api/music/lyric/" + artist + "/" + inputTrack + "?apikey=" + apiLyrics;

        $.ajax({
            url: queryUrlLyrics,
            method: "GET"
        }).then(function (response) {

            var lyric = response.result.track.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
            var inputTrackHtml = $("<h1>").text(artist + " : " + inputTrack);
            $(".lyrics-title").html(inputTrackHtml);
            $(".show-lyrics").html(JSON.stringify(lyric));

            lyricsDiv.show();

        }).fail(function () {
            console.log("error");
            var inputTrackHtml = $("<h1>").text("Lyric: " + inputTrack);
            $(".lyrics-title").html(inputTrackHtml);
            $(".show-lyrics").html(inputTrackHtml, "Lyric Not Found");
            lyricsDiv.show();
        });

    }

    function showYoutubeVideo(vid, youtubeTitle){
        var embedlyDiv = createEmbedly(vid);
        var titleDiv =  $("<div>").addClass("youtube-title");
        var scroll = $("<marquee behavior='scroll' direction='left'>").text(youtubeTitle);
        titleDiv.append(scroll);
        nowplayDiv.append(titleDiv, embedlyDiv);
        playDiv.show();
  }

  function createEmbedly(vid){
        var embedlyCard = $("<blockquote class='embedly-card'>");
        var videoDiv = $("<h4>");
        var link = $("<a>").attr("href","https://www.youtube.com/watch?v="+vid+"?autoplay=1&cc_load_policy=1&loop=1");
        var hDiv = videoDiv.append(link);
        var embedlyDiv = embedlyCard.append(hDiv);
        return embedlyDiv;
  }



    $("#select-artist").on("click", function (event) {
        event.preventDefault();
        var inputArtist = $(".artist-input").val().trim();
        searchBandsInTown(inputArtist);
    });
    
    function linkToYoutube(track,artistName){
        var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q="+track+" by "+artistName+"&type=video&key=AIzaSyDxxuZIfzfQ8B49df69ZPTapVglg6HJd5Q";
        console.log(queryURL);
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);
            var youtubeTitle = response.items[0].snippet.title;
            var vid = response.items[0].id.videoId;
            var thumbnail = response.items[0].snippet.thumbnails.high.url;
            console.log(youtubeTitle, thumbnail, vid);
            var listDiv = $("<li>").addClass("collection-item avatar grey darken-4 left-align list-div");
            var thumbnailImage = $("<img>").attr("src",thumbnail);
            thumbnailImage.addClass("circle artist-thumbnail responsive-img");
            thumbnailImage.attr("data-caption",artistName);
            var songTitle = $("<span>").addClass("title track-title");
            songTitle.html(track);
            var artist = $("<p>").addClass("name");
            var artistLink = $("<a>").html(artistName).addClass("artist-icon");
            artistLink.attr("data-name", artistName);
            artist.append(artistLink);
            artist.addClass("artist-redirect");
            var iconContainer = $("<a>").addClass("secondary-content");
            // var favIcon = $("<i>").addClass("material-icons cyan-text text-darken-2 fav").text("grade");
            var playIcon = $("<i>").addClass("material-icons cyan-text text-darken-2 play-track").text("play_circle_outline");
            playIcon.attr("data-vid",vid);
            iconContainer.append(playIcon);
            listDiv.append(thumbnailImage,songTitle,artist,iconContainer);
            $("#genre-track").append(listDiv);
        });
      }

     //click on genre tag
      $("#genre").on("click", ".tag", function(event) {
        console.log("hello");
        $("#genre-track").empty();
        bottomDiv.empty();
        clearSelectedGenre();
        $(this).removeClass("cyan darken-2").addClass("red darken-4"); 
        var genre = $(this).attr("data-genre");
        var queryURLTag = "https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag="+genre+"&api_key="+apiKeyLastFm+"&format=json";
        genreDiv.show();
        hideAll();
        $.ajax({
            url: queryURLTag,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var toptrackArrayByGenre = response.tracks.track;
            $("#genre-title").html("Top Tracks: "+genre);
            for(var i = 0; i < 10; i++){
                  var track = toptrackArrayByGenre[i].name;
                  var artistName = toptrackArrayByGenre[i].artist.name;
                  console.log(track, artistName);   
                  linkToYoutube(track, artistName); 
            }
        }).fail(function() {
            console.log("error");
        });
      });
      
      function clearSelectedGenre(){
        $(".tag").removeClass("red darken-4").addClass("cyan darken-2");
      }
      //video closed
      $(".bottom-video").on("click", ".close", function(event) {
           $(".play-track").removeClass("red-text").addClass("cyan-text");
           $(".play-track").html("play_circle_outline");
           $(".track-title").removeClass("red-text");
           $(".bottom-video").empty();
      });
      

      //play top tracks
      $("#genre-track").on("click", ".play-track", function(event) {
            $(".play-track").removeClass("red-text").addClass("cyan-text");
            $(".track-title").removeClass("red-text");
            $(".play-track").html("play_circle_outline");
            $(this).html("play_circle_filled");
            var title = $(this).parent().prev().prev();
            title.addClass("red-text");
            bottomDiv.empty();
            bottomDiv.show();
            $(this).removeClass("cyan-text").addClass("red-text");
            var vid = $(this).attr("data-vid");
            var embedlyDiv = createEmbedly(vid);
            var closeSymbmol = $("<i>").addClass("far fa-times-circle close");
            bottomDiv.append(embedlyDiv,closeSymbmol);
      });

    $("#genre-track").on("click", ".artist-icon", function(event) {
       var artist = $(this).attr("data-name");
       console.log(artist);
       searchBandsInTown(artist);
    });


    //adding to favorite
    $(".favt").on("click",function(event){
        var favArtist = $(".favt").attr("data-fav");
        var favArtistImage = $(".favt").attr("data-favImg");
        console.log(favArtist,favArtistImage);
        //favt not found...add to fav!
        if(findObjectByKey(favorites, 'favArtist', favArtist)===-1){
            console.log("added to fav!");
            addToFavorite();
            favorites.push({favArtist,favArtistImage});
            localStorage.setItem("favorites", JSON.stringify(favorites));
            
        }
        else{
            removeFromFavorite();
            var favIndex = findObjectByKey(favorites, 'favArtist', favArtist);
            console.log(favIndex);
            favorites.splice(favIndex,1);
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
        console.log(favorites);
    });

    function addToFavorite(){
        $(".favt").removeClass("deep-orange lighten-3 pulse").addClass("red");
        $(".favt").attr("data-tooltip","Remove from favorite");
    }

    function removeFromFavorite(){
        $(".favt").removeClass("red").addClass("deep-orange lighten-3 pulse");
        $(".favt").attr("data-tooltip","Add to favorite");     
    }
    
    function favIconOnLoad(favArtist,favArtistImage){

        if(findObjectByKey(favorites, 'favArtist', favArtist)===-1){
           removeFromFavorite();
        }
        else{
            addToFavorite();
        }
       
    }

    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return -1;
    }

   //show favorites
   $(".fav-link").on("click",function(event){
       console.log(favorites);
       hideAll();
       genreDiv.hide();
       clearSelectedGenre();
       favoriteDiv.show();
       showFavArtists();
   });
    

   function showFavArtists(){
       $("#list-favorites").empty();
       if(favorites.length===0){
        var container = $("<div>").addClass("col m12 fav-artist");
        var message = $("<p>").addClass("message").html("You currently do not have any favorite artists saved!");
        container.append(message)
        $("#list-favorites").append(container);  
       }
       else{
        for(var i = 0; i<favorites.length;i++){
            var container = $("<div>").addClass("col s12 m2 fav-artist");
            console.log(favorites[i].favArtistImage);
            var img = $("<img>").attr("src",favorites[i]["favArtistImage"]);
            img.addClass("responsive-img circle fav-artist-img");
            img.attr("data-artistname",favorites[i]["favArtist"]);
            var span = $("<span>").addClass("flow-text fav-artist-name").text(favorites[i]["favArtist"]);
            span.attr("data-favartistname",favorites[i]["favArtist"]);
            container.append(img,span);
            $("#list-favorites").append(container);                    
        }
       }
       
   }

   $("#list-favorites").on("click",".fav-artist-img",function(event){
        var artistName = $(this).attr("data-artistname");
        searchBandsInTown(artistName);
   }).on("click",".fav-artist-name",function(event){
        var artistName = $(this).attr("data-favartistname");
        searchBandsInTown(artistName);
   });

    function hideAll(){
        artistDetailDiv.hide();
        trackDiv.hide();
        playDiv.hide();
        ticketsDiv.hide();
        bottomDiv.hide();
        favoriteDiv.hide();
        errorDiv.hide();
    }

});
