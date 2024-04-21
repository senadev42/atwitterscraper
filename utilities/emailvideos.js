import { mg } from "./mailgun.js";

import dotenv from "dotenv";
dotenv.config();

async function emailvideos(tweetObjects) {
  const data = {
    from: `Twitter Scraper Project`,
    to: process.env.EMAIL_TARGET,
    subject: "Latest Tweets Scraped That Have Videos In Them",
    text: "Here are the videos that were just scraped: ",
  };

  const tweetswithvideos = tweetObjects.filter((tweet) => tweet.videoURL);

  if (tweetswithvideos.length === 0) {
    console.log("No tweets with videos found");
    return;
  }

  // Iterate over each tweet object
  for (const tweet of tweetswithvideos) {
    data.text += `\n\n\nBy: ${tweet.authorHandle}`
    data.text += `\n\n${tweet.tweetText.slice(0,80)}`
    data.text += `\nPost URL: ${tweet.postURL}`

  }

  console.log(data);

  try {
    // Send the email
    const result = await mg.messages().send(data);

    console.log(`Emails with videos sent.`);
  } catch (error) {
    console.error("Sending emails with videos failed: ", error);
  }
}

export { emailvideos };
