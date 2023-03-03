/**
 * Description process to parse through the stored 
 * JSON files from API-NBA and pull data to build 
 * JSON object being sent to front end.
 * 
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): Created file. Setup process to parse through the stored 
 * JSON files from API-NBA and pull data to build JSON object being sent to front end.
 * 
 * 3/3/23, Nate Louder(nate-dev): finalized relationships between pull and send files.
 */

const fs = require('fs');
const tools = require('../tools.js');
let date_ob = new Date();
let response;
let day, month = "";

/** 
 * directory location of the JSON files containg the game data 
 */
let ggDir = "C:/ObsceneOddsAPIData/NBA/Games";

/** 
 * directory location of the JSON template to send to front end
 */
let dDir = "api/api_send_templates/";

const dateRange = [];

/**
 * create a range of dates for the games being retrieved.
 */
for (let i = 0; i < 1; i++) {
    day = ("0" + (date_ob.getDate() - 1)).slice(-2);
    month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    dateRange.push(`${date_ob.getFullYear()}-${month}-${day}`);

    date_ob.setDate(date_ob.getDate() + 1);
}

/**
 * retrieves the games send_api_template for games and stores it in the response variable.
 */
try{
    response = JSON.parse(fs.readFileSync(dDir + 'games.json'))
} catch (err){
    console.log(err);
}

/**  
 * set the time frame to the first and last values of the date range.
*/
response.timeFrame.startDate = dateRange[0];
response.timeFrame.endDate = dateRange[dateRange.length - 1];

/**
 * loops through all the dates in the date range and assigns related info from the stored JSON 
 * files from API-NBA api to the api_send_templates.games JSON object to be sent to the front-end.
 */

dateRange.forEach(date => {
    fs.readFile(`${ggDir}/${date}.json`, function(err, data){
        if(err) throw err;
        let games = JSON.parse(data);

        /**  
         * build game object will contain the info of each game and be add added to the list of games after each one is built.
        */
        let bGameOb = JSON.parse(JSON.stringify(response.games[0]));

        
        for (let i = 0; i < games.response.length; i++) {
            let game = games.response[i];
            let tempbGameOb = JSON.parse(JSON.stringify(bGameOb));

            //Home team parse
            tempbGameOb.homeTeam.name = game.teams.home.nickname;
            tempbGameOb.homeTeam.city = tools.removeWordsFromString(game.teams.home.name, `${game.teams.home.nickname}`);
            tempbGameOb.homeTeam.logo = game.teams.home.logo;
            tempbGameOb.homeTeam.totalScore = game.scores.home.points;
            tempbGameOb.homeTeam.code = game.teams.home.code;
            tempbGameOb.homeTeam.teamColor = tools.lookForColor(game.teams.home.name, JSON.parse(fs.readFileSync('C:/Projects/team-project-golden-girls-backend/assets/colors.json')));
            tempbGameOb.homeTeam.quarterScores = game.scores.home.linescore;

            //Away team parse
            tempbGameOb.awayTeam.name = game.teams.visitors.nickname;
            tempbGameOb.awayTeam.city = tools.removeWordsFromString(game.teams.visitors.name, `${game.teams.visitors.nickname}`);
            tempbGameOb.awayTeam.logo = game.teams.visitors.logo;
            tempbGameOb.awayTeam.totalScore = game.scores.visitors.points;
            tempbGameOb.awayTeam.code = game.teams.visitors.code;
            tempbGameOb.awayTeam.teamColor = tools.lookForColor(game.teams.visitors.name, JSON.parse(fs.readFileSync('C:/Projects/team-project-golden-girls-backend/assets/colors.json')));
            tempbGameOb.awayTeam.quarterScores = game.scores.visitors.linescore;

            //Other parse
            
            /**
             * date is sent in ETC time
             */
            const utcTime = new Date(game.date.start)
            const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
            const dateString = utcTime.toLocaleString('en-US', options);
            tempbGameOb.date = dateString.split(', ')[0] + " ETC";
            tempbGameOb.time = dateString.split(', ')[1] + " ETC";

            /**
             * status long can be one of the following: Scheduled, Started, Finished
             * status short can be one of the following: 1, 2, 3
             */
            tempbGameOb.statusLong = game.status.long;
            tempbGameOb.statusShort = game.status.short;

            /**
             * overwrites the original template with the first item and then appends
             * the remaining items to the end of the games list.
             */            
            if (i == 0) {
                response.games[i] = tempbGameOb;
            }
            else{
                response.games.push(tempbGameOb);
            };
            
        };
        /**
         * final object to send is stored in the response variable.
         * logged to the console for now. To be sent to the front end.
         */
        console.log(response);

    });        
});
