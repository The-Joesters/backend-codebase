import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import userRoutes from './routes/userRoutes'

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
// API documentation route
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api',userRoutes);
app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
