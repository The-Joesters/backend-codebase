import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { env } from 'process';
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
      url: process.env.SWAGGER_LINK_PUBLIC,
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: ['./src/docs/routesDoc/*js', './src/controllers/*.ts'], // Ensure these paths are correct
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;