const { getPool, sql } = require('../db/connection');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const pool = await getPool();
    
    // Get or create cart for user
    let cartResult = await pool.request()
      .input('userId', sql.Int, req.user.UserID)
      .query('SELECT CartID FROM ShoppingCarts WHERE UserID = @userId');
    
    if (cartResult.recordset.length === 0) {
      // Create cart if doesn't exist
      cartResult = await pool.request()
        .input('userId', sql.Int, req.user.UserID)
        .query('INSERT INTO ShoppingCarts (UserID) OUTPUT INSERTED.CartID VALUES (@userId)');
    }
    
    const cartId = cartResult.recordset[0].CartID;
    
    // Get cart items with book details
    const itemsResult = await pool.request()
      .input('cartId', sql.Int, cartId)
      .query(`
        SELECT 
          ci.CartItemID, ci.Quantity,
          b.ISBN, b.Title, b.SellingPrice, b.QuantityInStock,
          (ci.Quantity * b.SellingPrice) AS Subtotal,
          (SELECT STRING_AGG(a.Name, ', ') 
           FROM BookAuthors ba 
           JOIN Authors a ON ba.AuthorID = a.AuthorID 
           WHERE ba.ISBN = b.ISBN) AS Authors
        FROM CartItems ci
        JOIN Books b ON ci.ISBN = b.ISBN
        WHERE ci.CartID = @cartId
      `);
    
    // Calculate total
    const total = itemsResult.recordset.reduce((sum, item) => sum + parseFloat(item.Subtotal), 0);
    
    res.json({
      cartId,
      items: itemsResult.recordset,
      total: total.toFixed(2),
      itemCount: itemsResult.recordset.length
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

// Add/Update item in cart
const addToCart = async (req, res) => {
  try {
    const { isbn, quantity } = req.body;
    const pool = await getPool();
    
    // Validate book exists and has stock
    const bookResult = await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .query('SELECT ISBN, Title, QuantityInStock, SellingPrice FROM Books WHERE ISBN = @isbn');
    
    if (bookResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const book = bookResult.recordset[0];
    
    if (book.QuantityInStock < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock', 
        available: book.QuantityInStock 
      });
    }
    
    // Get or create cart
    let cartResult = await pool.request()
      .input('userId', sql.Int, req.user.UserID)
      .query('SELECT CartID FROM ShoppingCarts WHERE UserID = @userId');
    
    if (cartResult.recordset.length === 0) {
      cartResult = await pool.request()
        .input('userId', sql.Int, req.user.UserID)
        .query('INSERT INTO ShoppingCarts (UserID) OUTPUT INSERTED.CartID VALUES (@userId)');
    }
    
    const cartId = cartResult.recordset[0].CartID;
    
    // Check if item already in cart
    const existingItem = await pool.request()
      .input('cartId', sql.Int, cartId)
      .input('isbn', sql.NVarChar, isbn)
      .query('SELECT CartItemID, Quantity FROM CartItems WHERE CartID = @cartId AND ISBN = @isbn');
    
    if (existingItem.recordset.length > 0) {
      // Update quantity
      const newQuantity = existingItem.recordset[0].Quantity + quantity;
      
      if (book.QuantityInStock < newQuantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock for requested quantity', 
          available: book.QuantityInStock,
          currentInCart: existingItem.recordset[0].Quantity
        });
      }
      
      await pool.request()
        .input('cartItemId', sql.Int, existingItem.recordset[0].CartItemID)
        .input('quantity', sql.Int, newQuantity)
        .query('UPDATE CartItems SET Quantity = @quantity WHERE CartItemID = @cartItemId');
      
      res.json({ message: 'Cart updated', isbn, quantity: newQuantity });
    } else {
      // Add new item
      await pool.request()
        .input('cartId', sql.Int, cartId)
        .input('isbn', sql.NVarChar, isbn)
        .input('quantity', sql.Int, quantity)
        .query('INSERT INTO CartItems (CartID, ISBN, Quantity) VALUES (@cartId, @isbn, @quantity)');
      
      res.status(201).json({ message: 'Item added to cart', isbn, quantity });
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const pool = await getPool();
    
    // Get the cart item and verify ownership
    const itemResult = await pool.request()
      .input('itemId', sql.Int, itemId)
      .input('userId', sql.Int, req.user.UserID)
      .query(`
        SELECT ci.CartItemID, ci.ISBN, b.QuantityInStock
        FROM CartItems ci
        JOIN ShoppingCarts sc ON ci.CartID = sc.CartID
        JOIN Books b ON ci.ISBN = b.ISBN
        WHERE ci.CartItemID = @itemId AND sc.UserID = @userId
      `);
    
    if (itemResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    if (quantity > itemResult.recordset[0].QuantityInStock) {
      return res.status(400).json({ 
        error: 'Insufficient stock', 
        available: itemResult.recordset[0].QuantityInStock 
      });
    }
    
    if (quantity <= 0) {
      // Remove item
      await pool.request()
        .input('itemId', sql.Int, itemId)
        .query('DELETE FROM CartItems WHERE CartItemID = @itemId');
      
      return res.json({ message: 'Item removed from cart' });
    }
    
    // Update quantity
    await pool.request()
      .input('itemId', sql.Int, itemId)
      .input('quantity', sql.Int, quantity)
      .query('UPDATE CartItems SET Quantity = @quantity WHERE CartItemID = @itemId');
    
    res.json({ message: 'Cart updated', itemId, quantity });
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const pool = await getPool();
    
    // Verify ownership and delete
    const result = await pool.request()
      .input('itemId', sql.Int, itemId)
      .input('userId', sql.Int, req.user.UserID)
      .query(`
        DELETE ci
        FROM CartItems ci
        JOIN ShoppingCarts sc ON ci.CartID = sc.CartID
        WHERE ci.CartItemID = @itemId AND sc.UserID = @userId
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Checkout
const checkout = async (req, res) => {
  try {
    const { cardNumber, expiry } = req.body;
    const pool = await getPool();
    
    // Call the CheckoutCart stored procedure
    const result = await pool.request()
      .input('UserID', sql.Int, req.user.UserID)
      .input('CardNumber', sql.NVarChar, cardNumber)
      .input('CardExpiry', sql.Date, new Date(expiry))
      .execute('CheckoutCart');
    
    if (result.recordset && result.recordset.length > 0) {
      res.json({
        message: result.recordset[0].Message,
        orderId: result.recordset[0].OrderID,
        totalAmount: result.recordset[0].TotalAmount
      });
    } else {
      res.json({ message: 'Checkout completed' });
    }
  } catch (err) {
    console.error('Checkout error:', err);
    
    // Handle specific error messages from stored procedure
    if (err.message) {
      if (err.message.includes('expired')) {
        return res.status(400).json({ error: 'Credit card has expired' });
      }
      if (err.message.includes('empty')) {
        return res.status(400).json({ error: 'Shopping cart is empty' });
      }
      if (err.message.includes('Insufficient')) {
        return res.status(400).json({ error: 'Insufficient stock for one or more items' });
      }
      if (err.message.includes('not found')) {
        return res.status(400).json({ error: 'Shopping cart not found' });
      }
    }
    
    res.status(500).json({ error: 'Checkout failed' });
  }
};

// Clear cart (on logout or manual clear)
const clearCart = async (req, res) => {
  try {
    const pool = await getPool();
    
    await pool.request()
      .input('userId', sql.Int, req.user.UserID)
      .query(`
        DELETE ci
        FROM CartItems ci
        JOIN ShoppingCarts sc ON ci.CartID = sc.CartID
        WHERE sc.UserID = @userId
      `);
    
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
  clearCart
};
