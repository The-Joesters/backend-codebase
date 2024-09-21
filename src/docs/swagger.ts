import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Reading Sphere API',
    version: '1.0.0',
    description: 'API documentation for Reading Sphere application',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local server',
    },
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/docs/routesDoc/*js', './src/controllers/*.ts'], // Ensure these paths are correct
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;