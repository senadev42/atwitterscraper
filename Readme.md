# Twitter Scraping Server

This project is a Node.js application for scraping tweets from a given twitter account, storing them in a PostgreSQL database, and providing a REST API for accessing the scraped tweets.

It uses puppeteer for the scraping, express for the server, postgres for the database, and swagger for api docs.


### Setup

#### Prerequisites
Node.js installed on your system
PostgreSQL installed and running

#### Installation
1. Clone this repository:
```
git clone <repository_url>
```

2. Install dependencies:

```
cd <project_folder>
npm install
```
3. The postgres a database. You can use your own postgres db or a managed postgres db like neon. Just create a .env file and add a connection string.

```
POSTGRES_CONN_STRING = "postgresql://<username>:<password>@<dbhost>/<dbname>?sslmode=require"
```


4. Start the server:

```
npm run dev
```

#### Usage
Once the server is running, you can access the API and Swagger documentation:

- API Base URL: ```http://localhost:<port>/api/tweets``
- Swagger Documentation: ```http://localhost:<port>/api-docs```

The port is 3000 by default but you can change it by setting a PORT value in the .env file.

#### Scheduled Scraping
The server is configured to scrape tweets every hour using node-scheduler.

#### API Endpoints
GET /api/tweets: Retrieve saved tweets with pagination.
