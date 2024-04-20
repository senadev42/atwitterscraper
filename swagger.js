import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Twitter Scraper API',
            version: '1.0.0',
            description: 'API documentation generated with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);
const swaggerUi = swaggerUiExpress;

export { swaggerUi, specs };
