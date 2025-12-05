const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { getPool, sql } = require('../db/connection');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  
  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
  
  return { accessToken, refreshToken };
};

const signup = async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, phone, shippingAddress } = req.body;
    
    const pool = await getPool();
    
    // Check if username or email already exists
    const existingUser = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .query('SELECT UserID FROM Users WHERE Username = @username OR Email = @email');
    
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('role', sql.NVarChar, 'Customer')
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone || null)
      .input('shippingAddress', sql.NVarChar, shippingAddress || null)
      .query(`
        INSERT INTO Users (Username, PasswordHash, Role, FirstName, LastName, Email, Phone, ShippingAddress)
        OUTPUT INSERTED.UserID
        VALUES (@username, @passwordHash, @role, @firstName, @lastName, @email, @phone, @shippingAddress)
      `);
    
    const userId = result.recordset[0].UserID;
    
    // Create shopping cart for the new user
    await pool.request()
      .input('userId', sql.Int, userId)
      .query('INSERT INTO ShoppingCarts (UserID) VALUES (@userId)');
    
    // Generate tokens
    const tokens = generateTokens(userId, 'Customer');
    
    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('token', sql.NVarChar, tokens.refreshToken)
      .input('expiresAt', sql.DateTime, expiresAt)
      .query('INSERT INTO RefreshTokens (UserID, Token, ExpiresAt) VALUES (@userId, @token, @expiresAt)');
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        userId,
        username,
        email,
        role: 'Customer'
      },
      ...tokens
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const pool = await getPool();
    
    // Get user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT UserID, Username, PasswordHash, Role, Email, FirstName, LastName FROM Users WHERE Username = @username');
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.recordset[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const tokens = generateTokens(user.UserID, user.Role);
    
    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await pool.request()
      .input('userId', sql.Int, user.UserID)
      .input('token', sql.NVarChar, tokens.refreshToken)
      .input('expiresAt', sql.DateTime, expiresAt)
      .query('INSERT INTO RefreshTokens (UserID, Token, ExpiresAt) VALUES (@userId, @token, @expiresAt)');
    
    res.json({
      message: 'Login successful',
      user: {
        userId: user.UserID,
        username: user.Username,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.Role
      },
      ...tokens
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    const pool = await getPool();
    
    // Check if token exists and is not revoked
    const tokenResult = await pool.request()
      .input('userId', sql.Int, decoded.userId)
      .input('token', sql.NVarChar, refreshToken)
      .query('SELECT TokenID FROM RefreshTokens WHERE UserID = @userId AND Token = @token AND IsRevoked = 0 AND ExpiresAt > GETDATE()');
    
    if (tokenResult.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    
    // Get user role
    const userResult = await pool.request()
      .input('userId', sql.Int, decoded.userId)
      .query('SELECT Role FROM Users WHERE UserID = @userId');
    
    if (userResult.recordset.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Revoke old refresh token
    await pool.request()
      .input('token', sql.NVarChar, refreshToken)
      .query('UPDATE RefreshTokens SET IsRevoked = 1 WHERE Token = @token');
    
    // Generate new tokens
    const tokens = generateTokens(decoded.userId, userResult.recordset[0].Role);
    
    // Store new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await pool.request()
      .input('userId', sql.Int, decoded.userId)
      .input('token', sql.NVarChar, tokens.refreshToken)
      .input('expiresAt', sql.DateTime, expiresAt)
      .query('INSERT INTO RefreshTokens (UserID, Token, ExpiresAt) VALUES (@userId, @token, @expiresAt)');
    
    res.json(tokens);
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      const pool = await getPool();
      await pool.request()
        .input('token', sql.NVarChar, refreshToken)
        .query('UPDATE RefreshTokens SET IsRevoked = 1 WHERE Token = @token');
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout
};
