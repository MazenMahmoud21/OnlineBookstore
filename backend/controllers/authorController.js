const { getPool, sql } = require('../db/connection');

// Get all authors
const getAuthors = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT AuthorID, Name FROM Authors ORDER BY Name');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Get authors error:', err);
    res.status(500).json({ error: 'Failed to get authors' });
  }
};

// Get author by ID
const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT AuthorID, Name FROM Authors WHERE AuthorID = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    // Get books by this author
    const booksResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT b.ISBN, b.Title, b.SellingPrice, c.CategoryName
        FROM Books b
        JOIN BookAuthors ba ON b.ISBN = ba.ISBN
        JOIN Categories c ON b.CategoryID = c.CategoryID
        WHERE ba.AuthorID = @id
      `);
    
    res.json({
      ...result.recordset[0],
      Books: booksResult.recordset
    });
  } catch (err) {
    console.error('Get author error:', err);
    res.status(500).json({ error: 'Failed to get author' });
  }
};

// Create author (Admin only)
const createAuthor = async (req, res) => {
  try {
    const { name } = req.body;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .query('INSERT INTO Authors (Name) OUTPUT INSERTED.AuthorID VALUES (@name)');
    
    res.status(201).json({
      message: 'Author created successfully',
      authorId: result.recordset[0].AuthorID
    });
  } catch (err) {
    console.error('Create author error:', err);
    res.status(500).json({ error: 'Failed to create author' });
  }
};

// Update author (Admin only)
const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .query('UPDATE Authors SET Name = @name WHERE AuthorID = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.json({ message: 'Author updated successfully' });
  } catch (err) {
    console.error('Update author error:', err);
    res.status(500).json({ error: 'Failed to update author' });
  }
};

// Delete author (Admin only)
const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Authors WHERE AuthorID = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    console.error('Delete author error:', err);
    res.status(500).json({ error: 'Failed to delete author' });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
