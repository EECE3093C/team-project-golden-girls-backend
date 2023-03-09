const fs = require('fs');
const tools = require('../../tools.js');

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
 * @date: [Date Created: 03/02/23 / Modified: 03/09/23]
 * 
*/

async function sendNBAGames(recievedGameData, recievedStandingData, number_of_days = 2) {
    // Get current local date and UTC date
    let currentLocalDate = new Date(Date.now() + (-300 * 60 * 1000))
    const currentUTCDate = new Date();

    /**
     * Define the paths used to retrieve data when building JSON object.
     */
    const TEAM_COLORS_STORE_PATH = `assets/colors.json`; // Path to file containing the NBA team colors

    // Initialize variables
    const dateRange = [];
    let gameFileData, dateStr;
    let combinedGamesData = [];
    const response = {};
    response.games = [];

    // Build date range based on number of days requested
    for (let i = 0; i < number_of_days; i++) { 
        dateRange.push(currentLocalDate);
        currentLocalDate = new Date(currentLocalDate.getTime() + 86400000); // add 24 hours in milliseconds
    }

    standings = recievedStandingData;

    // Iterate through date range and retrieve game data for each date
    dateRange.forEach(date => {
        let currentDateGamesData = [];
        utcDate = new Date(date.getTime() + (300 * 60 * 1000))
        dateSearchRange = tools.getGameDatesUTC(date, utcDate);

        // Retrieve game data for each date and combine into array
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

    // Build response object
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