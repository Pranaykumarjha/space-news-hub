/**
 * NEWS CONTROLLER
 * 
 * This controller handles incoming HTTP requests related to news.
 * It acts as a bridge between the routes and the service layer.
 * 
 * API Flow:
 * Route (GET /api/news) -> Controller (getNews) -> Service (fetchSpaceflightNews) -> External API
 */

const { fetchSpaceflightNews } = require('../services/newsService');

/**
 * Handles GET /api/news request
 * 
 * Fetches spaceflight news articles and returns them to the client.
 * Includes comprehensive error handling for various failure scenarios.
 * 
 * @async
 * @function getNews
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.limit=10] - Number of articles to fetch
 * @param {Object} res - Express response object
 * @returns {void} Sends JSON response with articles or error message
 * 
 * Success Response (200):
 *   {
 *     "success": true,
 *     "data": [
 *       {
 *         "id": 1,
 *         "title": "Article Title",
 *         "summary": "Article summary",
 *         "image_url": "https://...",
 *         "url": "https://...",
 *         "published_at": "2024-01-01T12:00:00Z",
 *         "news_site": "News Site Name"
 *       }
 *     ]
 *   }
 * 
 * Error Response (500):
 *   {
 *     "success": false,
 *     "message": "Error message"
 *   }
 */
async function getNews(req, res) {
  try {
    // Extract limit from query parameters (default to 10)
    const limit = parseInt(req.query.limit) || 10;

    // Validate limit parameter
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Call service to fetch news from external API
    const articles = await fetchSpaceflightNews(limit);

    // Send successful response with filtered articles
    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    // Log error for debugging
    console.error('News Controller Error:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch spaceflight news',
    });
  }
}

module.exports = {
  getNews,
};
