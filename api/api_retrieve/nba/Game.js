/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const express = require('express');
const request = require('request');
const fs = require('fs');

function getGames(number_of_days = 2) {
  let counter = 0;
  /**  
   * retrieves a list of yesterday and the next 7 dates (yyyy-mm-dd) to be used as a filter when making the API call
  */
  let dates = [];
  let date = new Date();

  for (let i = 0; i <= number_of_days; i++) {
    let day = ("0" + (date.getDate())).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let fullDate = `${date.getFullYear()}-${month}-${day}`;
    dates.push(fullDate);
    date.setDate(date.getDate() + 1);
  }
  /**
  * options: the API call parameters
  *   type: GET
  *   filter for date <- current date (yyyy-mm-ddd)
  *   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/games
  */

  /**
   * for loop creates a file for each day in the list of dates. Currently set to create the next 7 days.
   */
  dates.forEach(tempdate => {

    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/games',
      qs: { date: tempdate },
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
    * body is parsed into a JSON string and stored in a file (data/NBA/Games/<current-date>.json)
    * the date is set to it's UTC time. It is most likely that the date will not align with the EST date associatied with each game in the file.
    */

    /**
     * checks if files exist before calling for their data.
     */
    let path = "data/NBA/Games/";
    if (!fs.existsSync(`${path}${tempdate}.json`)) {
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let data = JSON.stringify(JSON.parse(body), null, 2);

        // add check for exisiting directory
        fs.promises.mkdir('data/NBA/Games', { recursive: true }, (err) => {
          if (err) throw err;
        });

        // create file
        fs.writeFile(`${path}${tempdate}.json`, data, function (err) {
          if (err) throw err;
          counter = counter + 1;
        })
      });

    }
  });
  console.log(counter, " files were created");
}

module.exports = { getGames };