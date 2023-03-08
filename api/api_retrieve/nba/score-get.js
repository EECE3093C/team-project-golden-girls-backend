/**
 * HISTORY:
 * 3/6/23, Nate Louder(nate-dev) - Created file.
 */

const request = require('request');
const tools = require('../../tools');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

function getLiveScore(){
    let date_ob = new Date();
    const season = tools.getSeason(date_ob);

    /**
    * define the paths used to retrieve data when storing JSON object.
    */
    const scoreSendPath = `data/NBA/scores/${season}/`;

    let day = ("0" + (date_ob.getUTCDate() + 1)).slice(-2);
    let month = ("0" + (date_ob.getUTCMonth() + 1)).slice(-2);
    let date = `${date_ob.getUTCFullYear()}-${month}-${day}`;

    /**
    * options: the API call parameters
    *   type: GET
    *   filter for live <- 'all', league <- 'standard'
    *   url to the API-NBA api <- https://api-nba-v1.p.rapidapi.com/games
    */

    const request = require('request');

    const options = {
        method: 'GET',
        url: 'https://api-nba-v1.p.rapidapi.com/games',
        qs: {live: 'all'},
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
            useQueryString: true
        }
    };

    if (!fs.existsSync(`${scoreSendPath}${date}.json`)) {
        request(options, async function (error, response, body) {
          if (error) throw new Error(error);
          let data = JSON.stringify(JSON.parse(body), null, 2);
    
          try {
            await fs.promises.mkdir(scoreSendPath, { recursive: true });
            fs.writeFile(`${scoreSendPath}${date}.json`, data, function (err) {
              if (err) throw err;
            });
          } catch (err) {
            throw err;
          }
        });
      }
}

getLiveScore();

module.exports = {
    getLiveScore,
};