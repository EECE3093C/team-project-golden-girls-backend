const tools = require('../../tools');
const fs = require('fs');

/**
 * File: player_send.js
 * Description: <brief description of the file purpose>
 * 
 * @author: [Nate Louder]
 * @date: [Date Created: 3/10/23 / Modified: 3/10/23]
 * 
*/

async function sendNBAPlayers(teamIds, recievedStandingData = 0, recievedPlayerData, recievedPlayerStatData){
    const TEAM_COLORS_STORE_PATH = `assets/colors.json`; // Path to file containing the NBA team colors
    
    const [homeTeamId, awayTeamId] = teamIds;
    const homeTeamPlayerDataObj = tools.getTopPlayers(recievedPlayerData[`${homeTeamId}`].response, recievedPlayerStatData[`${homeTeamId}`].response);
    const awayTeamPlayerDataObj = tools.getTopPlayers(recievedPlayerData[`${awayTeamId}`].response, recievedPlayerStatData[`${awayTeamId}`].response);
    const homeTeamDataObj = recievedPlayerStatData[`${homeTeamId}`].response[0].team;
    const awayTeamDataObj = recievedPlayerStatData[`${awayTeamId}`].response[0].team;

    let combinedPlayerObj = {
        "teams": {
            "home": {
                "id": homeTeamDataObj.id,
                "name": homeTeamDataObj.nickname,
                "city": tools.removeWordsFromString(homeTeamDataObj.name, homeTeamDataObj.nickname),
                "code": homeTeamDataObj.code,
                "teamColor": tools.lookForColor(homeTeamDataObj.name, JSON.parse(fs.readFileSync(TEAM_COLORS_STORE_PATH))),
                "record": tools.lookForTeamRecord(homeTeamDataObj.name, recievedStandingData),
                "players": []
            },
            "away": {
                "id": awayTeamDataObj.id,
                "name": awayTeamDataObj.nickname,
                "city": tools.removeWordsFromString(awayTeamDataObj.name, awayTeamDataObj.nickname),
                "code": awayTeamDataObj.code,
                "teamColor": tools.lookForColor(awayTeamDataObj.name, JSON.parse(fs.readFileSync(TEAM_COLORS_STORE_PATH))),
                "record": tools.lookForTeamRecord(awayTeamDataObj.name, recievedStandingData),
                "players": []
            }
        }
    };

    for (let i = 0; i < homeTeamPlayerDataObj.length; i++) {
        const homeSinglePlayerObj = {
            "id": homeTeamPlayerDataObj[i].id,
            "name": {
                "first": homeTeamPlayerDataObj[i].firstname,
                "last": homeTeamPlayerDataObj[i].lastname
            },
            "position": homeTeamPlayerDataObj[i].pos
        };
        combinedPlayerObj.teams.home.players.push(homeSinglePlayerObj);
        
        const awaySinglePlayerObj = {
            "id": awayTeamPlayerDataObj[i].id,
            "name": {
                "first": awayTeamPlayerDataObj[i].firstname,
                "last": awayTeamPlayerDataObj[i].lastname
            },
            "position": awayTeamPlayerDataObj[i].pos
        };
        combinedPlayerObj.teams.away.players.push(awaySinglePlayerObj);
    }
    return combinedPlayerObj;
}

module.exports = {
    sendNBAPlayers,
}