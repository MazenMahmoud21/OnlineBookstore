const { getPool, sql } = require('../db/connection');

// Get all books with search/filter
const getBooks = async (req, res) => {
  try {
    const { q, category, author, publisher, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const pool = await getPool();
    let query = `
      SELECT DISTINCT
        b.ISBN, b.Title, b.PublicationYear, b.SellingPrice,
        b.QuantityInStock, b.ReorderThreshold,
        p.PublisherID, p.Name AS PublisherName,
        c.CategoryID, c.CategoryName,
        (SELECT STRING_AGG(a.Name, ', ') 
         FROM BookAuthors ba 
         JOIN Authors a ON ba.AuthorID = a.AuthorID 
         WHERE ba.ISBN = b.ISBN) AS Authors
      FROM Books b
      JOIN Publishers p ON b.PublisherID = p.PublisherID
      JOIN Categories c ON b.CategoryID = c.CategoryID
      LEFT JOIN BookAuthors ba ON b.ISBN = ba.ISBN
      LEFT JOIN Authors a ON ba.AuthorID = a.AuthorID
      WHERE 1=1
    `;
    
    const request = pool.request();
    
    if (q) {
      query += ` AND (b.Title LIKE @search OR b.ISBN LIKE @search)`;
      request.input('search', sql.NVarChar, `%${q}%`);
    }
    
    if (category) {
      query += ` AND c.CategoryName = @category`;
      request.input('category', sql.NVarChar, category);
    }
    
    if (author) {
      query += ` AND a.Name LIKE @author`;
      request.input('author', sql.NVarChar, `%${author}%`);
    }
    
    if (publisher) {
      query += ` AND p.Name LIKE @publisher`;
      request.input('publisher', sql.NVarChar, `%${publisher}%`);
    }
    
    // Count total
    const countQuery = query.replace('SELECT DISTINCT', 'SELECT COUNT(DISTINCT b.ISBN) AS total FROM (SELECT b.ISBN');
    const countResult = await pool.request()
      .input('search', sql.NVarChar, q ? `%${q}%` : '')
      .input('category', sql.NVarChar, category || '')
      .input('author', sql.NVarChar, author ? `%${author}%` : '')
      .input('publisher', sql.NVarChar, publisher ? `%${publisher}%` : '')
      .query(`
        SELECT COUNT(DISTINCT b.ISBN) AS total
        FROM Books b
        JOIN Publishers p ON b.PublisherID = p.PublisherID
        JOIN Categories c ON b.CategoryID = c.CategoryID
        LEFT JOIN BookAuthors ba ON b.ISBN = ba.ISBN
        LEFT JOIN Authors a ON ba.AuthorID = a.AuthorID
        WHERE 1=1
        ${q ? `AND (b.Title LIKE @search OR b.ISBN LIKE @search)` : ''}
        ${category ? `AND c.CategoryName = @category` : ''}
        ${author ? `AND a.Name LIKE @author` : ''}
        ${publisher ? `AND p.Name LIKE @publisher` : ''}
      `);
    
    // Add pagination
    query += ` ORDER BY b.Title OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, parseInt(limit));
    
    const result = await request.query(query);
    
    res.json({
      books: result.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit)
      }
    });
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ error: 'Failed to get books' });
  }
};

// Get book by ISBN
const getBookByISBN = async (req, res) => {
  try {
    const { isbn } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .query(`
        SELECT 
          b.ISBN, b.Title, b.PublicationYear, b.SellingPrice,
          b.QuantityInStock, b.ReorderThreshold,
          p.PublisherID, p.Name AS PublisherName, p.Address AS PublisherAddress, p.Phone AS PublisherPhone,
          c.CategoryID, c.CategoryName
        FROM Books b
        JOIN Publishers p ON b.PublisherID = p.PublisherID
        JOIN Categories c ON b.CategoryID = c.CategoryID
        WHERE b.ISBN = @isbn
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Get authors
    const authorsResult = await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .query(`
        SELECT a.AuthorID, a.Name
        FROM Authors a
        JOIN BookAuthors ba ON a.AuthorID = ba.AuthorID
        WHERE ba.ISBN = @isbn
      `);
    
    const book = result.recordset[0];
    book.Authors = authorsResult.recordset;
    book.InStock = book.QuantityInStock > 0;
    
    res.json(book);
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ error: 'Failed to get book' });
  }
};

