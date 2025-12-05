const { getPool, sql } = require('../db/connection');

// Get total sales for previous month
const getSalesPreviousMonth = async (req, res) => {
  try {
    const pool = await getPool();
    
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    
    const result = await pool.request()
      .input('year', sql.Int, year)
      .input('month', sql.Int, lastMonth)
      .execute('GetTotalSalesByMonth');
    
    res.json(result.recordset[0] || { Year: year, Month: lastMonth, TotalSales: 0, NumberOfOrders: 0 });
  } catch (err) {
    console.error('Get sales previous month error:', err);
    res.status(500).json({ error: 'Failed to get sales report' });
  }
};

// Get total sales by date
const getSalesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    
    const pool = await getPool();
    
    const result = await pool.request()
      .input('Date', sql.Date, new Date(date))
      .execute('GetTotalSalesByDate');
    
    res.json(result.recordset[0] || { Date: date, TotalSales: 0, NumberOfOrders: 0 });
  } catch (err) {
    console.error('Get sales by date error:', err);
    res.status(500).json({ error: 'Failed to get sales report' });
  }
};

// Get top customers
const getTopCustomers = async (req, res) => {
  try {
    const { months = 3, top = 5 } = req.query;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('Months', sql.Int, parseInt(months))
      .input('TopN', sql.Int, parseInt(top))
      .execute('GetTopCustomers');
    
    res.json({
      months: parseInt(months),
      topN: parseInt(top),
      customers: result.recordset
    });
  } catch (err) {
    console.error('Get top customers error:', err);
    res.status(500).json({ error: 'Failed to get top customers report' });
  }
};

// Get top selling books
const getTopBooks = async (req, res) => {
  try {
    const { months = 3, top = 10 } = req.query;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('Months', sql.Int, parseInt(months))
      .input('TopN', sql.Int, parseInt(top))
      .execute('GetTopSellingBooks');
    
    res.json({
      months: parseInt(months),
      topN: parseInt(top),
      books: result.recordset
    });
  } catch (err) {
    console.error('Get top books error:', err);
    res.status(500).json({ error: 'Failed to get top books report' });
  }
};

// Get book reorder count
const getBookReorders = async (req, res) => {
  try {
    const { isbn } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('ISBN', sql.NVarChar, isbn)
      .execute('GetTimesBookReordered');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Get book reorders error:', err);
    res.status(500).json({ error: 'Failed to get book reorder count' });
  }
};

// Dashboard summary for admin
const getDashboardSummary = async (req, res) => {
  try {
    const pool = await getPool();
    
    // Get various stats
    const stats = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Books) AS TotalBooks,
        (SELECT COUNT(*) FROM Users WHERE Role = 'Customer') AS TotalCustomers,
        (SELECT COUNT(*) FROM CustomerOrders) AS TotalOrders,
        (SELECT ISNULL(SUM(TotalAmount), 0) FROM CustomerOrders) AS TotalRevenue,
        (SELECT COUNT(*) FROM PublisherOrders WHERE Status = 'Pending') AS PendingPublisherOrders,
        (SELECT COUNT(*) FROM Books WHERE QuantityInStock < ReorderThreshold) AS LowStockBooks
    `);
    
    // Get recent orders
    const recentOrders = await pool.request().query(`
      SELECT TOP 5
        co.CustOrderID, co.OrderDate, co.TotalAmount, co.Status,
        u.Username, u.FirstName, u.LastName
      FROM CustomerOrders co
      JOIN Users u ON co.UserID = u.UserID
      ORDER BY co.OrderDate DESC
    `);
    
    // Get low stock books
    const lowStockBooks = await pool.request().query(`
      SELECT TOP 5
        b.ISBN, b.Title, b.QuantityInStock, b.ReorderThreshold,
        p.Name AS PublisherName
      FROM Books b
      JOIN Publishers p ON b.PublisherID = p.PublisherID
      WHERE b.QuantityInStock < b.ReorderThreshold
      ORDER BY b.QuantityInStock ASC
    `);
    
    res.json({
      stats: stats.recordset[0],
      recentOrders: recentOrders.recordset,
      lowStockBooks: lowStockBooks.recordset
    });
  } catch (err) {
    console.error('Get dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to get dashboard summary' });
  }
};

module.exports = {
  getSalesPreviousMonth,
  getSalesByDate,
  getTopCustomers,
  getTopBooks,
  getBookReorders,
  getDashboardSummary
};
