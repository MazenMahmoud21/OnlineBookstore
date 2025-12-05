const { getPool, sql } = require('../db/connection');

// Get all publishers
const getPublishers = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT PublisherID, Name, Address, Phone FROM Publishers ORDER BY Name');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Get publishers error:', err);
    res.status(500).json({ error: 'Failed to get publishers' });
  }
};

// Get publisher by ID
const getPublisherById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT PublisherID, Name, Address, Phone FROM Publishers WHERE PublisherID = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    
    // Get books by this publisher
    const booksResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT b.ISBN, b.Title, b.SellingPrice, b.QuantityInStock, c.CategoryName
        FROM Books b
        JOIN Categories c ON b.CategoryID = c.CategoryID
        WHERE b.PublisherID = @id
      `);
    
    res.json({
      ...result.recordset[0],
      Books: booksResult.recordset
    });
  } catch (err) {
    console.error('Get publisher error:', err);
    res.status(500).json({ error: 'Failed to get publisher' });
  }
};

// Create publisher (Admin only)
const createPublisher = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('address', sql.NVarChar, address || null)
      .input('phone', sql.NVarChar, phone || null)
      .query('INSERT INTO Publishers (Name, Address, Phone) OUTPUT INSERTED.PublisherID VALUES (@name, @address, @phone)');
    
    res.status(201).json({
      message: 'Publisher created successfully',
      publisherId: result.recordset[0].PublisherID
    });
  } catch (err) {
    console.error('Create publisher error:', err);
    res.status(500).json({ error: 'Failed to create publisher' });
  }
};

// Update publisher (Admin only)
const updatePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    const pool = await getPool();
    
    let updateFields = [];
    const request = pool.request().input('id', sql.Int, id);
    
    if (name) {
      updateFields.push('Name = @name');
      request.input('name', sql.NVarChar, name);
    }
    if (address !== undefined) {
      updateFields.push('Address = @address');
      request.input('address', sql.NVarChar, address);
    }
    if (phone !== undefined) {
      updateFields.push('Phone = @phone');
      request.input('phone', sql.NVarChar, phone);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const result = await request.query(`UPDATE Publishers SET ${updateFields.join(', ')} WHERE PublisherID = @id`);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    
    res.json({ message: 'Publisher updated successfully' });
  } catch (err) {
    console.error('Update publisher error:', err);
    res.status(500).json({ error: 'Failed to update publisher' });
  }
};

// Delete publisher (Admin only)
const deletePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    // Check if publisher has books
    const booksCheck = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT COUNT(*) AS count FROM Books WHERE PublisherID = @id');
    
    if (booksCheck.recordset[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete publisher with existing books' });
    }
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Publishers WHERE PublisherID = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    
    res.json({ message: 'Publisher deleted successfully' });
  } catch (err) {
    console.error('Delete publisher error:', err);
    res.status(500).json({ error: 'Failed to delete publisher' });
  }
};

module.exports = {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher
};
