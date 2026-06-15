const express = require('express');
const router = express.Router();
const { 
  getBookmarks, 
  addBookmark, 
  deleteBookmark 
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

// Protect all bookmark routes using the JWT authentication middleware
router.use(protect);

// Routes configuration
router.route('/')
  .get(getBookmarks)   // GET /api/bookmarks - Retrieve user's bookmarks
  .post(addBookmark);  // POST /api/bookmarks - Bookmark an article

router.route('/:id')
  .delete(deleteBookmark); // DELETE /api/bookmarks/:id - Remove a bookmark by ID

module.exports = router;
