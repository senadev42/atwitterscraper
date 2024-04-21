import axios from "axios";
import fs from "fs";
import path from "path";

export async function processImages(tweetObjects) {
  const downloadDir = "./downloaded_images";
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  const tweetswithImages = tweetObjects.filter(
    (tweet) => tweet.imageurl != null
  );
  console.log(`Found ${tweetswithImages.length} tweets with image urls.`);

  for (const tweet of tweetswithImages) {
    try {
      console.log(`Downloading image for tweet: ${tweet.imageurl}`);

      //download the image
      const response = await axios.get(tweet.imageurl, {
        responseType: "stream",
      });

      //check type
      const imageformat = response.headers["content-type"].split("/")[1];

      //save the image
      const filePath = path.join(
        downloadDir,
        path.basename(tweet.imageurl.split("?")[0] + "." + imageformat)
      );
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      console.log(`Image downloaded: ${filePath}`);
    } catch (error) {
      console.error(
        `Failed to download image for tweet: ${tweet.imageurl}`,
        error
      );
    }
  }
}

// Test
// const tweetObjects = [
//  { ImageUrl: 'https://pbs.twimg.com/media/GLlIMhBXYAAd89J?format=jpg&name=small',
// hash:'tryuimnuibyuvtyretrcytvuybiunjom' },
// ];

// processImages(tweetObjects).then(() => console.log('All images downloaded.'));
