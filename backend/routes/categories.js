const express = require('express');
const { param } = require('express-validator');
const { validate } = require('../middleware/validate');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details with books
 *       404:
 *         description: Category not found
 */
router.get('/:id', [
  param('id').isInt().withMessage('Valid category ID is required'),
  validate
], categoryController.getCategoryById);

module.exports = router;
