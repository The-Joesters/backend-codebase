import request from 'supertest';
import { app } from '../app'; // Ensure this is the correct path to your Express app
import prisma from '../prisma/prismaClient';

describe('Articles Controller', () => {
    beforeAll(async () => {
        // Connect to the test database
        await prisma.$connect();
    });

    afterAll(async () => {
        // Disconnect from the test database
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        // Clear the database before each test
        await prisma.articles.deleteMany();
        await prisma.article_reading_progress.deleteMany();
        await prisma.article_ratings.deleteMany();
        await prisma.bookmarked_articles.deleteMany();
    });

    describe('ValidateId', () => {
        it('should validate article ID successfully', async () => {
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            const response = await request(app).get(`/api/articles/validate/${article.id}`);
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
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            const response = await request(app).post(`/api/articles/start/${article.id}`);
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
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            const response = await request(app).post(`/api/articles/finish/${article.id}`);
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
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            await prisma.article_reading_progress.create({
                data: { article_id: article.id, user_id: 1 },
            });

            const response = await request(app).get('/api/articles/inprogress');
            console.log(`this is the response ${response.body}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Got Successfully');
            expect(response.body.data).toHaveLength(1);
        });

        it('should handle errors during getting articles in progress', async () => {
            const response = await request(app).get('/api/articles/inprogress');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error while getting the articles in progress');
        });
    });

    describe('getArticlesCompleted', () => {
        it('should get completed articles successfully', async () => {
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            await prisma.article_reading_progress.create({
                data: { article_id: article.id, user_id: 1 },
            });

            const response = await request(app).get('/api/articles/completed');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Got Successfully');
            expect(response.body.data).toHaveLength(1);
        });

        it('should handle errors during getting completed articles', async () => {
            const response = await request(app).get('/api/articles/completed');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error while getting the completed articles');
        });
    });

    describe('bookmarkArticle', () => {
        it('should bookmark an article successfully', async () => {
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            const response = await request(app).post(`/api/articles/bookmark/${article.id}`);
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
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            await prisma.article_reading_progress.create({
                data: { article_id: article.id, user_id: 1 },
            });

            const response = await request(app).delete(`/api/articles/bookmark/${article.id}`);
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
            const article = await prisma.articles.create({
                data: { title: 'Test Article', article_link: 'https://medium.com/test-article' },
            });

            await prisma.article_reading_progress.create({
                data: { article_id: article.id, user_id: 1 },
            });

            const response = await request(app).get('/api/articles/bookmarked');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Got Successfully');
            expect(response.body.data).toHaveLength(1);
        });

        it('should handle errors during getting bookmarked articles', async () => {
            const response = await request(app).get('/api/articles/bookmarked');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error while getting the bookmarked articles');
        });
    });
});