import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import userRoutes from './routes/userRoutes'
import morgan from 'morgan';
import articleRoute from './routes/articlesRoutes';
import { globalErrorHandler } from './middlewares/errorHandler';
import ApiError from './middlewares/ApiError';
import bodyParser from 'body-parser';
import cors from 'cors';
import booksRoute from './routes/booksRoutes';
export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', userRoutes);
app.use('/api', articleRoute);
app.use('/api',booksRoute)
app.get('/submitt', async (req: Request, res: Response) => {
  res.send({"data":'Hello World'});
});
app.get('/',(req:Request,res:Response)=>{
  res.send("This is Reading Sphere home page got to /api-docs ");
})

//hande wrong routes
const re=new RegExp('(.*)');
app.use(re, (req: Request, res: Response, next: NextFunction) => {
next(new ApiError("Route Not Found",404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
