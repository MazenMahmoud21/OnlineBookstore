const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const publisherController = require('../controllers/publisherController');

const router = express.Router();

/**
 * @swagger
 * /publishers:
 *   get:
 *     summary: Get all publishers
 *     tags: [Publishers]
 *     responses:
 *       200:
 *         description: List of publishers
 */
router.get('/', publisherController.getPublishers);

/**
 * @swagger
 * /publishers/{id}:
 *   get:
 *     summary: Get publisher by ID
 *     tags: [Publishers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Publisher details with books
 *       404:
 *         description: Publisher not found
 */
router.get('/:id', [
  param('id').isInt().withMessage('Valid publisher ID is required'),
  validate
], publisherController.getPublisherById);

/**
 * @swagger
 * /publishers:
 *   post:
 *     summary: Create new publisher (Admin only)
 *     tags: [Publishers]
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publisher created
 */
router.post('/', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Publisher name is required'),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  validate
], publisherController.createPublisher);

/**
 * @swagger
 * /publishers/{id}:
 *   put:
 *     summary: Update publisher (Admin only)
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publisher updated
 *       404:
 *         description: Publisher not found
 */
router.put('/:id', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid publisher ID is required'),
  body('name').optional().trim().notEmpty(),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  validate
], publisherController.updatePublisher);

/**
 * @swagger
 * /publishers/{id}:
 *   delete:
 *     summary: Delete publisher (Admin only)
 *     tags: [Publishers]
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
 *         description: Publisher deleted
 *       400:
 *         description: Cannot delete publisher with existing books
 *       404:
 *         description: Publisher not found
 */
router.delete('/:id', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid publisher ID is required'),
  validate
], publisherController.deletePublisher);

module.exports = router;
