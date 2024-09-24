/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         summary:
 *           type: string
 *           nullable: true
 *         cover_image:
 *           type: string
 *           nullable: true
 *         is_completed:
 *           type: boolean
 *         is_bookmarked:
 *           type: boolean
 * 
 *     BookReadingProgress:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         is_completed:
 *           type: string
 *           format: date-time
 *           nullable: true
 * 
 *     BookmarkedBook:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @swagger
 * /api/books/completed:
 *   get:
 *     summary: Get completed books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookReadingProgress'
 */

/**
 * @swagger
 * /api/books/inprogress:
 *   get:
 *     summary: Get books in progress
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookReadingProgress'
 */

/**
 * @swagger
 * /api/books/bookmarked:
 *   get:
 *     summary: Get bookmarked books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookmarkedBook'
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/books/coverImage/{bookId}:
 *   post:
 *     summary: Upload a cover image for a book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cover image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/books/bookmark/{book_id}:
 *   post:
 *     summary: Bookmark a book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookmarkedBook'
 */

/**
 * @swagger
 * /api/books/finish/{book_id}:
 *   post:
 *     summary: Mark a book as finished
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book marked as finished
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookReadingProgress'
 */

/**
 * @swagger
 * /api/books/{book_id}:
 *   post:
 *     summary: Start reading a book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Started reading book successfully
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags:
 *       - Books
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
 *               $ref: '#/components/schemas/Book'
 */
