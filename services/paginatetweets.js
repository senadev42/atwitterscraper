import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config();

const connectionString = process.env.POSTGRES_CONN_STRING;

export async function paginatetweets(page = 1, size = 5, returnAll = false) {

    console.log("Trying to connect to DB");
    const client = new Client({
        connectionString: connectionString,
    });

    console.log("Connected to DB");

    try {
        await client.connect();

        let query;
        let values;

        if (returnAll) {
            query = `
                SELECT * FROM scrapedtweets
                ORDER BY id DESC;
            `;
            values = [];
        } else {
            const offset = (page - 1) * size;
            query = `
                SELECT * FROM scrapedtweets
                ORDER BY id DESC
                LIMIT $1 OFFSET $2;
            `;
            values = [size, offset];
        }

        const { rows } = await client.query(query, values);

        return rows;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    } finally {
        await client.end();
    }
}
