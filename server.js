const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/api/v1/games', (req, res) => {
    if (req.params.start_date && req.params.end_date && req.params.sport){
        const start_date = req.params.start_date;
        const end_date = req.params.end_date;
        const sport = req.params.sport;
    }
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
}); 

