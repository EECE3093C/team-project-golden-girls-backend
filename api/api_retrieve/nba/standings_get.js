/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const tools = require('../../tools');
const dotenv = require('dotenv');
dotenv.config();

async function getStandings() {
  response = {}
  let currentUTCDate = new Date();
  
  const season = tools.getSeason(currentUTCDate);
  
  /**
  * options: the API call parameters
  *   type: GET
  *   filter for date <- current date (yyyy-mm-ddd)
  *   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/games
  */

  const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=${season}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    const data = await fetch(url, options);
    response = await data.json();
  } catch (error) {
    console.error('Error fetching NBA games:', error);
  }
  
  return response;
}

module.exports = { getStandings };