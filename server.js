import express from 'express';
import nodeSchedule from 'node-schedule';
import { swaggerUi, specs } from './swagger.js';

import TweetRoutes from './routes/tweetRoutes.js';

//init
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//binding routes
app.use('/api/tweets', TweetRoutes);


app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



nodeSchedule.scheduleJob('0 * * * *', () => {
    console.log('Scraping and loading tweets');
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
