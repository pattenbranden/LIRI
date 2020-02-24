
// ! ! THIS PROJECT WAS A COLLABORATION BETWEEN SHARON PATTEN AND BRANDEN PATTEN ! !

pry = require('pryjs')
// used to store information in the hidden process.env file
require("dotenv").config();
// Importing/requring axios.js. To pull the APIs from their specific sources.
const axios = require('axios');
// requiring node core module, To work with the file system module on your computer. 
const fs = require("fs");
//  import the `keys.js` file and store it in a variable
const keys = require("./keys.js");
// importing A simple to use API library for the Spotify REST API.
const Spotify = require('node-spotify-api');
// accessing spotify keys in 'hidden' file.
const spotify = new Spotify(keys.spotify);
// Importing/requring moment.js. To construct and output proper date notation.
var moment = require('moment');
//takes in cli argument, and sets it to a variable.
let argvFunction = process.argv[2];
//takes in cli argument, and sets it to a variable.
let argvSearch = process.argv[3];
function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + argvSearch + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // If the axios was successful...
            // Then log the body from the site!
            // console.log(response.data[0]);
            console.log("---------------------------------");
            console.log("\nName of the Venue: " + response.data[0].venue.name);
            console.log("\nVenue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region)
            console.log("\nDate of the Event: " + moment(response.data[0].datetime).format("MM-DD-YYYY"));
            console.log("\n---------------------------------");
        });
};
function spotifyThis() {
    spotify
        .search({
            type: 'track',

            query: argvSearch
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // artist
            console.log("\n Song Artist: " + data.tracks.items[0].artists[0].name)
            // song name
            console.log("\n Song Name:" + data.tracks.items[0].name)
            // A preview link of the song from Spotify
            console.log("\n Preview link: \n" + data.tracks.items[0].preview_url)
            // The album that the song is from
            console.log("\n Album: " + data.tracks.items[0].album.name + "\n")
            console.log("---------------------------------");
        });
};
function movieThis() {

    if (argvSearch == undefined) {
        argvSearch = "Mr. Nobody"
    }
    axios({
        method: 'get',
        url: "http://www.omdbapi.com/?t=" + argvSearch + "&y=&plot=short&apikey=trilogy"
        // responseType: 'stream'
    })
        .then(function (response) {
            // console.log(response.data)
            console.log("____________________")
            console.log("Movie Title: " + response.data.Title)
            console.log("\nRelease year " + (response.data.Year))
            console.log("\nThe movie's rating is: " + response.data.imdbRating);
            console.log("\nRotten Tomatoes rating is:  " + response.data.Ratings[1].Value)
            console.log("\nCountry filmed in: " + response.data.Country)
            console.log("\nLanguages: " + response.data.Language)
            console.log("\nPlot: " + response.data.Plot)
            console.log("\nActors: " + response.data.Actors)
            console.log("____________________")
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
    //output title
    //output release year
    //output IMDB rating
    //output Rotten Romatoes Rating
    //out country of origin
    //movie language
    //plot of movie
    //actors in movie

    //defaults to movie search 'Mr. Nobdy'

}
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        // we gotta split the random.txt into an Array, split using the position of ","
        data = data.split(",")
        argvSearch = data[1].slice(1, (data[1].length -1))
        console.log(data)
        if (data[0] == "concert-this") {
            concertThis(argvSearch)
        } else if (data[0] == "spotify-this-song") {
            spotifyThis(argvSearch)
        } else if (data[0] == "movie-this") {
            movieThis(argvSearch)
        }
        // Cause I love enabling broken functionality
        //else if (data[0] == "do-what-it-says"){
        //     doWhatItSays()
        // }
    });
}
switch (argvFunction) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
};
