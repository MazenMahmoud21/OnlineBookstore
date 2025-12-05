const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./config');
const { getPool } = require('./db/connection');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const publisherRoutes = require('./routes/publishers');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const publisherOrderRoutes = require('./routes/publisherOrders');
const reportRoutes = require('./routes/reports');
const categoryRoutes = require('./routes/categories');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Bookstore API',
      version: '1.0.0',
      description: 'API for Online Bookstore Order Processing System',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/authors', authorRoutes);
app.use('/api/v1/publishers', publisherRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/publisher-orders', publisherOrderRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ 
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message 
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await getPool();
    console.log('Database connected successfully');
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`API Documentation: http://localhost:${config.port}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
