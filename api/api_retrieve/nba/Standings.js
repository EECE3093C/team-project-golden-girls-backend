/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const express = require('express');
const request = require('request');
const fs = require('fs');
const tools = require('../../tools.js');
const dotenv = require('dotenv');
dotenv.config();

function getStandings() {

  let date_ob = new Date();
  const season = tools.getSeason(date_ob);

/**
* define the paths used to retrieve data when storing JSON object.
*/
  const standingsSendPath = `data/NBA/standings/${season}/`;

  let day = ("0" + (date_ob.getUTCDate())).slice(-2);
  let month = ("0" + (date_ob.getUTCMonth() + 1)).slice(-2);
  let currentDate = `${date_ob.getUTCFullYear()}-${month}-${day}`;


  /**
  * options: the API call parameters
  *   type: GET
  *   filter for season <- current season, league <- standard
  *   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/standings
  */

  const options = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/standings',
    qs: { league: 'standard', season: season },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      useQueryString: true
    }
  };

  /**
  * request function: sends http request to the API-NBA api
  *   sends: options as the parameters
  *   returns: body as a call back object
  * body is parsed into a JSON string and stored in a file (data/NBA/standings/<current-season>/<current-date>.json)
  * the date is set to it's UTC time. It is most likely that the date will not align with the EST date associatied with each game in the file.
  */

  /**
   * checks if files exist before calling for their data.
   */
  if (!fs.existsSync(`${standingsSendPath}${currentDate}.json`)) {
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      let data = JSON.stringify(JSON.parse(body), null, 2);

      try {
        await fs.promises.mkdir(standingsSendPath, { recursive: true });
        fs.writeFile(`${standingsSendPath}${currentDate}.json`, data, function (err) {
          if (err) throw err;
        });
      } catch (err) {
        throw err;
      }
    });
  }

}

getStandings();

module.exports = { getStandings };