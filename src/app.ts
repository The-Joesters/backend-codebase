import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import userRoutes from './routes/userRoutes'
import articleRoute from './routes/articlesRoutes';
import { NextFunction } from 'http-proxy-middleware/dist/types';
import { globalErrorHandler } from './middlewares/errorHandler';
import ApiError from './middlewares/ApiError';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', userRoutes);
app.use('/api', articleRoute);
app.get('/submitt', async (req: Request, res: Response) => {
  res.send({"data":'Hello World'});
});

//hande wrong routes
const re=new RegExp('(.*)');
app.use(re, (req: Request, res: Response, next: NextFunction) => {
next(new ApiError("Route Not Found",404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
