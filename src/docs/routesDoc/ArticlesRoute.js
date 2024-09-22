/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         article_link:
 *           type: string
 *         category_id:
 *           type: integer
 *           nullable: true
 *         summary:
 *           type: string
 *           nullable: true
 *         uploaded_by_user_id:
 *           type: integer
 *           nullable: true
 *         is_public:
 *           type: boolean
 *     ArticleReadingProgress:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         article_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         is_completed:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     BookmarkedArticle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         article_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @swagger
 * /api/articles/completed:
 *   get:
 *     summary: Get completed articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ArticleReadingProgress'
 */

/**
 * @swagger
 * /api/articles/inprogress:
 *   get:
 *     summary: Get articles in progress
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ArticleReadingProgress'
 */

/**
 * @swagger
 * /api/articles/bookmarked:
 *   get:
 *     summary: Get bookmarked articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookmarkedArticle'
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/upload:
 *   post:
 *     summary: Upload a new article
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/bookmark/{ArticleId}:
 *   delete:
 *     summary: Delete a bookmark
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: ArticleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     summary: Bookmark an article
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: ArticleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookmarkedArticle'
 */

/**
 * @swagger
 * /api/articles/finish/{article_id}:
 *   post:
 *     summary: Finish an article
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ArticleReadingProgress'
 */

/**
 * @swagger
 * /api/articles/{article_id}:
 *   post:
 *     summary: Start an article by ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get an article by ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 */