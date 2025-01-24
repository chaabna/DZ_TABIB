// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'DZ-Tabib API', // Title of your API
            version: '1.0.0', // Version of your API
            description: 'API for managing medical appointments and reviews', // Description of your API
        },
        servers: [
            {
                url: 'http://localhost:5000', // Base URL of your API
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default (app) => {
    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};