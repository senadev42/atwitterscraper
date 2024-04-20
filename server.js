const express = require('express');
const nodeSchedule = require('node-schedule');
const { Client } = require('pg');
//const scrapeandloadtweets = require('./services/scrapeandload'); // Adjust the path as necessary


const connectionString = process.env.POSTGRES_CONN_STRING;

//init
const app = express();
const port = process.env.PORT || 3000;

// iddleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//base
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

nodeSchedule.scheduleJob('*/10 * * * * *', () => {
    //scrapeandloadtweets().catch(console.error);
    console.log('Scraping and loading tweets');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
