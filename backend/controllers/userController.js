const bcrypt = require('bcryptjs');
const { getPool, sql } = require('../db/connection');

const getMe = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', sql.Int, req.user.UserID)
      .query(`
        SELECT 
          UserID, Username, Role, FirstName, LastName, 
          Email, Phone, ShippingAddress, CreatedAt
        FROM Users 
        WHERE UserID = @userId
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user details' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, shippingAddress, currentPassword, newPassword } = req.body;
    const pool = await getPool();
    
    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required to change password' });
      }
      
      const userResult = await pool.request()
        .input('userId', sql.Int, req.user.UserID)
        .query('SELECT PasswordHash FROM Users WHERE UserID = @userId');
      
      const isValid = await bcrypt.compare(currentPassword, userResult.recordset[0].PasswordHash);
      if (!isValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }
    
    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await pool.request()
        .input('email', sql.NVarChar, email)
        .input('userId', sql.Int, req.user.UserID)
        .query('SELECT UserID FROM Users WHERE Email = @email AND UserID != @userId');
      
      if (emailCheck.recordset.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    // Build update query
    let updateFields = [];
    const request = pool.request().input('userId', sql.Int, req.user.UserID);
    
    if (firstName) {
      updateFields.push('FirstName = @firstName');
      request.input('firstName', sql.NVarChar, firstName);
    }
    if (lastName) {
      updateFields.push('LastName = @lastName');
      request.input('lastName', sql.NVarChar, lastName);
    }
    if (email) {
      updateFields.push('Email = @email');
      request.input('email', sql.NVarChar, email);
    }
    if (phone !== undefined) {
      updateFields.push('Phone = @phone');
      request.input('phone', sql.NVarChar, phone);
    }
    if (shippingAddress !== undefined) {
      updateFields.push('ShippingAddress = @shippingAddress');
      request.input('shippingAddress', sql.NVarChar, shippingAddress);
    }
    if (newPassword) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      updateFields.push('PasswordHash = @passwordHash');
      request.input('passwordHash', sql.NVarChar, passwordHash);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    await request.query(`UPDATE Users SET ${updateFields.join(', ')} WHERE UserID = @userId`);
    
    // Return updated user
    const result = await pool.request()
      .input('userId', sql.Int, req.user.UserID)
      .query(`
        SELECT 
          UserID, Username, Role, FirstName, LastName, 
          Email, Phone, ShippingAddress, CreatedAt
        FROM Users 
        WHERE UserID = @userId
      `);
    
    res.json({
      message: 'Profile updated successfully',
      user: result.recordset[0]
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  getMe,
  updateMe
};
