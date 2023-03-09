const dotenv = require('dotenv');
dotenv.config();

/**
* File: <file name>.js
* Description: This code defines an asynchronous function getScores that fetches data on live NBA games 
* from the api-nba-v1.p.rapidapi.com API. It makes a GET request to the API with the filter 'live=all'
* and returns a JSON object with the live game data. The function includes error handling to log any 
* errors encountered during the API call.
* 
* @author: [Your Name]
* @date: [Date Created: <date> / Modified: <date>]
*
*/

async function getScores(){
 // The URL to the API
 const url = 'https://api-nba-v1.p.rapidapi.com/games?live=all';

 // The API call parameters
 const options = {
   method: 'GET',
   headers: {
     'X-RapidAPI-Key': process.env.RAPID_API_KEY,
     'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
   }
 };

 try {
   // Send the API request and wait for the response
   const data = await fetch(url, options);
   // Parse the response as JSON
   response = await data.json();
 } 
 catch (error) {
   // Log any errors encountered during the API call
   console.error('Error fetching NBA games:', error);
 }

 // Return the API response
 return response;
}

module.exports = {
  getScores,
};