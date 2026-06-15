import { motion } from 'framer-motion';
import { X, Calendar, Globe, Bookmark, ExternalLink, ShieldCheck } from 'lucide-react';

const ArticleModal = ({ article, isOpen, onClose, isBookmarked, onToggleBookmark, formatDate }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div 
        className="glass-modal-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Anchor */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Hero Image */}
        {article.image_url && (
          <div className="modal-image-wrapper">
            <img 
              src={article.image_url} 
              alt={article.title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
              }}
            />
            <div className="modal-image-overlay"></div>
            
            {/* Overlay badge */}
            <div className="modal-headline-badge">
              <ShieldCheck size={14} />
              <span>CLASSIFIED DECRYPTED FEED</span>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="modal-body">
          {/* Metadata Bar */}
          <div className="modal-metadata">
            {article.news_site && (
              <span className="modal-source-badge">
                <Globe size={12} />
                {article.news_site}
              </span>
            )}
            
            {article.published_at && (
              <span className="modal-date-badge">
                <Calendar size={12} />
                {formatDate(article.published_at)}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="modal-title">{article.title}</h2>

          {/* Mission Briefing Divider */}
          <div className="briefing-divider">
            <span className="divider-label">MISSION INTEL BRIEFING</span>
            <div className="divider-line"></div>
          </div>

          {/* Detailed Summary */}
          {article.summary ? (
            <p className="modal-summary">{article.summary}</p>
          ) : (
            <p className="modal-summary empty-briefing">No telemetry description provided. Verify primary decrypt links.</p>
          )}

          {/* Interactive footer actions */}
          <div className="modal-actions-footer">
            {/* Bookmark button inside modal */}
            <button 
              className={`modal-action-btn bookmark-action ${isBookmarked ? 'active' : ''}`}
              onClick={onToggleBookmark}
              title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
              <span>{isBookmarked ? 'Encrypted Saved' : 'Encrypt Signal'}</span>
            </button>

            {/* Decrypt source site link */}
            {article.url && (
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn decrypt-action"
              >
                <span>Establish Direct Link</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleModal;
