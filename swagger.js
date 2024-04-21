import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Twitter Scraper API',
            version: '1.0.0',
            description: 'API documentation for a Node.js server that scrapes tweets from Twitter and provides access to saved tweets. Repo found at: https://github.com/senadev42/atwitterscraper',
        },
    },
    apis: ['server.js', './routes/*.js'], 
};

const specs = swaggerJsdoc(options);
const swaggerUi = swaggerUiExpress;

export { swaggerUi, specs };
