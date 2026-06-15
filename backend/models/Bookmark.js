const mongoose = require('mongoose');

/**
 * Bookmark schema for Space News Hub.
 * Stores references to articles saved by users.
 */
const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    articleId: {
      type: String,
      required: [true, 'Article ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    published_at: {
      type: String,
      trim: true,
    },
    news_site: {
      type: String,
      trim: true,
    },
  },
  {
    // Enable automatic createdAt field. Explicitly disable updatedAt as it is not needed.
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

// Prevent duplicate bookmarks for the same user and article at the database level
bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
