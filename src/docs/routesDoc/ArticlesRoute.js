// RoutesDocs.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the article
 *         title:
 *           type: string
 *           description: The title of the article
 *         article_link:
 *           type: string
 *           description: The URL of the article
 *         summary:
 *           type: string
 *           description: A brief summary of the article
 *         uploaded_by_user_id:
 *           type: integer
 *           description: The ID of the user who uploaded the article
 *         is_public:
 *           type: boolean
 *           description: Indicates if the article is public
 */

/**
 * @swagger
 * /articles/completed:
 *   get:
 *     summary: Get completed articles
 *     responses:
 *       200:
 *         description: Successfully retrieved completed articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles/inprogress:
 *   get:
 *     summary: Get articles in progress
 *     responses:
 *       200:
 *         description: Successfully retrieved articles in progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles/bookmarked:
 *   get:
 *     summary: Get bookmarked articles
 *     responses:
 *       200:
 *         description: Successfully retrieved bookmarked articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     responses:
 *       200:
 *         description: Successfully retrieved all articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles/upload:
 *   post:
 *     summary: Upload a new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               article_link:
 *                 type: string
 *               summary:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully uploaded article
 */

/**
 * @swagger
 * /articles/bookmark/{ArticleId}:
 *   post:
 *     summary: Bookmark an article
 *     parameters:
 *       - in: path
 *         name: ArticleId
 *         required: true
 *         description: ID of the article to bookmark
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully bookmarked article
 */

/**
 * @swagger
 * /articles/bookmark/{ArticleId}:
 *   delete:
 *     summary: Delete a bookmark
 *     parameters:
 *       - in: path
 *         name: ArticleId
 *         required: true
 *         description: ID of the article to remove from bookmarks
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted bookmark
 */

/**
 * @swagger
 * /articles/finish/{article_id}:
 *   post:
 *     summary: Finish reading an article
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: ID of the article to finish
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully marked article as finished
 */
