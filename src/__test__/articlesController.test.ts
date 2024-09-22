import request from 'supertest';
import { app } from '../app'; // Ensure this is the correct path to your Express app
import prisma from '../prisma/prismaClient';
import { UploadArticle, StartArticle, ValidateId, StartArticleById, FinishArticle, getArtilesInProgress, getArticlesCompleted, bookmarkArticle, deleteBookmark, getBookmarkedArticles } from '../controllers/articlesController';
import articlesService from '../services/articlesService';
import webScrapeService from '../services/webScrapeService';
import SummarizatinService from '../services/SummarizatinService';
import articleReadingProgressService from '../services/articleReadingProgressService';
import ApiError from '../middlewares/ApiError';

jest.mock('../services/articlesService');
jest.mock('../services/webScrapeService');
jest.mock('../services/SummarizatinService');
jest.mock('../services/articleReadingProgressService');
jest.mock('../prisma/prismaClient', () => ({
    articles: {
        create: jest.fn(),
    },
}));



    describe('Articles Controller', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        describe('createArticle', () => {
            it('should create an article successfully', async () => {
                const mockArticle = { title: 'Test Article', article_link: 'https://medium.com/test-article' };
                const mockContentFile = 'Test Content';
                const mockSummary = 'Test Summary';
    
                (articlesService.isMediumWebsite as jest.Mock).mockReturnValue(true);
                (webScrapeService.prototype.GetArticle as jest.Mock).mockResolvedValue({ title: mockArticle.title, contentFile: mockContentFile });
                (SummarizatinService.ArticleSummarize as jest.Mock).mockResolvedValue(mockSummary);
                (prisma.articles.create as jest.Mock).mockResolvedValue(mockArticle);
    
                const response = await request(app).post('/api/articles/upload').query({ link: mockArticle.article_link });
                console.log(response.body);
                expect(response.status).toBe(201);
                expect(response.body.message).toBe('Created successfully');
                expect(response.body.data).toEqual(mockArticle);
            });
    
            it('should handle errors during article creation', async () => {
                (articlesService.isMediumWebsite as jest.Mock).mockReturnValue(true);
                (webScrapeService.prototype.GetArticle as jest.Mock).mockRejectedValue(new Error('Scraping Error'));
    
                const response = await request(app).post('/api/articles/upload').query({ link: 'https://medium.com/test-article' });
    
                expect(response.status).toBe(500);
                expect(response.body.message).toBe('Error while uploading the article');
            });
    
            it('should handle errors during article creation', async () => {
                (prisma.articles.create as jest.Mock).mockRejectedValue(new Error('Creation Error'));
    
                const response = await request(app).post('/api/articles').send({ title: 'Test Article' });
    
                expect(response.status).toBe(500);
                expect(response.body.message).toBe('Error creating article');
            });
        });

    describe('StartArticle', () => {
        it('should start an article successfully', async () => {
            const response = await request(app).post('/api/articles/start').send({ id: 1 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Article started successfully');
        });

        it('should handle errors during article start', async () => {
            const response = await request(app).post('/api/articles/start').send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Article ID is required');
        });
    });

    describe('ValidateId', () => {
        it('should validate article ID successfully', async () => {
            const response = await request(app).get('/api/articles/validate/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Article ID is valid');
        });

        it('should handle invalid article ID', async () => {
            const response = await request(app).get('/api/articles/validate/abc');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid article ID');
        });
    });

    describe('StartArticleById', () => {
        it('should start an article by ID successfully', async () => {
            const response = await request(app).post('/api/articles/start/1');

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Article started successfully');
        });

        it('should handle errors during article start by ID', async () => {
            const response = await request(app).post('/api/articles/start/abc');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid article ID');
        });
    });

    describe('FinishArticle', () => {
        it('should finish an article successfully', async () => {
            const response = await request(app).post('/api/articles/finish/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Article finished successfully');
        });

        it('should handle errors during article finish', async () => {
            const response = await request(app).post('/api/articles/finish/abc');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid article ID');
        });
    });

    describe('getArtilesInProgress', () => {
        it('should get articles in progress successfully', async () => {
            const response = await request(app).get('/api/articles/inprogress');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Got Successfully');
        });

        it('should handle errors during getting articles in progress', async () => {
            const response = await request(app).get('/api/articles/inprogress');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error while getting the articles in progress');
        });
    });

    describe('getArticlesCompleted', () => {
        it('should get completed articles successfully', async () => {
            const response = await request(app).get('/api/articles/completed');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Got Successfully');
        });

        it('should handle errors during getting completed articles', async () => {
            const response = await request(app).get('/api/articles/completed');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error while getting the completed articles');
        });
    });

    describe('bookmarkArticle', () => {
        it('should bookmark an article successfully', async () => {
            const response = await request(app).post('/api/articles/bookmark/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Created Successfully');
        });

        it('should handle errors during bookmarking an article', async () => {
            const response = await request(app).post('/api/articles/bookmark/abc');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid article ID');
        });
    });

    describe('deleteBookmark', () => {
        it('should delete a bookmark successfully', async () => {
            const response = await request(app).delete('/api/articles/bookmark/1');

            expect(response.status).toBe(204);
        });

        it('should handle errors during deleting a bookmark', async () => {
            const response = await request(app).delete('/api/articles/bookmark/abc');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid article ID');
        });
    });

    describe('getBookmarkedArticles', () => {
        it('should get bookmarked articles successfully', async () => {
            const response = await request(app).get('/api/articles/bookmarked');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Got Successfully');
        });

        it('should handle errors during getting bookmarked articles', async () => {
            const response = await request(app).get('/api/articles/bookmarked');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error while getting the bookmarked articles');
        });
    });
});