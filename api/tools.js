/**
 * File: tools.js
 * Description: A collection of utility functions for common tasks.
 *
 * Functions:
 *   - lookForTeamRecord(team, standings): Searches for a specified team's record within a standings response object.
 *     Returns the team's wins and losses if found, otherwise returns null.
 *
 *   - lookForColor(team, nbaColors): Searches for a specified team's primary color within an object containing
 *     NBA team colors. Returns the color if found, otherwise returns null.
 *
 *   - removeWordsFromString(inputString, unwantedWordsString): Removes specified words from a given input string.
 *     Returns a new string with unwanted words removed.
 * 
 *   - getSeason(dateObj): finds the current season of the NBA.
 *     Returns the year of the current NBA season based on the given date.
 *
 * @author: [Nate Louder]
 * @date: [Date Created: 03/02/23 / Modified: 03/03/23]
 * 
 * History:
 *  - 3/2/23, Nate Louder(nate-dev): Created file; Created removeWordsFromString function; Created lookForColor function
 *  - 3/3/23, Nate Louder(nate-dev): Created lookForTeamRecord function; Created getSeason function
 * 
*/


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
 * Returns an array of two JavaScript Date objects representing the current date in the 
 * Eastern Standard Time (EST) timezone and the current date in Coordinated Universal Time (UTC).
 *
 * The function uses the Date object to create two separate Date objects: one for the 
 * current local date and time in EST and another for the current date and time in UTC. 
 * It then adjusts the local date object to UTC time using the setUTCDate and setUTCHours 
 * methods, and returns the two Date objects as an array.
 *
 * @returns {Date[]} - An array of two Date objects: the first representing the current 
 * date and time in EST and the second representing the current date and time in UTC.
 *
 * @example
 * Returns [2023-03-08T01:35:26.562Z, 2023-03-07T21:35:26.562Z]
 *
 * @returns {number} - The year of the current NBA season based on the given date.
 */

function getGameDatesUTC(date_ob_local, date_ob_utc){
  
  if (date_ob_local.getDate() != date_ob_utc.getDate()){
    date_ob_local.setDate(date_ob_local.getUTCDate());
    date_ob_local.setHours(date_ob_local.getUTCHours());
    date_ob_utc.setUTCDate(date_ob_local.getUTCDate() + 1);
    return [date_ob_local, date_ob_utc];
  }
  else{
    date_ob_local.setDate(date_ob_local.getUTCDate());
    date_ob_local.setHours(date_ob_local.getUTCHours());
    date_ob_utc.setUTCDate(date_ob_local.getUTCDate() - 1);
    return[date_ob_utc, date_ob_local]
  }
}

function gamesToday(date, games){
  let gamesToday = [];

  for (let i = 0; i < games.length; i++) {
    let gameDate = new Date(games[i].date.start)
    if (gameDate.getDate() === date.getDate() && gameDate.getMonth() === date.getMonth() && gameDate.getFullYear() === date.getFullYear()){
      gamesToday.push(games[i]);
    }
  }
  return gamesToday;
}


  
//console.log(getGameDatesUTC());

module.exports = {
    removeWordsFromString,
    lookForColor,
    lookForTeamRecord,
    getSeason,
    getGameDatesUTC,
    gamesToday,

  };

