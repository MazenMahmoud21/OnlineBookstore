const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const bookController = require('../controllers/bookController');

const router = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with search/filter
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by title or ISBN
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author name
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *         description: Filter by publisher name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of books with pagination
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  validate
], bookController.getBooks);

/**
 * @swagger
 * /books/{isbn}:
 *   get:
 *     summary: Get book by ISBN
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/:isbn', [
  param('isbn').trim().notEmpty().withMessage('ISBN is required'),
  validate
], bookController.getBookByISBN);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isbn
 *               - title
 *               - publisherId
 *               - sellingPrice
 *               - categoryId
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *               publisherId:
 *                 type: integer
 *               publicationYear:
 *                 type: integer
 *               sellingPrice:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               quantityInStock:
 *                 type: integer
 *               reorderThreshold:
 *                 type: integer
 *               authorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', authenticate, requireAdmin, [
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('publisherId').isInt().withMessage('Publisher ID is required'),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() + 1 }),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be positive'),
  body('categoryId').isInt().withMessage('Category ID is required'),
  body('quantityInStock').optional().isInt({ min: 0 }),
  body('reorderThreshold').optional().isInt({ min: 0 }),
  body('authorIds').optional().isArray(),
  validate
], bookController.createBook);

/**
 * @swagger
 * /books/{isbn}:
 *   put:
 *     summary: Update book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               publisherId:
 *                 type: integer
 *               publicationYear:
 *                 type: integer
 *               sellingPrice:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               quantityInStock:
 *                 type: integer
 *               reorderThreshold:
 *                 type: integer
 *               authorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 */
router.put('/:isbn', authenticate, requireAdmin, [
  param('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('title').optional().trim().notEmpty(),
  body('publisherId').optional().isInt(),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() + 1 }),
  body('sellingPrice').optional().isFloat({ min: 0 }),
  body('categoryId').optional().isInt(),
  body('quantityInStock').optional().isInt({ min: 0 }),
  body('reorderThreshold').optional().isInt({ min: 0 }),
  body('authorIds').optional().isArray(),
  validate
], bookController.updateBook);

/**
 * @swagger
 * /books/{isbn}:
 *   delete:
 *     summary: Delete book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
router.delete('/:isbn', authenticate, requireAdmin, [
  param('isbn').trim().notEmpty().withMessage('ISBN is required'),
  validate
], bookController.deleteBook);

module.exports = router;
