const dotenv = require('dotenv');
dotenv.config();

/**
 * File: <file name>.js
 * Description: his code defines an asynchronous function getGames that fetches data on NBA games 
 * from the api-nba-v1.p.rapidapi.com API for a specified number of days (default is 4). It iterates
 * through each day and creates a file with the date in the format 'yyyy-mm-dd'. The function uses
 * the fetch method to make GET requests to the API and returns a JSON object with the game data for
 * each day. The function includes error handling to log any errors encountered during the API calls.
 * 
 * @author: [Nate Louder]
 * @date: [Date Created: 03/02/23 / Modified: 03/08/23]
 * 
*/

/**
 * Async function to fetch NBA game data for a specified number of days
 * @param {number} number_of_days - number of days to fetch data for (default is 4)
 * @returns {Promise<object>} response - JSON object with the game data for each day
 */
async function getGames(number_of_days = 4) {
  response = {}
  
  // Get the current UTC date
  let currentUTCDate = new Date();
  
  // Subtract one day to start from yesterday
  currentUTCDate = new Date(currentUTCDate.getTime() - 86400000);

  for (let i = 0; i < number_of_days; i++) {
    // Get the date string in the format 'yyyy-mm-dd'
    let getDateStr = `${currentUTCDate.getUTCFullYear()}-${("0" + (currentUTCDate.getUTCMonth() + 1)).slice(-2)}-${("0" + (currentUTCDate.getUTCDate())).slice(-2)}`;
  
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
    // Add the data to the response object with the date as the key
    response[getDateStr] = data;
    
    // Add one day to the current date
    currentUTCDate = new Date(currentUTCDate.getTime() + 86400000)
  }
  
  return response;
}

module.exports = { getGames };