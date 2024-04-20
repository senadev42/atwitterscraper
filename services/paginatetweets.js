import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config();

const connectionString = process.env.POSTGRES_CONN_STRING;

export async function paginatetweets(page = 1, size = 5) {

    console.log("Trying to connect to DB");
    const client = new Client({
        connectionString: connectionString,
    });

    console.log("Connected to DB");

    try {
        await client.connect();

        const offset = (page - 1) * size;
        const query = `
            SELECT * FROM scrapedtweets
            ORDER BY datetime DESC
            LIMIT $1 OFFSET $2;
        `;
        const { rows } = await client.query(query, [size, offset]);

        return rows;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    } finally {
        await client.end();
    }
}