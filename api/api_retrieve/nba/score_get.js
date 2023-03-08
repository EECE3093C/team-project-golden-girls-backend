/**
 * HISTORY:
 * 3/6/23, Nate Louder(nate-dev) - Created file.
 */

const dotenv = require('dotenv');
dotenv.config();

async function getScores(){

  /**
  * options: the API call parameters
  *   type: GET
  *   filter for live <- 'all', league <- 'standard'
  *   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/games
  */
  
  const url = 'https://api-nba-v1.p.rapidapi.com/games?live=all';

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
  } 
  catch (error) {
    console.error('Error fetching NBA games:', error);
  }

  return response;
}

module.exports = {
  getScores,
};