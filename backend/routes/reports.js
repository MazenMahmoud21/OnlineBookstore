const express = require('express');
const { param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

const router = express.Router();

/**
 * @swagger
 * /reports/sales/previous-month:
 *   get:
 *     summary: Get total sales for previous month (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report for previous month
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/sales/previous-month', authenticate, requireAdmin, reportController.getSalesPreviousMonth);

/**
 * @swagger
 * /reports/sales/by-date:
 *   get:
 *     summary: Get total sales for a specific date (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Sales report for the date
 *       400:
 *         description: Date parameter required
 */
router.get('/sales/by-date', authenticate, requireAdmin, [
  query('date').isISO8601().withMessage('Valid date is required'),
  validate
], reportController.getSalesByDate);

/**
 * @swagger
 * /reports/top-customers:
 *   get:
 *     summary: Get top customers by purchase amount (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 3
 *         description: Number of months to look back
 *       - in: query
 *         name: top
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top customers to return
 *     responses:
 *       200:
 *         description: Top customers report
 */
router.get('/top-customers', authenticate, requireAdmin, [
  query('months').optional().isInt({ min: 1 }).toInt(),
  query('top').optional().isInt({ min: 1, max: 100 }).toInt(),
  validate
], reportController.getTopCustomers);

/**
 * @swagger
 * /reports/top-books:
 *   get:
 *     summary: Get top selling books (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 3
 *         description: Number of months to look back
 *       - in: query
 *         name: top
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top books to return
 *     responses:
 *       200:
 *         description: Top selling books report
 */
router.get('/top-books', authenticate, requireAdmin, [
  query('months').optional().isInt({ min: 1 }).toInt(),
  query('top').optional().isInt({ min: 1, max: 100 }).toInt(),
  validate
], reportController.getTopBooks);

/**
 * @swagger
 * /reports/book-reorders/{isbn}:
 *   get:
 *     summary: Get book reorder count (Admin only)
 *     tags: [Reports]
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
 *         description: Book reorder count
 *       404:
 *         description: Book not found
 */
router.get('/book-reorders/:isbn', authenticate, requireAdmin, [
  param('isbn').trim().notEmpty().withMessage('ISBN is required'),
  validate
], reportController.getBookReorders);

/**
 * @swagger
 * /reports/dashboard:
 *   get:
 *     summary: Get admin dashboard summary (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary with stats
 */
router.get('/dashboard', authenticate, requireAdmin, reportController.getDashboardSummary);

module.exports = router;
