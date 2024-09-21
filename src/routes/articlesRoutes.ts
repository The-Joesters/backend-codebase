import { Router } from 'express';
import { createOne, getAll, getOne } from '../utils/crudUtils';
import { bookmarkArticle, deleteBookmark, FinishArticle, getArticlesCompleted, getArtilesInProgress, getBookmarkedArticles, StartArticle, StartArticleById, UploadArticle, ValidateId } from '../controllers/articlesController';

const articleRoute: Router = Router()
articleRoute.get("/articles/completed", getArticlesCompleted);
articleRoute.get("/articles/inprogress", getArtilesInProgress);
articleRoute.get("/articles/bookmarked", getBookmarkedArticles);
articleRoute.get("/articles", getAll('articles'));
articleRoute.post("/articles/upload", UploadArticle, StartArticle);
articleRoute.delete("/articles/bookmark/:ArticleId",deleteBookmark);
articleRoute.post("/articles/bookmark/:ArticleId", bookmarkArticle);
articleRoute.post("/articles/finish/:article_id", FinishArticle);
articleRoute.post("/articles/:article_id", StartArticleById);
articleRoute.get("/articles/:id", ValidateId, getOne('articles'));

export default articleRoute;