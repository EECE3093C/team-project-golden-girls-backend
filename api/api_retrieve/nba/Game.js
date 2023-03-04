/**
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): create file Game.js; configured api parameters to call for games on the current date and store in a local file.
 * 3/3/23, Nate Louder(nate-dev): modified the method of getting dates and creating JSON files to get the next 7 days and check if files exist before calling for their data.
 */

const request = require('request');
const fs = require('fs');

function getGames(number_of_days = 2) {
  /**
  * define the paths used to retrieve data when building JSON object.
  */
 const gamesSendPath = "data/NBA/games/";

  /**  
   * retrieves a list of the next "number_of_days" dates (yyyy-mm-dd) including today, to be used as a filter when making the API call. Dates are in UTC timezone.
  */
  let dates = [];
  let date = new Date();

  for (let i = 0; i < number_of_days; i++) {
    let day = ("0" + (date.getUTCDate())).slice(-2);
    let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    let fullDate = `${date.getUTCFullYear()}-${month}-${day}`;
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
    if (!fs.existsSync(`${gamesSendPath}${tempdate}.json`)) {
      request(options, async function (error, response, body) {
        if (error) throw new Error(error);
        let data = JSON.stringify(JSON.parse(body), null, 2);
    
        try {
          await fs.promises.mkdir(gamesSendPath, { recursive: true });
          fs.writeFile(`${gamesSendPath}${tempdate}.json`, data, function (err) {
            if (err) throw err;
          });
        } catch (err) {
          throw err;
        }
      });
    }     
  });
}

getGames();

module.exports = { getGames };