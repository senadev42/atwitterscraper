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
      await client.query(
        "INSERT INTO scrapedtweets (socialContext, authorHandle, isQuoteTweet, datetime, tweetText, hash)" +
        "VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (hash) DO NOTHING",
        [
          tweet.socialContext,
          tweet.authorHandle,
          tweet.isQuoteTweet,
          tweet.datetime,
          tweet.tweetText,
          tweet.hash,
        ]
      );
    }

    console.log("Tweets inserted successfully");
  } catch (error) {
    console.error("Error inserting tweets:", error);
  } finally {
    await client.end();
  }
}

async function scrapeandloadtweets() {
  // Initialize the database
  await initDB();

  return;

  console.log("Database initialized \n");

  // Scrape tweets from a specific URL
  const url = "https://twitter.com/coindesk";
  const tweetObjects = await scrapeTweets(url);

  try {
    const tweets = await scrapeTweets(url);
    console.log(tweets);

    console.log("Tweet Scraped")
  } catch (err) {
    console.error("Error during scraping:", err);
  }

  // Load the scraped tweets into the database
  await loadTweetsIntoDB(tweetObjects);

  console.log("Tweets loaded into database");
}


scrapeandloadtweets();


//export default scrapeandloadtweets;
