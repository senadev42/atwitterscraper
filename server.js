import express from 'express';
import nodeSchedule from 'node-schedule';
import { swaggerUi, specs } from './swagger.js';

//routes and middleware
import TweetRoutes from './routes/tweetRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//init
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/tweets', TweetRoutes);
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//the scheduler
nodeSchedule.scheduleJob('0 * * * *', () => {
    console.log('Scraping and loading tweets');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
