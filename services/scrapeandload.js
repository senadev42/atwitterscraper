import dotenv from 'dotenv';
import pg from 'pg';

import initDB from '../db/db_init.js';
import scrapeTweets from '../utilities/scraper.js';
import { processImages } from '../utilities/processImages.js';
import { emailvideos} from '../utilities/emailvideos.js';


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
      const { socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash, videoURL, imageURL, postURL, postType } = tweet;
      await client.query(
        `INSERT INTO scrapedtweets (socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash, videoURL, imageURL, postURL, postType)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (hash) DO NOTHING`,
        [socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash, videoURL, imageURL, postURL, postType]
      );
    }

    console.log("Tweets loaded into database");
  } catch (error) {
    console.error("Error loading tweets into database:", error.message);
  } finally {
    await client.end();
  }
}

async function scrapeandloadtweets() {
  // Initialize the database - this will create the tables if they don't exist
  console.log("\n0. Initializing database if it doesn't exist");
  await initDB();
  console.log("Database initialized \n");


  const url = "https://twitter.com/coindesk";


  try {
    // 1. Scrape tweets from a specific URL
    console.log("1. Scraping: " + url);
    const tweetObjects = await scrapeTweets(url);

    //console.log(tweetObjects);
    console.log(tweetObjects.length + " tweets scraped.")

    //2. save any images to local storage, but don't do this on render
    if (process.env.ONRENDER == null) {
      console.log("\n2. Downloading Images");
      await processImages(tweetObjects);
    }

    //3. if there were any video this scrape cycle email them
    if (process.env.ONRENDER == null && process.env.EMAIL_TARGET) {
      console.log("\n3. Sending emails");
      await emailvideos(tweetObjects);
    }

    // 4. Load the scraped tweets into the database
    console.log("\n4. Loading tweets into database");
    await loadTweetsIntoDB(tweetObjects);
  
    console.log("\nF. Scrape and load cycle finished successfully");
  } catch (err) {
    console.error("Error during scraping:", err);
  } 

  

  return;
}

export default scrapeandloadtweets;
