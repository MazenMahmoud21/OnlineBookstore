const express = require('express');
const { param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders (customer's own or all for admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of orders with pagination
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  validate
], orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
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
 *         description: Order details with items
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticate, [
  param('id').isInt().withMessage('Valid order ID is required'),
  validate
], orderController.getOrderById);

module.exports = router;
