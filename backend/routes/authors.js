const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const authorController = require('../controllers/authorController');

const router = express.Router();

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors
 */
router.get('/', authorController.getAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author details with books
 *       404:
 *         description: Author not found
 */
router.get('/:id', [
  param('id').isInt().withMessage('Valid author ID is required'),
  validate
], authorController.getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create new author (Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created
 */
router.post('/', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Author name is required'),
  validate
], authorController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update author (Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated
 *       404:
 *         description: Author not found
 */
router.put('/:id', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid author ID is required'),
  body('name').trim().notEmpty().withMessage('Author name is required'),
  validate
], authorController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete author (Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author deleted
 *       404:
 *         description: Author not found
 */
router.delete('/:id', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid author ID is required'),
  validate
], authorController.deleteAuthor);

module.exports = router;
