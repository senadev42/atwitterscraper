import dotenv from 'dotenv';
import scrapeTweets from '../utilities/scraper.js';
import initDB from '../db/db_init.js';
import pg from 'pg';

const { Client } = pg;
dotenv.config();

// Your PostgreSQL connection string
const connectionString = process.env.POSTGRES_CONN_STRING;

async function loadTweetsIntoDB(tweetObjects) {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();

    for (const tweet of tweetObjects) {

      const { socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash, isVideoPost, videoURL } = tweet;

      await client.query(
        `INSERT INTO scrapedtweets (socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash, isVideoPost, videoURL)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (hash) DO NOTHING`,
        [socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash, isVideoPost, videoURL]
      );

    }

    console.log("Tweets inserted successfully");
  } catch (error) {
    console.error("Error inserting tweets:", error.message);
  } finally {
    await client.end();
  }
}

async function scrapeandloadtweets() {
  // Initialize the database - this will create the tables if they don't exist
  // await initDB();
  // console.log("Database initialized \n");

  // Scrape tweets from a specific URL
  const url = "https://twitter.com/coindesk";
  console.log("\nScraping url: " + url);

  try {
    const tweetObjects = await scrapeTweets(url);

    console.log(tweetObjects);
    console.log(tweetObjects.length + " tweets scraped.")

    // Load the scraped tweets into the database
    await loadTweetsIntoDB(tweetObjects);
    console.log("Tweets loaded into database");

  } catch (err) {
    console.error("Error during scraping:", err);
  } 

  return;
}

export default scrapeandloadtweets;
