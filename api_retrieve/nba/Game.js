const express = require('express');
const request = require('request');
const fs = require('fs');

let date = new Date();
let day = ("0" + date.getDate()).slice(-2);
let month = ("0" + (date.getMonth() + 1)).slice(-2);
let fullDate = `${date.getFullYear()}-${month}-${day}`;
console.log(fullDate);

const options = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/games',
    qs: {date: fullDate},
    headers: {
      'X-RapidAPI-Key': '0a2ff28718mshfc1de4a61e5d512p10d91ajsndee4d0f92b5d',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      useQueryString: true
    }
  };
  
  request(options, function (error, response, body) {
        if (error) throw new Error(error);

        let data = JSON.stringify(JSON.parse(body), null, 2);

        fs.promises.mkdir('/ObsceneOddsAPIData/NBA/Games', { recursive: true }, (err) => {
            if (err) throw err;
          });
    
        fs.writeFile(`/ObsceneOddsAPIData/NBA/Games/${fullDate}.json`, data, function (err) {
            if (err) throw err;
        })
    });
      