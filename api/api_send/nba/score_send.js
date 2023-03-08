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
const { getGames } = require('../../api_retrieve/nba/game_get.js');
const { getScores } = require('../../api_retrieve/nba/score_get.js');
const { getStandings } = require('../../api_retrieve/nba/standings_get.js');
const tools = require('../../tools.js');

async function sendNBAScores(recievedGameData, recievedStandingData, recievedScoreData, number_of_days = 1){
    let currentLocalDate = new Date(Date.now() + (-300 * 60 * 1000))
    const currentUTCDate = new Date();
    const season = tools.getSeason(currentUTCDate);

    /**
    * define the paths used to retrieve data when building JSON object.
    */
    const SCORES_STORE_PATH = `data/nba/scores/${season}/`; //path to directory containg the live score data

    const dateRange = [];
    let gameFileData, dateStr, standingsFileData;
    let combinedGamesData = [];
    const response = {};
    response.games = [];

    for (let i = 0; i < number_of_days; i++) { 
        dateRange.push(currentLocalDate);
        currentLocalDate = new Date(currentLocalDate.getTime() + 86400000); // add 24 hours in milliseconds
    }

    standingsFileData = recievedStandingData;

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

    scoreFileData = recievedScoreData;

    for (let i = 0; i < scoreFileData.response.length; i++) {
        let games = combinedGamesData
        combinedGamesData = tools.isGameInLive(scoreFileData.response[i], games);
    }


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
            "totalScore": gameData.teams.home.points,
            "quarterScore": gameData.teams.home.linescore,
            "record": tools.lookForTeamRecord(gameData.teams.home.name, standingsFileData),
            "code": gameData.teams.home.code
        };
        singleGameObj.awayTeam = {
            "name": gameData.teams.visitors.nickname,
            "city": tools.removeWordsFromString(gameData.teams.visitors.name, gameData.teams.visitors.nickname),
            "logo": gameData.teams.visitors.logo,
            "totalScore": gameData.teams.visitors.points,
            "quarterScore": gameData.teams.visitors.linescore,
            "record": tools.lookForTeamRecord(gameData.teams.visitors.name, standingsFileData),
            "code": gameData.teams.visitors.code
        };

        response.games.push(singleGameObj);
    });
    return response; //return the response object to be sent to front end
}

module.exports = {
    sendNBAScores
}