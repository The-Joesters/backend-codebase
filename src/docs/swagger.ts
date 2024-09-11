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
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Ensure these paths are correct
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;