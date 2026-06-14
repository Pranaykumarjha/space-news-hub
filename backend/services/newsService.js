/**
 * NEWS SERVICE
 * 
 * This service layer handles all API calls to the Spaceflight News API.
 * It abstracts the external API interaction from the controller,
 * making the code more maintainable and testable.
 * 
 * API Flow:
 * Route (GET /api/news) -> Controller (getNews) -> Service (fetchSpaceflightNews) -> External API
 */

const axios = require('axios');

// External API configuration
const SPACEFLIGHT_NEWS_API_URL = 'https://api.spaceflightnewsapi.net/v4/articles/';

/**
 * Fetches spaceflight news articles from the Spaceflight News API
 * 
 * @async
 * @function fetchSpaceflightNews
 * @param {number} [limit=10] - Number of articles to fetch (default: 10)
 * @returns {Promise<Array>} Array of articles with filtered fields
 * @throws {Error} If API call fails or network error occurs
 * 
 * Usage:
 *   const articles = await fetchSpaceflightNews(20);
 */
async function fetchSpaceflightNews(limit = 10) {
  try {
    // Make HTTP GET request to Spaceflight News API
    const response = await axios.get(SPACEFLIGHT_NEWS_API_URL, {
      params: {
        limit: limit, // Limit the number of results
      },
      timeout: 5000, // 5 second timeout
    });

    // Extract articles from response
    const articles = response.data.results || [];

    // Transform and filter articles to only include required fields
    const filteredArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      image_url: article.image_url,
      url: article.url,
      published_at: article.published_at,
      news_site: article.news_site,
    }));

    return filteredArticles;
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error fetching from Spaceflight News API:', error.message);

    // Re-throw error with custom message for controller to handle
    throw new Error(
      `Failed to fetch spaceflight news: ${error.message}`
    );
  }
}

module.exports = {
  fetchSpaceflightNews,
};
