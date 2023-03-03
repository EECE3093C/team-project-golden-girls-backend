const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const gamesRetrieve = require('./api/api_retrieve/nba/Game.js');
const gamesSend = require('./api/api_send/nba/Game.js');
const standingsRetrieve = require('./api/api_retrieve/nba/Standings.js');

console.log("Making initial API calls...")
// make initial api calls
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
    games = gamesSend.getNBAData();
    res.send({ express: games });
});

