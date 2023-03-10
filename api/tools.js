/**
 * File: tools.js
 * Description: A collection of utility functions for common tasks.
 *
 * Functions:
 *   - lookForTeamRecord(team, standings):
 *     Description: Searches for a team's record in standings and returns their wins and losses if found.
 *     Returns: Team record (wins and losses) if found, otherwise null.
 *
 *   - lookForColor(team, nbaColors):
 *     Description: Searches for a team's primary color within an object containing NBA team colors.
 *     Returns: The team's color if found, otherwise null.
 *
 *   - removeWordsFromString(inputString, unwantedWordsString):
 *     Description: Removes specified words from a given string.
 *     Returns: A new string with unwanted words removed.
 *
 *   - getSeason(dateObj):
 *     Description: Finds the current NBA season based on a given date.
 *     Returns: The year of the current NBA season.
 *
 *   - gamesToday(date, games):
 *     Description: Filters an array of games to return only those scheduled for the current date.
 *     Parameters:
 *       - date: A Date object representing the current date.
 *       - games: An array of game objects.
 *     Returns: An array of game objects scheduled for the current date.
 *
 *   - isGameInLive(liveGame, games):
 *     Description: Adds or updates a live game object in an array of game objects.
 *     Parameters:
 *       - liveGame: An object representing the live game to add or update.
 *       - games: An array of game objects.
 *     Returns: The updated array of game objects with the live game added or updated.
 *
 * @author: [Nate Louder]
 * @date: [Date Created: 03/02/23 / Modified: 03/10/23]
 * 
*/

const { response } = require("express");


/**
 * Removes specified unwanted words from input string and returns the filtered string.
 * @param {string} inputString - The input string to be filtered.
 * @param {string} unwantedWordsString - A string containing the unwanted words separated by spaces.
 * @returns {string} - The filtered string with unwanted words removed.
*/

function removeWordsFromString(inputString, unwantedWordsString) {
    const unwantedWords = unwantedWordsString.split(' ');
    const words = inputString.split(' ');
    const filteredWords = words.filter(word => !unwantedWords.includes(word));
    const outputString = filteredWords.join(' ');
    return outputString;
}

/**
* Searches for a team's primary color in an NBA team color object.
* @param {string} team - The name of the NBA team to search for.
* @param {object} nbaColors - The object containing NBA team colors.
* @returns {string|null} - The primary color of the specified team if found, otherwise null.
*/

function lookForColor(team, nbaColors){
    let color = null; // initialize to null in case team is not found

    for (const teamName in nbaColors) {
        if (teamName === team) {
            color = nbaColors[teamName].primary;
            break;
        } 
    }
    return color;
}

/**
 * Searches through a list of team standings to find the record of a specified team.
 * 
 * @param {string} team - The name of the team to search for.
 * @param {Object} standings - The team standings object returned by the API.
 * @returns {Object|null} - An object containing the win and loss records of the team, or null if the team is not found.
*/

function lookForTeamRecord(team, standings) {
    let record = null; // initialize to null in case team is not found
  
    for (let i in standings.response) {
      let response = standings.response[i];
      if (response.team.name === team) {
        record = {"wins": response.win.total, "losses": response.loss.total};
        break;
      }
    }
    
    return record;
    
}

/**
 * Returns the year of the current NBA season based on the given date.
 *
 * If the date is after June, it returns the current year. If it is before July,
 * it returns the previous year, since NBA seasons typically run from October to June.
 *
 * @param {Date} date - A JavaScript Date object representing the date to check.
 * @returns {number} - The year of the current NBA season based on the given date.
*/


function getSeason(dateObj) {
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  
  if (month >= 6) {
    return `${year}`;
  } else {
    return `${year - 1}`;
  }
}

/**
 * Returns the UTC dates for the current day and the next day if the local day is the same as the utc day,
 * otherwise returns the UTC dates for the previous day and the current day.
 * @param {Date} date_ob_local - A JavaScript Date object representing the current local date and time.
 * @param {Date} date_ob_utc - A JavaScript Date object representing the current UTC date and time.
 * @returns {Array} An array containing two JavaScript Date objects representing the UTC dates for the current and next days
 * or the previous and current days, depending on the current local time.
 */

