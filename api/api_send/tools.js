/**
 * Description: Stores tools to use while parsing through the data.
 * HISTORY:
 * 3/2/23, Nate Louder(nate-dev): Created file; Created removeWordsFromString function
 * 
 */

function removeWordsFromString(inputString, unwantedWordsString) {
    const unwantedWords = unwantedWordsString.split(' ');
    const words = inputString.split(' ');
    const filteredWords = words.filter(word => !unwantedWords.includes(word));
    const outputString = filteredWords.join(' ');
    return outputString;
}

function lookForColor(team, nbaColors){
    let color = null; // initialize to null in case team is not found

    for (const teamName in nbaColors) {
        if (teamName === team) {
            color = nbaColors[teamName].primary;
            break;
        } 
    }
    
    return color;
}

module.exports = {
    removeWordsFromString,
    lookForColor,
  };

