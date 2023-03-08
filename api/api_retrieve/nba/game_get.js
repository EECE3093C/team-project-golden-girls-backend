/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const dotenv = require('dotenv');
dotenv.config();

async function getGames(number_of_days = 3) {
  response = {}
  let currentUTCDate = new Date();
  currentUTCDate = new Date(currentUTCDate.getTime() - 86400000);
  

  for (let i = 0; i < number_of_days; i++) {
    
    let getDateStr = `${currentUTCDate.getUTCFullYear()}-${("0" + (currentUTCDate.getUTCMonth() + 1)).slice(-2)}-${("0" + (currentUTCDate.getUTCDate())).slice(-2)}`;
  
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
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };
  
    let data = {};
    try {
      const response = await fetch(url, options);
      data = await response.json();
    } catch (error) {
      console.error('Error fetching NBA games:', error);
    }
    response[getDateStr] = data;
    currentUTCDate = new Date(currentUTCDate.getTime() + 86400000)
  }
  return response;
}

module.exports = { getGames };