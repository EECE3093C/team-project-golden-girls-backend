const tools = require('../../tools');
const dotenv = require('dotenv');
dotenv.config();

/**
 * File: getStandings.js
 * Description: Defines an asynchronous function getStandings that fetches NBA team standings
 * data from the api-nba-v1.p.rapidapi.com API for the current season. The function uses the fetch 
 * method to make GET requests to the API and returns a JSON object with the team standings data. 
 * The function includes error handling to log any errors encountered during the API calls.
 * 
 * @author: [Nate Louder]
 * @date: [Date Created: 03/03/23 / Modified: 03/09/23]
 * 
*/

async function getStandings() {
  // Initialize the response object
  response = {}
  
  // Get the current UTC date
  let currentUTCDate = new Date();
  
  // Get the current season based on the current UTC date
  const season = tools.getSeason(currentUTCDate);

  // Set the API URL with the current season and league filter
  const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=${season}`;

  // Set the API call options including headers
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    // Make the API call and parse the response into JSON format
    const data = await fetch(url, options);
    response = await data.json();
  } catch (error) {
    // Log any errors encountered during the API call
    console.error('Error fetching NBA team standings:', error);
  }
  
  // Return the response object
  return response;
}

module.exports = {
   getStandings 
};