import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config();

const connectionString = process.env.POSTGRES_CONN_STRING;

export default async function initDB() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();

        // Check if the scrapedtweets table exists
        const tableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'scrapedtweets'
            );
        `;
        const { rows } = await client.query(tableExistsQuery);
        const tableExists = rows[0].exists; 

        if (!tableExists) {
            // Create it if it doesn't exist
            const createTableQuery = `
            CREATE TABLE scrapedtweets (
                id SERIAL PRIMARY KEY,
                socialContext TEXT,
                authorHandle VARCHAR(20),
                isQuoteTweet BOOLEAN,
                datetime TIMESTAMP,
                tweetText TEXT,
                hash VARCHAR(255) UNIQUE,
                isVideoPost BOOLEAN,
                videoURL VARCHAR(255)
            );`;

            await client.query(createTableQuery);
            console.log("Table scrapedtweets created successfully.");
        } else {
            console.log("Table scrapedtweets already exists.");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        await client.end();
    }
}

