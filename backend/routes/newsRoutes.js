/**
 * NEWS ROUTES
 * 
 * This router module defines all news-related endpoints.
 * Routes are organized separately for better code maintainability.
 * 
 * API Flow:
 * Route (GET /api/news) -> Controller (getNews) -> Service (fetchSpaceflightNews) -> External API
 */

const express = require('express');
const { getNews } = require('../controllers/newsController');

// Create router instance
const router = express.Router();

/**
 * GET /api/news
 * 
 * Fetches spaceflight news articles from the Spaceflight News API.
 * 
 * Query Parameters:
 *   - limit (optional): Number of articles to fetch (default: 10, max: 100)
 * 
 * Example:
 *   GET /api/news?limit=20
 * 
 * Returns:
 *   - 200: Array of articles with id, title, summary, image_url, url, published_at, news_site
 *   - 400: Invalid query parameters
 *   - 500: Server error or external API failure
 */
router.get('/', getNews);

module.exports = router;
