# Twitter Scraping Server

This project is a Node.js application for scraping tweets from a given twitter account, storing them in a PostgreSQL database, and serving them over a simple REST API.

It uses puppeteer for the scraping, express for the server, postgres for the database, and swagger for api docs.

Almost the entirety of the scraping logic is in utilities/scraper.js while everything else is set up like a typical express server.


### Setup

#### Prerequisites
- Node.js installed on your system
- PostgreSQL installed and running, or a managed database like [neonDB](https://neon.tech/).

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
3. The postgres a database. You can use your own postgres db or a managed postgres db like neon. Just create a .env file and add a connection string. Refer to the .env.example file if needed.

```
POSTGRES_CONN_STRING = "postgresql://<username>:<password>@<dbhost>/<dbname>?sslmode=require"
```

Note: Including the ```sslmode=require``` parameter is required if you're going to be using this with a managed database like neon. 

4. Start the server:

```
npm run dev
```

#### Usage
Once the server is running, you can access the API and Swagger documentation. The port is 3000 by default but you can change it by setting a PORT value in the .env file.

- API Base URL: ```http://localhost:3000/```
- Swagger Documentation: ```http://localhost:3000/api-docs```



#### Scraping
The server is configured to scrape tweets every hour using node-scheduler. 

However, for testing purposes, you can use the following endpoint to do an automatic scrape.

- Manually Scrape Tweets API: ```GET http://localhost:3000/api/tweets/manualscrape```


#### API Endpoints
GET /api/tweets: Retrieve saved tweets with pagination.
