const { getPool, sql } = require('../db/connection');

// Get customer orders (for customer) or all orders (for admin)
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const pool = await getPool();
    
    let query;
    let countQuery;
    const request = pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));
    
    if (req.user.Role === 'Admin') {
      // Admin sees all orders
      query = `
        SELECT 
          co.CustOrderID, co.OrderDate, co.TotalAmount, co.Status,
          co.CreditCardLast4, co.CreditCardExpiry,
          u.UserID, u.Username, u.FirstName, u.LastName, u.Email
        FROM CustomerOrders co
        JOIN Users u ON co.UserID = u.UserID
        ORDER BY co.OrderDate DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;
      countQuery = 'SELECT COUNT(*) AS total FROM CustomerOrders';
    } else {
      // Customer sees only their orders
      query = `
        SELECT 
          co.CustOrderID, co.OrderDate, co.TotalAmount, co.Status,
          co.CreditCardLast4, co.CreditCardExpiry
        FROM CustomerOrders co
        WHERE co.UserID = @userId
        ORDER BY co.OrderDate DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;
      countQuery = 'SELECT COUNT(*) AS total FROM CustomerOrders WHERE UserID = @userId';
      request.input('userId', sql.Int, req.user.UserID);
    }
    
    const result = await request.query(query);
    
    const countRequest = pool.request();
    if (req.user.Role !== 'Admin') {
      countRequest.input('userId', sql.Int, req.user.UserID);
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
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    // Get order
    const request = pool.request().input('orderId', sql.Int, id);
    
    let orderQuery = `
      SELECT 
        co.CustOrderID, co.OrderDate, co.TotalAmount, co.Status,
        co.CreditCardLast4, co.CreditCardExpiry,
        u.UserID, u.Username, u.FirstName, u.LastName, u.Email, u.ShippingAddress
      FROM CustomerOrders co
      JOIN Users u ON co.UserID = u.UserID
      WHERE co.CustOrderID = @orderId
    `;
    
    // If customer, ensure they can only see their own orders
    if (req.user.Role !== 'Admin') {
      orderQuery += ' AND co.UserID = @userId';
      request.input('userId', sql.Int, req.user.UserID);
    }
    
    const orderResult = await request.query(orderQuery);
    
    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get order items
    const itemsResult = await pool.request()
      .input('orderId', sql.Int, id)
      .query(`
        SELECT 
          coi.CustOrderItemID, coi.Quantity, coi.UnitPrice,
          (coi.Quantity * coi.UnitPrice) AS Subtotal,
          b.ISBN, b.Title,
          (SELECT STRING_AGG(a.Name, ', ') 
           FROM BookAuthors ba 
           JOIN Authors a ON ba.AuthorID = a.AuthorID 
           WHERE ba.ISBN = b.ISBN) AS Authors
        FROM CustomerOrderItems coi
        JOIN Books b ON coi.ISBN = b.ISBN
        WHERE coi.CustOrderID = @orderId
      `);
    
    res.json({
      ...orderResult.recordset[0],
      items: itemsResult.recordset
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

module.exports = {
  getOrders,
  getOrderById
};
