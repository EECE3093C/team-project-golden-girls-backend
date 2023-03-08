/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const request = require('request');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

async function getGamesNew(getDate) {

  let getDateStr = `${getDate.getUTCFullYear()}-${("0" + (getDate.getUTCMonth() + 1)).slice(-2)}-${("0" + (getDate.getUTCDate())).slice(-2)}`;

  /**
  * options: the API call parameters
  *   type: GET
  *   filter for date <- current date (yyyy-mm-ddd)
  *   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/games
  */
  /**
   * for loop creates a file for each day in the list of dates. Currently set to create the next 7 days.
   */
  

  const url = `https://api-nba-v1.p.rapidapi.com/games?date=${getDateStr}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0a2ff28718mshfc1de4a61e5d512p10d91ajsndee4d0f92b5d',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching NBA games:', error);
  }
  
}

module.exports = { getGamesNew };