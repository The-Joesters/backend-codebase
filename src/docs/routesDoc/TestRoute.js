/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Test api
 *   description: API for test purposes
 */

/**
 * @swagger
 * /api/test/Getall:
 *   get:
 *     summary: Retrieve nothing
 *     tags: [Test api]
 *     responses:
 *       200:
 *         description: Successfully retrieved nothing
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id:
 *                     type: integer
 *                     description: The ID of nothing
 *                   Name:
 *                     type: string
 *                     description: The name of the nothing
 *       404:
 *         description: Nothing found
 */