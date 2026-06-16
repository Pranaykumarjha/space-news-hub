require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      console.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
}

// Initialize Express application
const app = express();

// Connect to MongoDB Atlas
connectDB();

const LOCAL_DEV_ORIGIN = 'http://localhost:5173';

/**
 * Normalize origin URLs from FRONTEND_URL (strip trailing slashes).
 */
const normalizeOrigin = (url) => url.trim().replace(/\/+$/, '');

/**
 * CORS configuration for development and production.
 * Origins are read from FRONTEND_URL (comma-separated).
 * Localhost is always allowed for development workflows.
 */
const getAllowedOrigins = () => {
  const origins = new Set();

  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',')
      .map(normalizeOrigin)
      .filter(Boolean)
      .forEach((url) => origins.add(url));
  }

  origins.add(LOCAL_DEV_ORIGIN);

  return [...origins];
};

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests and tools like Postman
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const allowedOrigins = getAllowedOrigins();

    // Allow all origins during local development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Core middleware — CORS must run before routes and body parsers
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Space News Hub API is running',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// 404 and global error handlers (must be registered after routes)
app.use(notFound);
app.use(errorHandler);

// Production-ready process-level error handling
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 for Render and other cloud hosts
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Space News Hub server running on port ${PORT}`);
});

// Graceful shutdown for production deployments
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
