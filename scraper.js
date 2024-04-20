const puppeteer = require("puppeteer");

async function scrapeTweets(url) {
  //setting up
  const browser = await puppeteer.launch();
  const page = (await browser.pages())[0];
  await page.goto(url, { waitUntil: "load" });
  await page.setViewport({ width: 1000, height: 1024 });
  await page.waitForSelector('[data-testid="tweet"]', { timeout: 5000 });

  //hydrate the page
  const maxScrollAttempts = 10;
  const desiredTweetCount = 12; //anon limit
  let currentTweetCount = 0;

  for (let attempt = 0; attempt < maxScrollAttempts; attempt++) {
    currentTweetCount = await page.evaluate(() => {
      return document.querySelectorAll('[data-testid="tweet"]').length;
    });

    if (currentTweetCount >= desiredTweetCount) break;

    // Scroll down
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    await new Promise(r => setTimeout(r, 500));
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

        //push the object
        tweetObjects.push({
          socialContext: socialContextText,
          authorHandle: "@" + authorHandle,
          isQuoteTweet: isQuoteTweet,
          datetime: datetime,
          // tweetText: tweetText.trim(),
        });
      });

      return tweetObjects;
    });

    console.log("Tweets logged:" + tweets.length);

    return tweets;
  } catch (error) {
    console.error("Error during evaluation:", error.message);
  }

  await browser.close();
}

async function scrapeAndLogTweets(url) {
  try {
    const tweets = await scrapeTweets(url);
    console.log("Scraping completed.");
    console.log("Tweets:", tweets);
  } catch (err) {
    console.error("Error during scraping:", err);
  }
}

scrapeAndLogTweets("https://twitter.com/coindesk");
