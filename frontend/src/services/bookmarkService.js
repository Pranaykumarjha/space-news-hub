import api from './api';

/**
 * Fetches all bookmarks for the authenticated user.
 * 
 * @async
 * @function fetchBookmarks
 * @returns {Promise<Array>} Array of user's bookmark objects
 */
export const fetchBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data.data || [];
};

/**
 * Saves an article as a bookmark in the database.
 * 
 * @async
 * @function saveBookmark
 * @param {Object} articleData - Metadata of the article to save
 * @returns {Promise<Object>} The created bookmark object
 */
export const saveBookmark = async (articleData) => {
  const response = await api.post('/bookmarks', {
    articleId: String(articleData.id || articleData.articleId),
    title: articleData.title,
    summary: articleData.summary,
    image_url: articleData.image_url,
    url: articleData.url,
    published_at: articleData.published_at,
    news_site: articleData.news_site,
  });
  return response.data.data;
};

/**
 * Removes a bookmark from the database by its database ID (_id).
 * 
 * @async
 * @function removeBookmark
 * @param {string} id - The MongoDB ObjectId of the bookmark to delete
 * @returns {Promise<boolean>} True if successful
 */
export const removeBookmark = async (id) => {
  await api.delete(`/bookmarks/${id}`);
  return true;
};
