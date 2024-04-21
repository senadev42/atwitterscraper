import { paginatetweets } from "../services/paginatetweets.js";
import scrapeandloadtweets from "../services/scrapeandload.js";
import {processImages} from "../utilities/processImages.js";


export const getPaginatedTweets = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;

    try {
        const tweets = await paginatetweets(page, size);
        res.status(200).json(tweets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching scraped tweets' });
    }
}


export const manualscrape = async (req, res) => {
    try {
        await scrapeandloadtweets();
        res.status(200).json({ message: "Successfully scraped tweets" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error scraping tweets' });
    }
}

export const loadimages = async (req, res) => {
    try {
        const alltweets = await paginatetweets(0, 0, true);
        console.log(alltweets); 

        await processImages(alltweets);

        res.status(200).json({ message: "Successfully downloaded all tweet images" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error scraping tweets' });
    }
} 
