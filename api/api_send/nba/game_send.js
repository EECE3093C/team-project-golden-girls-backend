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
const tools = require('../../tools.js');

async function sendNBAGames(recievedGameData, recievedStandingData, number_of_days = 1) {

    let currentLocalDate = new Date(Date.now() + (-300 * 60 * 1000))
    const currentUTCDate = new Date();

    /**
    * define the paths used to retrieve data when building JSON object.
    */
   
    const TEAM_COLORS_STORE_PATH = `assets/colors.json`; //path to file containg the NBA team colors
    
    const dateRange = [];
    let gameFileData, dateStr;
    let combinedGamesData = [];
    const response = {};
    response.games = [];
    
    for (let i = 0; i < number_of_days; i++) { 
        dateRange.push(currentLocalDate);
        currentLocalDate = new Date(currentLocalDate.getTime() + 86400000); // add 24 hours in milliseconds
    }

    standings = recievedStandingData;

    dateRange.forEach(date => {
        let currentDateGamesData = [];
        utcDate = new Date(date.getTime() + (300 * 60 * 1000))
        dateSearchRange = tools.getGameDatesUTC(date, utcDate);

        dateSearchRange.forEach(dateSearch => {
            dateStr = (`${dateSearch.getUTCFullYear()}-${("0" + (dateSearch.getUTCMonth() + 1)).slice(-2)}-${("0" + dateSearch.getUTCDate()).slice(-2)}`);
            try {
                gameFileData = recievedGameData[dateStr];
            } catch (err) {
                console.log(err);
            }
            currentDateGamesData = currentDateGamesData.concat(tools.gamesToday(date, gameFileData.response));
        });
        combinedGamesData = combinedGamesData.concat(currentDateGamesData);
    });

    response.timeFrame = {"startDate": dateRange[0], "endDate": dateRange[dateRange.length - 1]};
    combinedGamesData.forEach(gameData => {
        
        let singleGameObj = {
            "id": gameData.id,
            "statusShort": gameData.status.short,
            "statusLong": gameData.status.long,
            "date": gameData.date.start
        };
        singleGameObj.homeTeam = {
            "name": gameData.teams.home.nickname,
            "city": tools.removeWordsFromString(gameData.teams.home.name, gameData.teams.home.nickname),
            "teamColor": tools.lookForColor(gameData.teams.home.name, JSON.parse(fs.readFileSync(TEAM_COLORS_STORE_PATH))),
            "logo": gameData.teams.home.logo,
            "totalScore": gameData.teams.home.points,
            "quarterScore": gameData.teams.home.linescore,
            "record": tools.lookForTeamRecord(gameData.teams.home.name, standings),
            "code": gameData.teams.home.code
        };
        singleGameObj.awayTeam = {
            "name": gameData.teams.visitors.nickname,
            "city": tools.removeWordsFromString(gameData.teams.visitors.name, gameData.teams.visitors.nickname),
            "teamColor": tools.lookForColor(gameData.teams.visitors.name, JSON.parse(fs.readFileSync(TEAM_COLORS_STORE_PATH))),
            "logo": gameData.teams.visitors.logo,
            "totalScore": gameData.teams.visitors.points,
            "quarterScore": gameData.teams.visitors.linescore,
            "record": tools.lookForTeamRecord(gameData.teams.visitors.name, standings),
            "code": gameData.teams.visitors.code
        };

        response.games.push(singleGameObj);
    });
    return response;
}


module.exports = { sendNBAGames };