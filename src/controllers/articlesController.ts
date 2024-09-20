import { NextFunction, Request, Response } from 'express';
import articlesService from '../services/articlesService';
import { createOne, getAll, getOne } from '../utils/crudUtils';
import webScrapeService from '../services/webScrapeService';
import SummarizatinService from '../services/SummarizatinService';



export const UploadArticle = createOne('articles', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const link = `${req.query.link}`;
        const webScrapeServiceo = new webScrapeService();
        console.log(link);
        if (!articlesService.isMediumWebsite(link)) {
            throw new Error("Invalid Medium link");
        }
        const { title, author, contentFile } = await webScrapeServiceo.GetArticle(link);
        req.body.article_link = link;
        req.body.title = title;
        const summarization =await SummarizatinService.ArticleSummarize(contentFile);
        console.log("summarization:",summarization);
        if (!summarization) {
            throw new Error("Error while getting the summarization");
        }
        req.body.summary=summarization;
        return true
    } catch (error) {
        next(error);
        return false;
    }

}
);

export const StartArticle=createOne('article_reading_progress')
