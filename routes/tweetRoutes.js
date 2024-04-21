import { Router } from 'express';

const router = Router();
import { getPaginatedTweets, manualscrape, loadimages } from '../controllers/tweetController.js';

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
 *     summary: Triggers the scrape and load cycle instantly. 
 *     tags: [Debug]
 *     description:  Will not work on render hosted version. See project readme for details > github.com/senadev42/atwitterscraper?tab=readme-ov-file#hosted-version. 
 *     responses:
 *       200:
 *         description: A message saying scraped successfully.
 *       500:
 *         description: Server error.
 * 
 */
router.get('/manualscrape', manualscrape);

/**
 * @swagger
 * /api/tweets/loadimages:
 *   get:
 *     summary: Triggers a download of all images in db even if not in current cycle. 
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: A message saying downloaded images successfully.
 *       500:
 *         description: Server error.
 * 
 */
router.get('/loadimages', loadimages);

export default router;
