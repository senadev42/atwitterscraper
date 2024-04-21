import puppeteer from "puppeteer";
import crypto from "crypto";

/**
 * This function scrapes tweets from a given URL and 
 * returns an array of tweet objects.
 * @param {string} url - The URL of the Twitter page to scrape.
 * @returns {Promise<object[]>} - A promise that resolves to an array of tweet objects.
 */
export default async function scrapeTweets(url) {
  const browser = await puppeteer.launch();
  const page = (await browser.pages())[0];
  await page.goto(url, { waitUntil: "load" });
  await page.setViewport({ width: 1000, height: 1024 });

  //wait for at least one tweet to show up
  await page.waitForSelector('[data-testid="tweet"]', { timeout: 5000 });


  //Load Tweets
  const desiredTweetCount = 12; //rough anon view count
  let currentTweetCount = 0;

  while (currentTweetCount < desiredTweetCount) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    await new Promise(r => setTimeout(r, 500));

    currentTweetCount = await page.evaluate(() => {
      return document.querySelectorAll('[data-testid="tweet"]').length;
    });
  }

  console.log(`Tweet count: ${currentTweetCount}`);

  //PARSE
  try {
    // Extract tweets
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
      const tweetObjects = [];

      if (tweetElements.length == 0) return tweetObjects;

      console.log(`Loaded ${tweetElements.length} tweets`);

      tweetElements.forEach((tweetElement) => {
        //socialContext
        const socialContextElement = tweetElement.querySelector(
          '[data-testid="socialContext"]'
        );
        const socialContextText = socialContextElement
          ? socialContextElement.textContent.trim()
          : "none";

        //author
        const authorElement = tweetElement.querySelector(
          '[data-testid="User-Name"]'
        );
        const authorText = authorElement.textContent.trim().split("·")[0];
        const [authorName, authorHandle] = authorText
          .split("@")
          .map((part) => part.trim());

        //is quoted - hacky way?
        const avatarDivs = tweetElement.querySelectorAll('[data-testid="Tweet-User-Avatar"]');
        const isQuoteTweet = avatarDivs.length === 2;

        // Extract datetime
        const datetimeElement = tweetElement.querySelector('[data-testid="User-Name"] [datetime]');
        const datetime = datetimeElement ? datetimeElement.getAttribute('datetime') : null;

        //tweet text
        const tweetTextElement = tweetElement.querySelector(
          '[data-testid="tweetText"]'
        );
        let tweetText = "";
        let currentNode = tweetTextElement;
        while (currentNode) {
          tweetText += currentNode.textContent.trim() + " ";
          currentNode = currentNode.nextElementSibling;
        }

        //Assets
        const videoURL = tweetElement.querySelector('[type="video/mp4"]')?.getAttribute('src') || null;
        const imageURL = Array.from(tweetElement.querySelectorAll('[alt="Image"]'))?.map(img => img.getAttribute('src'))[0] || null;
        const postURL = tweetElement.querySelector('[rel="noopener noreferrer nofollow"]')?.getAttribute('href') || null;

        //Type of Post
        const postType = videoURL ? "video" : imageURL ? "image" : postURL ? "link" : "text";

        //push the object
        tweetObjects.push({
          socialContext: socialContextText,
          authorHandle: "@" + authorHandle,
          isQuoteTweet: isQuoteTweet,
          datetime: datetime,
          tweetText: tweetText.trim(),
          videoURL: videoURL,
          imageURL: imageURL,
          postURL: postURL,
          postType: postType
        });
      });

      return tweetObjects;
    });

    //add a hash to every tweet
    tweets.forEach((tweet) => {
      tweet.hash = crypto.createHash('md5').update(
        tweet.socialContextText + tweet.authorHandle + tweet.isQuoteTweet + tweet.datetime
      ).digest('hex');
    });

    console.log("Tweets logged:" + tweets.length);

    return tweets;
  } catch (error) {
    console.error("Error during evaluation:", error.message);
  }

  await browser.close();
}
