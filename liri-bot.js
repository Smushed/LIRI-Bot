/**
 * Assumes user setup has been completed
 * API KEYS ECT
 */
//What the app requires, gathering the API Keys and placing them correctly
require("dotenv").config()
const spotifyKeys = require("./keys.js")
const Spotify = require("node-spotify-api")

//config the Spotify API
const spotify = new Spotify({
    id: spotifyKeys.spotifyAPIInfo.id,
    secret: spotifyKeys.spotifyAPIInfo.secret
})

// get the user input

const liriCommand = process.argv[2];
let input = process.argv[3];

if (input === undefined) {
    input = "The Sign, Ace of Base"
}

const concertThis = function () {
    console.log("Concert This")
}

const spotifyThisSong = function () {
    spotify.search({ type: "track", query: input, limit: 1 })
        .then(function (response) {
            //Parsing the response object and assigning it to variables for readability
            const artist = response.tracks.items[0].artists[0].name;
            const songName = response.tracks.items[0].name;
            const spotifyURL = response.tracks.items[0].external_urls.spotify;
            const album = response.tracks.items[0].album.name;

            console.log(`Artist: ${artist}`);
            console.log(`Song Name: ${songName}`);
            console.log(`URL: ${spotifyURL}`);
            console.log(`Album: ${album}`);
        }).catch(function (err) {
            console.log(err);
        });
};

switch (liriCommand) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("I don't understand")
}

