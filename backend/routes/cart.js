const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, requireCustomer } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart with items
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, requireCustomer, cartController.getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               isbn:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Insufficient stock
 *       404:
 *         description: Book not found
 */
router.post('/items', authenticate, requireCustomer, [
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate
], cartController.addToCart);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart item not found
 */
router.put('/items/:itemId', authenticate, requireCustomer, [
  param('itemId').isInt().withMessage('Valid item ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
  validate
], cartController.updateCartItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Cart item not found
 */
router.delete('/items/:itemId', authenticate, requireCustomer, [
  param('itemId').isInt().withMessage('Valid item ID is required'),
  validate
], cartController.removeFromCart);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - expiry
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 description: Credit card number (simulated)
 *               expiry:
 *                 type: string
 *                 format: date
 *                 description: Card expiry date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Checkout successful
 *       400:
 *         description: Validation error or insufficient stock
 */
router.post('/checkout', authenticate, requireCustomer, [
  body('cardNumber').trim().notEmpty().withMessage('Card number is required'),
  body('expiry').isISO8601().withMessage('Valid expiry date is required'),
  validate
], cartController.checkout);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/clear', authenticate, requireCustomer, cartController.clearCart);

module.exports = router;
