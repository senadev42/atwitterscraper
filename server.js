import express from 'express';
import nodeSchedule from 'node-schedule';
import { swaggerUi, specs } from './swagger.js';

//routes and middleware
import TweetRoutes from './routes/tweetRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import scrapeandloadtweets from "./services/scrapeandload.js";

//init
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/tweets', TweetRoutes);
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check server status
 *     tags: [Default]
 *     responses:
 *       '200':
 *         description: Server is running
 */
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Runs every hour
nodeSchedule.scheduleJob('0 * * * *', () => {
    console.log('Scraping and loading tweets');
    scrapeandloadtweets();
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

 