import { Router } from 'express';

const router = Router();
import { getPaginatedTweets, manualscrape } from '../controllers/tweetController.js';

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
 *         default: 1
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: size
 *         default: 5
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

/**
 * @swagger
 * /api/tweets/manualscrape:
 *   get:
 *     summary: Scrape tweets manually/right now
 *     tags: [Tweets]
 *     description: Scrapes tweets instantly. Will take sometime to run. Helpful if you don't want to wait for hourly scheduler. 
 *     responses:
 *       200:
 *         description: A message saying scraped successfully.
 *       500:
 *         description: Server error.
 * 
 */
router.get('/manualscrape', manualscrape);

export default router;
