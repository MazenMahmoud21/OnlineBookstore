const { getPool, sql } = require('../db/connection');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT CategoryID, CategoryName FROM Categories ORDER BY CategoryName');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT CategoryID, CategoryName FROM Categories WHERE CategoryID = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Get books in this category
    const booksResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT b.ISBN, b.Title, b.SellingPrice, b.QuantityInStock, p.Name AS PublisherName
        FROM Books b
        JOIN Publishers p ON b.PublisherID = p.PublisherID
        WHERE b.CategoryID = @id
      `);
    
    res.json({
      ...result.recordset[0],
      Books: booksResult.recordset
    });
  } catch (err) {
    console.error('Get category error:', err);
    res.status(500).json({ error: 'Failed to get category' });
  }
};

module.exports = {
  getCategories,
  getCategoryById
};
