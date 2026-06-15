require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize Express application
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Core middleware
app.use(cors());
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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Space News Hub server running on port ${PORT}`);
});
