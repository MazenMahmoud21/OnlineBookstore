const jwt = require('jsonwebtoken');
const config = require('../config');
const { getPool, sql } = require('../db/connection');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Get user from database
      const pool = await getPool();
      const result = await pool.request()
        .input('userId', sql.Int, decoded.userId)
        .query('SELECT UserID, Username, Role, Email, FirstName, LastName FROM Users WHERE UserID = @userId');
      
      if (result.recordset.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      req.user = result.recordset[0];
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.Role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireCustomer = (req, res, next) => {
  if (req.user.Role !== 'Customer') {
    return res.status(403).json({ error: 'Customer access required' });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireCustomer
};
