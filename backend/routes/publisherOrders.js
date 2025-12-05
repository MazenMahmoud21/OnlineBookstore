const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const publisherOrderController = require('../controllers/publisherOrderController');

const router = express.Router();

/**
 * @swagger
 * /publisher-orders:
 *   get:
 *     summary: Get all publisher orders (Admin only)
 *     tags: [Publisher Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Cancelled]
 *         description: Filter by status
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
 *         description: List of publisher orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', authenticate, requireAdmin, [
  query('status').optional().isIn(['Pending', 'Confirmed', 'Cancelled']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  validate
], publisherOrderController.getPublisherOrders);

/**
 * @swagger
 * /publisher-orders/{id}:
 *   get:
 *     summary: Get publisher order by ID (Admin only)
 *     tags: [Publisher Orders]
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
 *         description: Publisher order details with items
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid order ID is required'),
  validate
], publisherOrderController.getPublisherOrderById);

/**
 * @swagger
 * /publisher-orders:
 *   post:
 *     summary: Create publisher order manually (Admin only)
 *     tags: [Publisher Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publisherId
 *               - items
 *             properties:
 *               publisherId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     isbn:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', authenticate, requireAdmin, [
  body('publisherId').isInt().withMessage('Publisher ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.isbn').trim().notEmpty().withMessage('ISBN is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate
], publisherOrderController.createPublisherOrder);

/**
 * @swagger
 * /publisher-orders/{id}/confirm:
 *   post:
 *     summary: Confirm publisher order (Admin only)
 *     tags: [Publisher Orders]
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
 *         description: Order confirmed
 *       404:
 *         description: Order not found or not pending
 */
router.post('/:id/confirm', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid order ID is required'),
  validate
], publisherOrderController.confirmPublisherOrder);

/**
 * @swagger
 * /publisher-orders/{id}/cancel:
 *   post:
 *     summary: Cancel publisher order (Admin only)
 *     tags: [Publisher Orders]
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
 *         description: Order cancelled
 *       404:
 *         description: Order not found or not pending
 */
router.post('/:id/cancel', authenticate, requireAdmin, [
  param('id').isInt().withMessage('Valid order ID is required'),
  validate
], publisherOrderController.cancelPublisherOrder);

module.exports = router;
