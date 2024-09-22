/**
 * @swagger
 * /books/coverImage/{bookId}:
 *   post:
 *     summary: Upload a cover image for a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the book to update with the cover image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The cover image file to upload
 *     responses:
 *       200:
 *         description: Book cover image successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the book
 *                 title:
 *                   type: string
 *                   description: The title of the book
 *                 category_id:
 *                   type: integer
 *                   description: The ID of the book's category
 *                 summary:
 *                   type: string
 *                   description: A brief summary of the book
 *                 cover_image:
 *                   type: string
 *                   format: url
 *                   description: URL of the uploaded cover image
 *                 audio_path:
 *                   type: string
 *                   nullable: true
 *                   description: Path to the book's audio file, if available
 *                 audio_length:
 *                   type: integer
 *                   nullable: true
 *                   description: Length of the audio file in seconds, if available
 *                 section_count:
 *                   type: integer
 *                   description: Number of sections in the book
 *                 uploaded_by_user_id:
 *                   type: integer
 *                   nullable: true
 *                   description: ID of the user who uploaded the book, if available
 *                 is_public:
 *                   type: boolean
 *                   description: Whether the book is public or not
 *                 question:
 *                   type: string
 *                   description: A question related to the book
 *                 answer:
 *                   type: boolean
 *                   description: The answer to the question
 *       500:
 *         description: Failed to add book cover image
 */