function getGameDatesUTC(date_ob_local, date_ob_utc){
  
  // Check if the current local date is within the first 12 hours of the day
  if (date_ob_local.getDate() === date_ob_utc.getDate()){
    // If yes, return the UTC dates for the current day and the next day
    let next_date_ob_utc = new Date(date_ob_utc.getTime() + 86400000);
    return [date_ob_utc, next_date_ob_utc];
  }
  else{
    // If no, return the UTC dates for the previous day and the current day
    let previous_date_ob_utc = new Date(date_ob_utc.getTime() - 86400000);
    return[previous_date_ob_utc, date_ob_utc]
  }
}

/**
 * This function takes a date and an array of games as input and returns an array
 * of games that are scheduled for the same day as the input date.
 *
 * @param {Date} date - The date to compare the games to
 * @param {Array} games - An array of game objects
 * @returns {Array} - An array of game objects that are scheduled for the same day as the input date
*/

function gamesToday(date, games){
  // Create an empty array to store the games that are scheduled for the input date
  let gamesToday = [];

  // Loop through each game in the input array of games
  for (let i = 0; i < games.length; i++) {
    // Create a new date object for the start time of the current game
    let gameDate = new Date(games[i].date.start)
    
    // Check if the day, month, and year of the current game's start time match the input date
    if (gameDate.getDate() === date.getDate() && gameDate.getMonth() === date.getMonth() && gameDate.getFullYear() === date.getFullYear()){
      // If the game is scheduled for the same day as the input date, add it to the gamesToday array
      gamesToday.push(games[i]);
    }
  }
  // Return the array of games that are scheduled for the input date
  return gamesToday;
}


/**
 * This function takes a live game object and an array of game objects as input.
 * If the live game is already in the array, it replaces the existing game object
 * with the updated live game object. Otherwise, it adds the live game object to the
 * beginning of the array.
 *
 * @param {Object} liveGame - The live game object to add or update in the array
 * @param {Array} games - An array of game objects
 * @returns {Array} - The updated array of game objects
*/

function isGameInLive(liveGame, games){
  // Create a flag variable to keep track of whether or not the live game has been added to the array
  let added = false;

  // Loop through each game in the input array of games
  for (let i = 0; i < games.length; i++) {
    // Check if the live game is already in the array by comparing their ids
    if (liveGame.id === games[i].id) {
      // If the live game is already in the array, replace the existing game object with the updated live game object
      games[i] = liveGame;
      added = true;
      // Exit the loop once the live game has been found and updated
      break
    }
  }
  // If the live game is not already in the array, add it to the beginning of the array
  if(!added){
    games.unshift(liveGame);
  }
  // Return the updated array of game objects
  return games;
}



function getPlayersSeasonPointsSorted(players, playersStats) {
  const minutesPerPlayer = [];
  
  for (const player of players) {
    let totalMinutesPlayed = 0;
    let minutesPlayed = 0;
    let gamesPlayed = 0;
    let playerPos = "n/a"
    
    for (const playerStats of playersStats) {
      if (player.id === playerStats.player.id) {
        if (playerStats.min != '--') {
          if (gamesPlayed === 0) {
            playerPos = playerStats.pos;
          }
          gamesPlayed++;
          minutesPlayed = parseInt(playerStats.min);
          totalMinutesPlayed += minutesPlayed
        }
      }
    }
    if(gamesPlayed > 0){
      minutesPlayed = totalMinutesPlayed / gamesPlayed;
    }
    minutesPerPlayer.push({"id": player.id, "avgMin": minutesPlayed, "pos": playerPos});
  }

  const sortedAvgMinutesPerPlayer = minutesPerPlayer.sort(function(a,b){
    if (a.avgMin > b.avgMin) {
      return -1;
    }
  });
  return sortedAvgMinutesPerPlayer;
}

function getTopPlayers(players, playerStats, number_of_players = 10) {
  const sortedPlayerIdsByMinutes = getPlayersSeasonPointsSorted(players, playerStats)
  const response = [];

  for (let i = 0; i < number_of_players; i++) {
    const currentPlayer = sortedPlayerIdsByMinutes[i];

    for (const player of players) {
      if (currentPlayer.id === player.id) {
        player['avgMin'] = Math.ceil(currentPlayer.avgMin);
        player['pos'] = currentPlayer.pos;
        response.push(player)
        break
      }
    }
  }
  return response;
}


module.exports = {
  removeWordsFromString,
  lookForColor,
  lookForTeamRecord,
  getSeason,
  getGameDatesUTC,
  gamesToday,
  isGameInLive,
  getPlayersSeasonPointsSorted,
  getTopPlayers,

};

