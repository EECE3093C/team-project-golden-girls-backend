const tools = require('../../tools.js');

/**
 * File: ScoreLive.js
 * Description: The ScoreLive.js file contains a process for parsing stored JSON files from the
 *  API-NBA and building a JSON object to be sent to the front end. It retrieves data on games, 
 *  to assign related information to the JSON object. The process uses several tools and
 *  functions to parse and organize the data, including removing words from strings, looking
 *  up team colors and records, and formatting dates and times.
 * 
 * @author: [Nate Louder]
 * @date: [Date Created: 03/06/23 / Modified: 03/09/23]
*/

async function sendNBAScores(recievedGameData, recievedStandingData, recievedScoreData, number_of_days = 1){

    // Get the current local date, adjusting for timezone offset
    let currentLocalDate = new Date(Date.now() + (-300 * 60 * 1000))
    
    // If it's before 3 AM local time, adjust the date range and number of days
    if (currentLocalDate.getHours() < 3){
        currentLocalDate = new Date(currentLocalDate.getTime() - 86400000)
        number_of_days = number_of_days + 1;
    }

    // Create an array of dates in the date range specified by number_of_days
    const dateRange = [];
    for (let i = 0; i < number_of_days; i++) { 
        dateRange.push(currentLocalDate);
        currentLocalDate = new Date(currentLocalDate.getTime() + 86400000); // add 24 hours in milliseconds
    }

    let gameData, dateStr;
    let combinedGamesData = [];
    const response = {};
    response.games = [];

    // Loop through each date in the date range
    dateRange.forEach(date => {
        let currentDateGamesData = [];

        // Convert the date to UTC and get the search range for games on that date
        utcDate = new Date(date.getTime() + (300 * 60 * 1000))
        dateSearchRange = tools.getGameDatesUTC(date, utcDate);

        // Loop through each date in the search range and add the games to the current date's games
        dateSearchRange.forEach(dateSearch => {
            dateStr = (`${dateSearch.getUTCFullYear()}-${("0" + (dateSearch.getUTCMonth() + 1)).slice(-2)}-${("0" + dateSearch.getUTCDate()).slice(-2)}`);
            try {
                gameData = recievedGameData[dateStr];
            } catch (err) {
                console.log(err);
            }
            currentDateGamesData = currentDateGamesData.concat(tools.gamesToday(date, gameData.response));
   
        });
        // Combine the current date's games with the overall list of games
        combinedGamesData = combinedGamesData.concat(currentDateGamesData);
    });

    // Check if each score in the score data corresponds to a live game and update the list of games accordingly
    for (let i = 0; i < recievedScoreData.response.length; i++) {
        let games = combinedGamesData
        combinedGamesData = tools.isGameInLive(recievedScoreData.response[i], games);
    }

    // Convert each game data object to a more concise format and add it to the response object
    combinedGamesData.forEach(gameData => {
        
        let singleGameObj = {
            "id": gameData.id,
            "date": gameData.date.start,
            "startTime": gameData.date.start,
            "endTime": gameData.date.end
        };
        singleGameObj.gameStatus = {
            "statusLong": gameData.status.long,
            "statusShort": gameData.status.short,
            "gameQuarter": gameData.periods.current,
            "clock": gameData.status.clock,
            "halftime": gameData.status.halftime
        }
        singleGameObj.homeTeam = {
            "name": gameData.teams.home.nickname,
            "city": tools.removeWordsFromString(gameData.teams.home.name, gameData.teams.home.nickname),
            "logo": gameData.teams.home.logo,
            "totalScore": gameData.scores.home.points,
            "quarterScore": gameData.scores.home.linescore,
            "record": tools.lookForTeamRecord(gameData.teams.home.name, recievedStandingData),
            "code": gameData.teams.home.code
        };
        singleGameObj.awayTeam = {
            "name": gameData.teams.visitors.nickname,
            "city": tools.removeWordsFromString(gameData.teams.visitors.name, gameData.teams.visitors.nickname),
            "logo": gameData.teams.visitors.logo,
            "totalScore": gameData.scores.visitors.points,
            "quarterScore": gameData.scores.visitors.linescore,
            "record": tools.lookForTeamRecord(gameData.teams.visitors.name, recievedStandingData),
            "code": gameData.teams.visitors.code
        };

        response.games.push(singleGameObj); // Add the singleGameObj to a list of games in response
    });
    return response; // Return the response object to be sent to front end
}


module.exports = {
    sendNBAScores
}