const { getPool, sql } = require('../db/connection');

// Get all publisher orders (Admin only)
const getPublisherOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const pool = await getPool();
    
    let query = `
      SELECT 
        po.PubOrderID, po.OrderDate, po.Status, po.TotalAmount,
        p.PublisherID, p.Name AS PublisherName, p.Address AS PublisherAddress, p.Phone AS PublisherPhone
      FROM PublisherOrders po
      JOIN Publishers p ON po.PublisherID = p.PublisherID
      WHERE 1=1
    `;
    
    const request = pool.request();
    
    if (status) {
      query += ' AND po.Status = @status';
      request.input('status', sql.NVarChar, status);
    }
    
    query += ` ORDER BY po.OrderDate DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, parseInt(limit));
    
    const result = await request.query(query);
    
    // Get count
    const countRequest = pool.request();
    let countQuery = 'SELECT COUNT(*) AS total FROM PublisherOrders WHERE 1=1';
    if (status) {
      countQuery += ' AND Status = @status';
      countRequest.input('status', sql.NVarChar, status);
    }
    const countResult = await countRequest.query(countQuery);
    
    res.json({
      orders: result.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit)
      }
    });
  } catch (err) {
    console.error('Get publisher orders error:', err);
    res.status(500).json({ error: 'Failed to get publisher orders' });
  }
};

// Get publisher order by ID
const getPublisherOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    // Get order
    const orderResult = await pool.request()
      .input('orderId', sql.Int, id)
      .query(`
        SELECT 
          po.PubOrderID, po.OrderDate, po.Status, po.TotalAmount,
          p.PublisherID, p.Name AS PublisherName, p.Address AS PublisherAddress, p.Phone AS PublisherPhone
        FROM PublisherOrders po
        JOIN Publishers p ON po.PublisherID = p.PublisherID
        WHERE po.PubOrderID = @orderId
      `);
    
    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Publisher order not found' });
    }
    
    // Get order items
    const itemsResult = await pool.request()
      .input('orderId', sql.Int, id)
      .query(`
        SELECT 
          poi.PubOrderItemID, poi.Quantity, poi.UnitPrice,
          (poi.Quantity * poi.UnitPrice) AS Subtotal,
          b.ISBN, b.Title, b.QuantityInStock, b.ReorderThreshold
        FROM PublisherOrderItems poi
        JOIN Books b ON poi.ISBN = b.ISBN
        WHERE poi.PubOrderID = @orderId
      `);
    
    res.json({
      ...orderResult.recordset[0],
      items: itemsResult.recordset
    });
  } catch (err) {
    console.error('Get publisher order error:', err);
    res.status(500).json({ error: 'Failed to get publisher order' });
  }
};

// Create publisher order manually (Admin only)
const createPublisherOrder = async (req, res) => {
  try {
    const { publisherId, items } = req.body;
    const pool = await getPool();
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const bookResult = await pool.request()
        .input('isbn', sql.NVarChar, item.isbn)
        .query('SELECT SellingPrice FROM Books WHERE ISBN = @isbn');
      
      if (bookResult.recordset.length === 0) {
        return res.status(400).json({ error: `Book ${item.isbn} not found` });
      }
      
      total += bookResult.recordset[0].SellingPrice * item.quantity;
    }
    
    // Create order
    const orderResult = await pool.request()
      .input('publisherId', sql.Int, publisherId)
      .input('total', sql.Decimal(12, 2), total)
      .query(`
        INSERT INTO PublisherOrders (PublisherID, Status, TotalAmount)
        OUTPUT INSERTED.PubOrderID
        VALUES (@publisherId, 'Pending', @total)
      `);
    
    const orderId = orderResult.recordset[0].PubOrderID;
    
    // Add items
    for (const item of items) {
      const bookResult = await pool.request()
        .input('isbn', sql.NVarChar, item.isbn)
        .query('SELECT SellingPrice FROM Books WHERE ISBN = @isbn');
      
      await pool.request()
        .input('orderId', sql.Int, orderId)
        .input('isbn', sql.NVarChar, item.isbn)
        .input('quantity', sql.Int, item.quantity)
        .input('unitPrice', sql.Decimal(10, 2), bookResult.recordset[0].SellingPrice)
        .query(`
          INSERT INTO PublisherOrderItems (PubOrderID, ISBN, Quantity, UnitPrice)
          VALUES (@orderId, @isbn, @quantity, @unitPrice)
        `);
    }
    
    res.status(201).json({
      message: 'Publisher order created',
      orderId,
      totalAmount: total
    });
  } catch (err) {
    console.error('Create publisher order error:', err);
    res.status(500).json({ error: 'Failed to create publisher order' });
  }
};

// Confirm publisher order (Admin only)
const confirmPublisherOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    // Call the ConfirmPublisherOrder stored procedure
    const result = await pool.request()
      .input('PubOrderID', sql.Int, id)
      .execute('ConfirmPublisherOrder');
    
    if (result.recordset && result.recordset.length > 0) {
      res.json({
        message: result.recordset[0].Message,
        orderId: result.recordset[0].OrderID
      });
    } else {
      res.json({ message: 'Order confirmed successfully', orderId: id });
    }
  } catch (err) {
    console.error('Confirm publisher order error:', err);
    
    if (err.message && err.message.includes('not found')) {
      return res.status(404).json({ error: 'Order not found or not in Pending status' });
    }
    
    res.status(500).json({ error: 'Failed to confirm publisher order' });
  }
};

// Cancel publisher order (Admin only)
const cancelPublisherOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('orderId', sql.Int, id)
      .query(`
        UPDATE PublisherOrders 
        SET Status = 'Cancelled' 
        WHERE PubOrderID = @orderId AND Status = 'Pending'
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Order not found or not in Pending status' });
    }
    
    res.json({ message: 'Order cancelled successfully', orderId: id });
  } catch (err) {
    console.error('Cancel publisher order error:', err);
    res.status(500).json({ error: 'Failed to cancel publisher order' });
  }
};

module.exports = {
  getPublisherOrders,
  getPublisherOrderById,
  createPublisherOrder,
  confirmPublisherOrder,
  cancelPublisherOrder
};