// Create new book (Admin only)
const createBook = async (req, res) => {
  try {
    const { isbn, title, publisherId, publicationYear, sellingPrice, categoryId, quantityInStock, reorderThreshold, authorIds } = req.body;
    
    const pool = await getPool();
    
    // Check if ISBN already exists
    const existing = await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .query('SELECT ISBN FROM Books WHERE ISBN = @isbn');
    
    if (existing.recordset.length > 0) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }
    
    // Insert book
    await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .input('title', sql.NVarChar, title)
      .input('publisherId', sql.Int, publisherId)
      .input('publicationYear', sql.Int, publicationYear)
      .input('sellingPrice', sql.Decimal(10, 2), sellingPrice)
      .input('categoryId', sql.Int, categoryId)
      .input('quantityInStock', sql.Int, quantityInStock || 0)
      .input('reorderThreshold', sql.Int, reorderThreshold || 10)
      .query(`
        INSERT INTO Books (ISBN, Title, PublisherID, PublicationYear, SellingPrice, CategoryID, QuantityInStock, ReorderThreshold)
        VALUES (@isbn, @title, @publisherId, @publicationYear, @sellingPrice, @categoryId, @quantityInStock, @reorderThreshold)
      `);
    
    // Add authors if provided
    if (authorIds && authorIds.length > 0) {
      for (const authorId of authorIds) {
        await pool.request()
          .input('isbn', sql.NVarChar, isbn)
          .input('authorId', sql.Int, authorId)
          .query('INSERT INTO BookAuthors (ISBN, AuthorID) VALUES (@isbn, @authorId)');
      }
    }
    
    res.status(201).json({ message: 'Book created successfully', isbn });
  } catch (err) {
    console.error('Create book error:', err);
    res.status(500).json({ error: 'Failed to create book' });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  try {
    const { isbn } = req.params;
    const { title, publisherId, publicationYear, sellingPrice, categoryId, quantityInStock, reorderThreshold, authorIds } = req.body;
    
    const pool = await getPool();
    
    // Check if book exists
    const existing = await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .query('SELECT ISBN FROM Books WHERE ISBN = @isbn');
    
    if (existing.recordset.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Build update query
    let updateFields = [];
    const request = pool.request().input('isbn', sql.NVarChar, isbn);
    
    if (title) {
      updateFields.push('Title = @title');
      request.input('title', sql.NVarChar, title);
    }
    if (publisherId) {
      updateFields.push('PublisherID = @publisherId');
      request.input('publisherId', sql.Int, publisherId);
    }
    if (publicationYear) {
      updateFields.push('PublicationYear = @publicationYear');
      request.input('publicationYear', sql.Int, publicationYear);
    }
    if (sellingPrice !== undefined) {
      updateFields.push('SellingPrice = @sellingPrice');
      request.input('sellingPrice', sql.Decimal(10, 2), sellingPrice);
    }
    if (categoryId) {
      updateFields.push('CategoryID = @categoryId');
      request.input('categoryId', sql.Int, categoryId);
    }
    if (quantityInStock !== undefined) {
      updateFields.push('QuantityInStock = @quantityInStock');
      request.input('quantityInStock', sql.Int, quantityInStock);
    }
    if (reorderThreshold !== undefined) {
      updateFields.push('ReorderThreshold = @reorderThreshold');
      request.input('reorderThreshold', sql.Int, reorderThreshold);
    }
    
    if (updateFields.length > 0) {
      await request.query(`UPDATE Books SET ${updateFields.join(', ')} WHERE ISBN = @isbn`);
    }
    
    // Update authors if provided
    if (authorIds !== undefined) {
      await pool.request()
        .input('isbn', sql.NVarChar, isbn)
        .query('DELETE FROM BookAuthors WHERE ISBN = @isbn');
      
      for (const authorId of authorIds) {
        await pool.request()
          .input('isbn', sql.NVarChar, isbn)
          .input('authorId', sql.Int, authorId)
          .query('INSERT INTO BookAuthors (ISBN, AuthorID) VALUES (@isbn, @authorId)');
      }
    }
    
    res.json({ message: 'Book updated successfully', isbn });
  } catch (err) {
    console.error('Update book error:', err);
    if (err.message && err.message.includes('negative')) {
      return res.status(400).json({ error: 'Cannot reduce stock below zero' });
    }
    res.status(500).json({ error: 'Failed to update book' });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const { isbn } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .query('DELETE FROM Books WHERE ISBN = @isbn');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

module.exports = {
  getBooks,
  getBookByISBN,
  createBook,
  updateBook,
  deleteBook
};
