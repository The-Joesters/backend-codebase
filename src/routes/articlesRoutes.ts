import { Router } from 'express';
import { createOne, getAll, getOne } from '../utils/crudUtils';
import { StartArticle, UploadArticle } from '../controllers/articlesController';

const articleRoute: Router = Router()

articleRoute.get("/articles", getAll('articles', () => {return true }));
articleRoute.get("/articles/:id", getOne('articles'));
articleRoute.post("/articles/upload", UploadArticle,StartArticle)

export default articleRoute;