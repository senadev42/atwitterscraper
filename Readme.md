# Twitter Scraping Server

This project is a Node.js application for scraping tweets from a given twitter account, storing them in a PostgreSQL database, and serving them over a simple REST API. It uses puppeteer for the scraping, express for the server, postgres for the database, and swagger for api docs.

Almost the entirety of the scraping logic is in utilities/scraper.js while everything else is set up like a typical express server.


### Hosted version 

A hosted version of this api using render's free tier can be found at https://atwitterscraper.onrender.com with the swagger api documentation hosted at https://atwitterscraper.onrender.com/api-docs.

This version is **limited** in that 
- it will take time to spin up since render spins down servers after a period of inactivity, so it will not start automatically.
- limited ci/cd + no access to the shell means puppeteer doesn't have access to chromium on the render server without doing some truly hacky stuff.


While /api/tweets will serve tweets scraped so far on the hosted version, to do a full test it will have be setup locally or on a controlled enviroment.

### Getting Started

#### Prerequisites
- Node.js installed on your system
- PostgreSQL installed and running, or a managed database like [neonDB](https://neon.tech/).
- A mailgun account and api key (for the email functionality).

#### Setup
1. Clone this repository:
```
git clone https://github.com/senadev42/atwitterscraper.git
```

2. Install dependencies:

```
cd 
npm install
```
3. This project uses postgres as a database. You can use your own postgres db or a managed postgres db like neon (link above in pre-requisites). Just create a .env file and add a postgres connection string. Refer to the .env.example file if needed.

```
POSTGRES_CONN_STRING = "postgresql://<username>:<password>@<dbhost>/<dbname>?sslmode=require"
```

Note: Including the ```sslmode=require``` parameter is required if you're going to be using this with a managed database like neon. 

4. This project uses mailgun as an email provider. You'll need to create a mailgun account and get an api key and a domain. And without verification, you'll need to add the email account you're testing with into Authorized Recepients under Sending > Overview in Mailgun.

```
MAILGUN_API_KEY = ""
MAILGUN_DOMAIN = ""
EMAIL_TARGET = ""
```

5. Start the server:

```
npm run dev
```

### Usage
Once the server is running, you can access the API and Swagger documentation. The port is 3000 by default but you can change it by setting a PORT value in the .env file.

- Swagger Documentation: ```/api-docs```


#### Scraping
The server is configured to scrape periodically using node-scheduler, grabbing what it can and then generating a hash for a tweet using the author, time and other details to use as a unique identifier.

While it runs once an hour, for testing purposes, you can use ```GET /api/tweets/manualscrape``` to do trigger an immediate scrape.



