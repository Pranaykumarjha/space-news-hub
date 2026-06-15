const Bookmark = require('../models/Bookmark');

/**
 * @desc    Get all bookmarks for the authenticated user
 * @route   GET /api/bookmarks
 * @access  Private
 */
const getBookmarks = async (req, res, next) => {
  try {
    // Fetch all bookmarks belonging to the authenticated user and sort by newest first
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new bookmark for the authenticated user
 * @route   POST /api/bookmarks
 * @access  Private
 */
const addBookmark = async (req, res, next) => {
  try {
    const { 
      articleId, 
      title, 
      summary, 
      image_url, 
      url, 
      published_at, 
      news_site 
    } = req.body;

    // Validate required fields
    if (!articleId || !title) {
      res.status(400);
      return next(new Error('Article ID and Title are required.'));
    }

    // Check if duplicate bookmark already exists for this user
    const existingBookmark = await Bookmark.findOne({ 
      userId: req.user._id, 
      articleId: String(articleId) 
    });

    if (existingBookmark) {
      res.status(400);
      return next(new Error('Article is already bookmarked.'));
    }

    // Create new bookmark document
    const bookmark = await Bookmark.create({
      userId: req.user._id,
      articleId: String(articleId),
      title,
      summary,
      image_url,
      url,
      published_at,
      news_site,
    });

    res.status(201).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000) if concurrent requests pass check
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('Article is already bookmarked.'));
    }
    next(error);
  }
};

/**
 * @desc    Delete a bookmark by database ID
 * @route   DELETE /api/bookmarks/:id
 * @access  Private
 */
const deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    // Verify bookmark exists
    if (!bookmark) {
      res.status(404);
      return next(new Error('Bookmark not found.'));
    }

    // Validate ownership: user can only delete their own bookmarks
    if (bookmark.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this bookmark.'));
    }

    // Remove the bookmark
    await Bookmark.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  deleteBookmark,
};
