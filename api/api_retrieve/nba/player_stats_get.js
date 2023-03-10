const tools = require('../../tools');
const dotenv = require('dotenv');

/**
 * File: player_get.js
 * Description: <brief description of the file purpose>
 * 
 * @author: [<author full name>]
 * @date: [Date Created: <file creation date mm/dd/yy> / Modified: <file
 * modified date mm/dd/yy>]
 * 
*/

async function getPlayerStats(team_ids) {
    response = {}

    let currentDate = new Date();
    const season = tools.getSeason(currentDate);

    for (const team_id of team_ids) {
        const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?team=${team_id}&season=${season}`;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '0a2ff28718mshfc1de4a61e5d512p10d91ajsndee4d0f92b5d',
                'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            }
        };

        let data = {};
        try {
            const result= await fetch(url, options);
            data = await result.json();
        }
        catch {
            console.error('Error fetching NBA player stats:', error)
        }

        response[team_id] = data;
    }
    return response;
}


module.exports = { getPlayerStats }