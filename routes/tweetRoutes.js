import { Router } from 'express';

const router = Router();
import {getPaginatedTweets} from '../controllers/tweetController.js';

/**
 * @swagger
 * /api/tweets:
 *   get:
 *     summary: Retrieve a paginated list of tweets
 *     tags: [Tweets]
 *     description: Retrieve a paginated list of tweets from the database.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Number of tweets per page.
 *     responses:
 *       200:
 *         description: An array of scraped tweets.
 *       500:
 *         description: Server error.
 */
router.get('/', getPaginatedTweets);

export default router;
