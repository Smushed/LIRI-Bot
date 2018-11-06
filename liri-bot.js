/**
 * Assumes user setup has been completed
 * API KEYS ECT
 */
//What the app requires, gathering the API Keys and placing them correctly
require(`dotenv`).config();
/**Using request-promise so I can use .then and .catch when querying APIs using request
*Must Install request & request-promise modules in order for this to work
*Not 100 % nessessary but it makes readability much easier
*/
const request = require(`request-promise`);
const spotifyKeys = require(`./keys.js`);
const Spotify = require(`node-spotify-api`);
const moment = require(`moment`);
const fs = require("fs");

//config the Spotify API
const spotify = new Spotify({
    id: spotifyKeys.spotifyAPIInfo.id,
    secret: spotifyKeys.spotifyAPIInfo.secret
});

// Grabbing the user input from the command line
let liriCommand = process.argv[2];
const input = process.argv
//Combined input is if the user inputs spaces and it combines them in the for loop below
let combinedInput = ``;

//For loop so the user can include spaces in their request
for (let i = 3; i < input.length; i++) {
    if (i === 3) {
        combinedInput = input[i];
    } else {
        combinedInput = `${combinedInput} ${input[i]}`;
    }
};


const concertThis = function () {
    if (combinedInput === ``) {
        combinedInput = `Kiss`;
    };
    const query = {
        uri: `https://rest.bandsintown.com/artists/${combinedInput}/events?app_id=codingbootcamp`,
        json: true
    }
    request(query)
        .then(response => {
            //Checks if the response has come back with data. If it has not the artist has no upcoming shows
            if (response.length == 0) {
                console.log(`The band has no upcoming shows`)
            } else {
                //Parsing the reponse and assigning it to variables for readability
                let lineup = ``;
                const bandDate = moment(response[0].datetime).format(`MM/DD/YYYY`);
                const bandVenue = response[0].venue.name;
                const venueLocation = `${response[0].venue.city}, ${response[0].venue.region}`;

                //For Loop to parse the lineup array to return it
                for (let i = 0; i < response[0].lineup.length; i++) {
                    if (i === 0) {
                        lineup = response[0].lineup[i];
                    } else {
                        lineup = `, ${response[0].lineup[i]}`;
                    };
                }

                console.log(`Lineup: ${lineup}`)
                console.log(`Date: ${bandDate}`);
                console.log(`Venue: ${bandVenue}`);
                console.log(`Location: ${venueLocation}`);
            }
        }).catch(err => {
            console.log(err);
        });
};

const spotifyThisSong = function () {

    if (combinedInput === ``) {
        combinedInput = `The Sign, Ace of Base`;
    };

    spotify.search({ type: `track`, query: combinedInput, limit: 1 })
        .then(response => {
            //Parsing the response object and assigning it to variables for readability
            const artist = response.tracks.items[0].artists[0].name;
            const songName = response.tracks.items[0].name;
            const spotifyURL = response.tracks.items[0].external_urls.spotify;
            const album = response.tracks.items[0].album.name;

            //Logging the requested song to the console
            console.log(`Artist: ${artist}`);
            console.log(`Song Name: ${songName}`);
            console.log(`URL: ${spotifyURL}`);
            console.log(`Album: ${album}`);
        }).catch(err => {
            console.log(err);
        });
};

const movieThis = function () {

    if (combinedInput === ``) {
        combinedInput = `Mr. Nobody`;
    };
    const query = {
        uri: `http://www.omdbapi.com/?t=${combinedInput}&y=&plot=short&apikey=trilogy`,
        json: true
    }
    //Queries the OMDB API for the movie title that the user provided
    request(query)
        .then(response => {
            //Parsing the response object and assigning it to variables for readability
            const movieTitle = response.Title;
            const movieYear = response.Year;
            const IMDBRating = response.Ratings[0].Value;
            const RTRating = response.Ratings[1].Value;
            const movieCountry = response.Country;
            const movieLanguage = response.Language;
            const moviePlot = response.Plot;
            const movieActors = response.Actors;

            console.log(`Title: ${movieTitle}`);
            console.log(`Year: ${movieYear}`);
            console.log(`IMDB Rating: ${IMDBRating}`);
            console.log(`Rotten Tomatoes Rating: ${RTRating}`);
            console.log(`Country Produced: ${movieCountry}`);
            console.log(`Language: ${movieLanguage}`);
            console.log(`Plot: ${moviePlot}`);
            console.log(`Actors: ${movieActors}`);
        })
        .catch(err => {
            console.log(err)
        });
};

const doWhatItSays = function () {
    //Reads the random.txt file and inputs what it says
    fs.readFile(`random.txt`, `utf8`, function (error, data) {
        if (error) {
            return console.log(error);
        };
        //The random.txt must be formatted command,input
        liriCommand = data.split(`,`)[0];
        combinedInput = data.split(`,`)[1];
        decisionEngine();
    });
};

//Wrapped in a function to easily incorporate doWhatItSays
const decisionEngine = function () {
    switch (liriCommand) {
        case `concert-this`:
            concertThis();
            break;
        case `spotify-this-song`:
            spotifyThisSong();
            break;
        case `movie-this`:
            movieThis();
            break;
        case `do-what-it-says`:
            doWhatItSays();
            break;
        default:
            console.log(`I don't understand`);
    };
};

decisionEngine();