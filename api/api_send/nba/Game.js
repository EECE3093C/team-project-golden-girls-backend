/**
 * File: Game.js
 * Description: The Games.js file contains a process for parsing stored JSON files from the
 *  API-NBA and building a JSON object to be sent to the front end. It retrieves data on games
 *  and standings, creates a range of dates for the games being retrieved, sets the time frame
 *  for the first and last values of the date range, and loops through all the dates in the
 *  range to assign related information to the JSON object. The process uses several tools and
 *  functions to parse and organize the data, including removing words from strings, looking
 *  up team colors and records, and formatting dates and times.
 * 
 * @author: [Nate Louder]
 * @date: [Date Created: 03/02/23 / Modified: 03/03/23]
 * 
 * HISTORY:
 *  - 3/2/23, Nate Louder(nate-dev): Created file. Setup process to parse through the stored 
 *  JSON files from API-NBA and pull data to build JSON object being sent to front end.
 *  - 3/3/23, Nate Louder(nate-dev): finalized relationships between pull and send files.
 */

const fs = require('fs');
const { getGames } = require('../../api_retrieve/nba/Game.js');
const tools = require('../../tools.js');
 

function getNBAData(number_of_days=2) {
    
    /**
     * create date object used to name retrieve dated files and information
     */
    let date_ob = new Date()
    date_ob.setUTCDate(date_ob.getUTCDate());
    let season = tools.getSeason(date_ob);
    let response, standings;

    /**
     * define the paths used to retrieve data when building JSON object.
    */
    const gamesStorePath = `data/NBA/games`; //path to the directory where game data is stored
    const standingsStorePath = `data/NBA/standings/${season}`; //path to the directory where standings data is stored
    const teamColorsFilePath = `assets/colors.json`; //path to file containg the NBA team colors
    const gameTemplatePath = `api/api_send_templates/games.json` //path to file containg the JSON template for games object

    /**
     * create a range of dates for the games being retrieved.
     */
    let day, month = "";
    const dateRange = [];

    for (let i = 0; i < number_of_days; i++) {
        day = ("0" + date_ob.getUTCDate()).slice(-2);
        month = ("0" + (date_ob.getUTCMonth() + 1)).slice(-2);
        dateRange.push(`${date_ob.getUTCFullYear()}-${month}-${day}`);
        date_ob = new Date(date_ob.getTime() + 86400000); // add 24 hours in milliseconds
    }

    /**
     * retrieves the games send_api_template for games and stores it in the response variable.
     */
    try {
        response = JSON.parse(fs.readFileSync(gameTemplatePath))
        standings = JSON.parse(fs.readFileSync(`${standingsStorePath}/${dateRange[0]}.json`))
    } catch (err) {
        console.log(err);
    }

    /**  
     * set the time frame to the first and last values of the date range.
    */
    response.timeFrame.startDate = dateRange[0];
    response.timeFrame.endDate = dateRange[dateRange.length - 1];

    /**
     * loops through all the dates in the date range and assigns related info from the stored JSON 
     * files from API-NBA api to the api_send_templates.games JSON object to be sent to the front-end.
     */

    dateRange.forEach(date => {
        let data = fs.readFileSync(`${gamesStorePath}/${date}.json`)
        let games = JSON.parse(data);

        /**  
         * build game object will contain the info of each game and be add added to the list of games after each one is built.
        */
        let bGameOb = JSON.parse(JSON.stringify(response.games[0]));

        for (let i = 0; i < games.response.length; i++) {
            let game = games.response[i];
            let tempbGameOb = JSON.parse(JSON.stringify(bGameOb));

            //Home team parse
            tempbGameOb.homeTeam.name = game.teams.home.nickname;
            tempbGameOb.homeTeam.city = tools.removeWordsFromString(game.teams.home.name, `${game.teams.home.nickname}`);
            tempbGameOb.homeTeam.logo = game.teams.home.logo;
            tempbGameOb.homeTeam.totalScore = game.scores.home.points;
            tempbGameOb.homeTeam.code = game.teams.home.code;
            tempbGameOb.homeTeam.teamColor = tools.lookForColor(game.teams.home.name, JSON.parse(fs.readFileSync(teamColorsFilePath)));
            tempbGameOb.homeTeam.quarterScores = game.scores.home.linescore;
            tempbGameOb.homeTeam.record = tools.lookForTeamRecord(game.teams.home.name, standings);

            //Away team parse
            tempbGameOb.awayTeam.name = game.teams.visitors.nickname;
            tempbGameOb.awayTeam.city = tools.removeWordsFromString(game.teams.visitors.name, `${game.teams.visitors.nickname}`);
            tempbGameOb.awayTeam.logo = game.teams.visitors.logo;
            tempbGameOb.awayTeam.totalScore = game.scores.visitors.points;
            tempbGameOb.awayTeam.code = game.teams.visitors.code;
            tempbGameOb.awayTeam.teamColor = tools.lookForColor(game.teams.visitors.name, JSON.parse(fs.readFileSync(teamColorsFilePath)));
            tempbGameOb.awayTeam.quarterScores = game.scores.visitors.linescore;
            tempbGameOb.awayTeam.record = tools.lookForTeamRecord(game.teams.visitors.name, standings);

            //Other parse

            /**
             * unique id for each game
             */
            tempbGameOb.id = game.id;

            /**
             * date is sent in ETC time
             */
            const utcTime = new Date(game.date.start)
            const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
            const dateString = utcTime.toLocaleString('en-US', options);
            tempbGameOb.date = dateString.split(', ')[0];
            tempbGameOb.time = dateString.split(', ')[1] + " ETC";

            /**
             * status long can be one of the following: Not Started, live, Finished
             * status short can be one of the following: 1, 2, 3
             */
            tempbGameOb.statusLong = game.status.long;
            tempbGameOb.statusShort = game.status.short;

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
    });
    return response; //return the response object to be sent to front end
}

module.exports = { getNBAData };