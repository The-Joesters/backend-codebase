import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        userId?: number;
    }
}
import articlesService from '../services/articlesService';
import { createOne, getAll, getOne } from '../utils/crudUtils';
import webScrapeService from '../services/webScrapeService';
import SummarizatinService from '../services/SummarizatinService';
import prisma from '../prisma/prismaClient';
import ApiError from '../middlewares/ApiError';
import ArticleData from '../interfaces/ArticleData';
import articleReadingProgressService from '../services/articleReadingProgressService';

export const UploadArticle = createOne('articles', async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = req.body || {};
        req.userId = 2;
        console.log(req.body);
        console.log("this is the qurey", req.query);
        const link = `${req.query.link}`;
        const webScrapeServices = new webScrapeService();
        console.log(link);
        if (!articlesService.isMediumWebsite(link)) {
            throw new Error("Invalid Medium link");
        }
        const { title, contentFile } = await webScrapeServices.GetArticle(link);
        console.log("link test")
        req.body.article_link = link;
        console.log("tetttttttt")
        req.body.title = title;
        const summarization = await SummarizatinService.ArticleSummarize(contentFile);
        console.log("summarization:", summarization);
        if (!summarization) {
            throw new Error("Error while getting the summarization");
        }
        req.body.summary = summarization;
        console.log("req.body: ", req.body);
        const created = await prisma.articles.create({
            data: req.body,
        });
    } catch (error) {
        next(error);
    }

}
);

export const StartArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.id) {
            return false;
        }
        const StartArticleData: ArticleData = {};

        StartArticleData.article_id = req.body.id;
        StartArticleData.user_id = req.userId!;
        req.body = StartArticleData;
        const created = await prisma.article_reading_progress.create({
            data: req.body
        })
        console.log("created", created);

        console.log(req.body.article_id, req.body.user_id);
        return true;
    } catch (error) {
        return false;
    }

}
export const ValidateId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ status: "error", message: "Invalid article ID." });
    }
    next();
}

export const StartArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.userId = 2;
        const data: ArticleData = {};
        data.article_id = parseInt(req.params.article_id);
        data.user_id = req.userId;
        req.body = data;
        const isExist = await prisma.article_reading_progress.findFirst({
            where: data
        })

        if (!isExist) {
            const created = await prisma.article_reading_progress.create({
                data: req.body
            })
            return res.status(201).json({ message: 'Created successfully', data: created });
        } else {
            return res.status(200).json({ message: "already Started reading" })
        }


    } catch (error) {
        next(new ApiError("Error while Starting this article , please try again later", 500));
    }
}

export const FinishArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.userId = 2;
        const data: ArticleData = {};
        data.article_id = parseInt(req.params.article_id);
        data.user_id = req.userId;
        const isArticleExist = await articleReadingProgressService.isExist(data.article_id);
        if (!isArticleExist) {
            return res.status(404).send({ "message": "This article is not found" })
        }

        const updated = await articleReadingProgressService.FinishArticle(data);
        if (updated) {
            res.status(200).json({ "message": "Updated Successfully", data: updated })
        } else {
            next(new ApiError("Error Finsishing the book, try again later after while", 500));
        }

    } catch (error) {
        next(error);
        next(new ApiError("Error Finsishing the book, try again later", 500));
    }

}

export const getArtilesInProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.userId = req.userId || 2;// for test purposes
        const userId = req.userId;
        const Articles = await articleReadingProgressService.articlesInProgress(userId!, 'inprogress');
        res.status(200).send({ "message": "Got Successfully", "data": Articles });
    } catch (error) {
        next(new ApiError("Error While getting the Articles ", 500))
    }
}

export const getArticlesCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("ia m here and this the error")
        const userId = req.userId || 2; //for test purposes
        const completedArticles = await articleReadingProgressService.articlesInProgress(userId!, 'completed');
        res.status(200).send({ "message": "Got Successfully", "data": completedArticles });
    } catch (error) {
        next(new ApiError("Error while getting the completed Articles", 500));
    }
}


export const bookmarkArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId || 2;
        const article_id = parseInt(req.params.ArticleId);

        const isExist = await prisma.articles.findFirst({
            where: {
                id: article_id
            }
        })
        if (!isExist) {
            return next(new ApiError("This article id is not found", 404));
        }

        const data = await articlesService.BookmarkArticle(userId, article_id);
        return res.status(200).send({ "message": "Created Successfully", "data": data });


    } catch (error) {
        next(error);
    }
}
export const deleteBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId || 2;
        const article_id = parseInt(req.params.ArticleId);

        const isExist = await prisma.articles.findFirst({
            where: {
                id: article_id
            }
        })
        if (!isExist) {
            return next(new ApiError("This article id is not found", 404));
        }

        const isbookmarked = await articlesService.checkBookmark(userId, article_id);
        if (!isbookmarked) {
            return next(new ApiError("This article is not bookmarked", 404));
        }
        await articlesService.deleteBookmarkArticle(userId, article_id);
        return res.status(204);
    } catch (error) {

    }
}
export const getBookmarkedArticles = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = req.userId || 2;
        const data = await articlesService.getBookMarked(userId);
        if (!data) {
            return next(new ApiError("there is no bookmarks yet!", 404));
        }
        return res.status(200).send({ "message": "Got Successfully", "data": data })
    } catch (error) {
        next(error);
    }

}



