/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const express = require('express');
const request = require('request');
const fs = require('fs');
const tools = require('../../tools.js');

let date_ob = new Date()
const season = tools.getSeason(date_ob);

// COMMENT: add a comment to describe the below
/**  
 *
*/

date_ob.setDate(date_ob.getDate() - 1);

let day = ("0" + (date_ob.getDate())).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let currentDate = `${date_ob.getFullYear()}-${month}-${day}`;


/**
* options: the API call parameters
*   type: GET
*   filter for season <- current season, league <- standard
*   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/standings
*/

  const options = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/standings',
    qs: {league: 'standard', season: season},
    headers: {
      'X-RapidAPI-Key': '0a2ff28718mshfc1de4a61e5d512p10d91ajsndee4d0f92b5d',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      useQueryString: true
    }
  };

  /**
  * request function: sends http request to the API-NBA api
  *   sends: options as the parameters
  *   returns: body as a call back object
  * body is parsed into a JSON string and stored in a file (C:/ObsceneOddsAPIData/NBA/Standings/<current-season>/<current-date>.json)
  * the date is set to it's UTC time. It is most likely that the date will not align with the EST date associatied with each game in the file.
  */

  /**
   * checks if files exist before calling for their data.
   */
  if(!fs.existsSync(`/ObsceneOddsAPIData/NBA/Standings/${season}/${currentDate}.json`)){
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      let data = JSON.stringify(JSON.parse(body), null, 2);
    
      //
      fs.promises.mkdir(`/ObsceneOddsAPIData/NBA/Standings/${season}/`, { recursive: true }, (err) => {
        if (err) throw err;
      });
      fs.writeFile(`/ObsceneOddsAPIData/NBA/Standings/${season}/${currentDate}.json`, data, function (err) {
        if (err) throw err;
      })
    });
    
  }

      