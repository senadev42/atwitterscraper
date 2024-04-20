import {paginatetweets} from "../services/paginatetweets.js";


export const getPaginatedTweets = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;

    try {
        const tweets = await paginatetweets(page, size);
        res.status(200).json(tweets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching tweets' });
    }
}

