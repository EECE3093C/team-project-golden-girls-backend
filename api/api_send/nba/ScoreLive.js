/**
 * File: ScoreLive.js
 * Description: The ScoreLive.js file contains a process for parsing stored JSON files from the
 *  API-NBA and building a JSON object to be sent to the front end. It retrieves data on games, 
 *  to assign related information to the JSON object. The process uses several tools and
 *  functions to parse and organize the data, including removing words from strings, looking
 *  up team colors and records, and formatting dates and times.
 * 
 * @author: [Nate Louder]
 * @date: [Date Created: 03/06/23 / Modified: 03/06/23]
 * 
 * HISTORY:
 *  - 3/6/23, Nate Louder(nate-dev): Created file. Setup process to parse through the stored 
 *  JSON files from API-NBA and pull data to build JSON object being sent to front end.
 */

const fs = require('fs');
const tools = require('../../tools.js');

function sendNBAScores(){
    let date_ob = new Date()
    date_ob.setUTCDate(date_ob.getUTCDate());
    let season = tools.getSeason(date_ob);
    let response;

    /**
     * sets date to the current utc date
     */

    const day = ("0" + date_ob.getUTCDate()).slice(-2);
    const month = ("0" + (date_ob.getUTCMonth() + 1)).slice(-2);
    const date = (`${date_ob.getUTCFullYear()}-${month}-${day}`);

    /**
     * define the paths used to retrieve data when building JSON object.
    */
    const scoresStorePath = `data/NBA/scores/${season}/`; //path to the directory where live score data is stored
    const standingsStorePath = `data/NBA/standings/${season}`; //path to the directory where standings data is stored
    const teamColorsFilePath = `assets/colors.json`; //path to file containg the NBA team colors
    const scoresTemplatePath = `api/api_send_templates/live_games.json` //path to file containg the JSON template for live games object

    /**
     * retrieves the games send_api_template for live games and stores them in the response variables.
     */

    let data;
    try {
        response = JSON.parse(fs.readFileSync(scoresTemplatePath))
        standings = JSON.parse(fs.readFileSync(`${standingsStorePath}/${date}.json`))
        data = fs.readFileSync(`${scoresStorePath}/${date}.json`)
    } catch (err) {
        console.log(err);
    }

    /**  
    * build game object will contain the info of each game and be add added to the list of games after each one is built.
    */
    let bGameOb = JSON.parse(JSON.stringify(response.games[0]));

    let games = JSON.parse(data)

    for (let i = 0; i < games.response.length; i++) {
        let game = games.response[i];
        let tempbGameOb = JSON.parse(JSON.stringify(bGameOb));

        //Home team parse
        tempbGameOb.homeTeam.name = game.teams.home.nickname;
        tempbGameOb.homeTeam.city = tools.removeWordsFromString(game.teams.home.name, `${game.teams.home.nickname}`);
        tempbGameOb.homeTeam.logo = game.teams.home.logo;
        tempbGameOb.homeTeam.totalScore = game.scores.home.points;
        tempbGameOb.homeTeam.code = game.teams.home.code;
        tempbGameOb.homeTeam.quarterScores = game.scores.home.linescore;
        tempbGameOb.homeTeam.record = tools.lookForTeamRecord(game.teams.home.name, standings);

        //Away team parse
        tempbGameOb.awayTeam.name = game.teams.visitors.nickname;
        tempbGameOb.awayTeam.city = tools.removeWordsFromString(game.teams.visitors.name, `${game.teams.visitors.nickname}`);
        tempbGameOb.awayTeam.logo = game.teams.visitors.logo;
        tempbGameOb.awayTeam.totalScore = game.scores.visitors.points;
        tempbGameOb.awayTeam.code = game.teams.visitors.code;
        tempbGameOb.awayTeam.quarterScores = game.scores.visitors.linescore;
        tempbGameOb.awayTeam.record = tools.lookForTeamRecord(game.teams.visitors.name, standings);

        //Other parse

        /**
         * unique id for each game
         */
        tempbGameOb.id = game.id;

        /**
         * date and time are sent in ETC time
         */
        const utcTimeStart = new Date(game.date.start)
        const utcTimeEnd = new Date(game.date.end)
        const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        const dateStringStart = utcTimeStart.toLocaleString('en-US', options);
        const dateStringEnd = utcTimeEnd.toLocaleString('en-US', options);
        tempbGameOb.date = dateStringStart.split(', ')[0];
        tempbGameOb.startTime = dateStringStart.split(', ')[1] + " ETC";
        tempbGameOb.endTime = dateStringEnd.split(', ')[1] + " ETC";

        /**
         * status long can be one of the following: Not Started, live, Finished
         * status short can be one of the following: 1, 2, 3
         */
        tempbGameOb.gameStatus.statusLong = game.status.long;
        tempbGameOb.gameStatus.statusShort = game.status.short;
        tempbGameOb.gameStatus.gameQuarter = game.periods.current;
        tempbGameOb.gameStatus.clock = game.status.clock;
        tempbGameOb.gameStatus.halftime = game.status.halftime;

        /**
         * overwrites the original template with the first item and then appends
         * the remaining items to the end of the games list.
         */
        if (i == 0) {
            response.games[i] = tempbGameOb;
        }
        else {
            response.games.push(tempbGameOb);
        };

    };
    return response; //return the response object to be sent to front end
}

module.exports = {
    sendNBAScores
}