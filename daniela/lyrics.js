$(document).ready(function () {
    var artistName = "drake";
    var songTitle = "gods plan";
    var apiLyrics = "3ovTtzy3bh4BgFmV33tZ1xoRY5DbXgj7azJKfxROe8b6kbMhc8tIWBPnP5dHDypJ";
    var queryUrlLyrics = "https://orion.apiseeds.com/api/music/lyric/" + artistName + "/" + songTitle + "?apikey=" + apiLyrics;



    $.ajax({
        url: queryUrlLyrics,
        method: "GET"
    }).then(function (response) {

        console.log(response.result)
        console.log(response.result.artist.name)
        console.log(response.result.track.name)
        console.log(response.result.track)
        $(".artist-name").text(JSON.stringify(response.result.artist.name));
        $(".song-name").text(JSON.stringify(response.result.track.name));
        $(".lyrics").text(JSON.stringify(response.result.track.text));

    });















});