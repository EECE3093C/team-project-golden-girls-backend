const dotenv = require('dotenv');
dotenv.config(); // load the env variables
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 9000;
const gamesRetrieve = require('./api/api_retrieve/nba/game-get.js');
const gamesSend = require('./api/api_send/nba/game-send.js')
const scoresSend = require('./api/api_send/nba/score-live-send.js');
const scoresRetrieve = require('./api/api_retrieve/nba/score-get.js');
const standingsRetrieve = require('./api/api_retrieve/nba/standings-get.js');

app.use(cors());

// make initial api calls
console.log("Making initial API calls...")

scoresRetrieve.getLiveScore();
gamesRetrieve.getGames();
standingsRetrieve.getStandings();

console.log("Initial API calls complete.")

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
let baseRoute = '/api/v1/';
app.get(baseRoute + 'healthy', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT! YAY!' });
});

app.get(baseRoute + 'games', (req, res) => {
    if (req.params.start_date && req.params.end_date && req.params.sport) {
        const start_date = req.params.start_date;
        const end_date = req.params.end_date;
        const sport = req.params.sport;
    }
    games = gamesSend.sendNBAGames();
    res.send(games);
});

app.get(baseRoute + 'live', (req, res) => {
    if (req.params.start_date && req.params.end_date && req.params.sport) {
        const sport = req.params.sport;
    }
    scoresRetrieve.getLiveScore();
    gamesRetrieve.getGames();
    scores = scoresSend.sendNBAScores();
    res.send(scores);
});
