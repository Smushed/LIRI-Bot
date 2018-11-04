/**
 * Assumes user setup has been completed
 * API KEYS ECT
 */

// get the user input

const command = process.argv[2];

const concertThis = function () {
    console.log("Concert This")
}

switch (command) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    default:
        console.log("I don't understand")
}
