import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  LogOut, 
  Search, 
  Calendar, 
  ArrowUp, 
  Compass, 
  Layers, 
  Radio, 
  Clock,
  Bookmark,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { fetchBookmarks, removeBookmark } from '../services/bookmarkService';
import Starfield from '../components/Starfield';
import SkeletonLoader from '../components/SkeletonLoader';
import AnimatedCounter from '../components/AnimatedCounter';
import TiltCard from '../components/TiltCard';
import ArticleModal from '../components/ArticleModal';
import '../styles/Home.css';

const Bookmarks = () => {
  // State management
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Modal & feedback states
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Navigation
  const navigate = useNavigate();

  // Load auth & bookmarks on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    loadUserBookmarks();

    // Scroll listeners
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  // Fetch bookmarks from database API
  const loadUserBookmarks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchBookmarks();
      setBookmarks(data);
      const now = new Date();
      setLastSync(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to sync with ground telemetry.';
      setError(errorMsg);
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toast feedback helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Remove bookmark function
  const handleRemoveBookmark = async (id, e) => {
    if (e) e.stopPropagation(); // Prevent card clicks
    try {
      await removeBookmark(id);
      setBookmarks(prev => prev.filter(b => b._id !== id));
      showToast('Telemetry Signal Decrypted & Removed', 'info');
      // If modal is open for this article, close it
      if (selectedArticle && selectedArticle._id === id) {
        handleCloseModal();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to decrypt bookmark link.';
      showToast(errorMsg, 'error');
    }
  };

  // Open modal
  const handleOpenModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  // Scroll to main content
  const scrollToArticles = () => {
    const section = document.getElementById('articles-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString || 'Unknown cosmic date';
    }
  };

  // Live filtering
  const filteredBookmarks = bookmarks.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(query) ||
      article.summary?.toLowerCase().includes(query) ||
      article.news_site?.toLowerCase().includes(query)
    );
  });

  // Unique sources
  const uniqueSources = new Set(bookmarks.map(b => b.news_site).filter(Boolean)).size;

  // Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 15 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="home-layout"
    >
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress-indicator"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Canvas space background */}
      <Starfield />

      {/* Sticky Navbar */}
      <motion.nav 
        className="glass-navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <div className="logo-badge">
              <Rocket size={18} className="rocket-icon" />
            </div>
            <span className="logo-brand-text">Space News Hub</span>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <span className="nav-link" onClick={() => navigate('/')}>Dashboard</span>
            <span className="nav-link active" onClick={scrollToTop}>Bookmarks</span>
          </div>

          <button onClick={handleLogout} className="glass-logout-btn">
            <span className="btn-text">Logout</span>
            <LogOut size={16} />
          </button>
        </div>
      </motion.nav>

      {/* Hero Header Section */}
      <header className="hero-section">
        <div className="hero-inner">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="pulse-indicator"></span>
            SECURED ORBITAL STORAGE
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Saved <span className="text-glow-gradient">Intel Relays</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            View and manage decrypted space intelligence signals that you have committed to your secure station storage database.
          </motion.p>

          <motion.div
            className="hero-cta-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button onClick={scrollToArticles} className="primary-glow-btn">
              <span>Access Secure Feed</span>
              <Compass size={18} />
            </button>
          </motion.div>

          {/* Statistics Telemetry Grid */}
          <motion.div 
            className="stats-telemetry-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="telemetry-card">
              <div className="telemetry-icon-wrapper">
                <Layers size={18} />
              </div>
              <div className="telemetry-info">
                <span className="telemetry-label">SAVED SIGNALS</span>
                <span className="telemetry-value">
                  {loading ? '...' : <AnimatedCounter value={bookmarks.length} />}
                </span>
              </div>
            </div>

            <div className="telemetry-card">
              <div className="telemetry-icon-wrapper">
                <Radio size={18} />
              </div>
              <div className="telemetry-info">
                <span className="telemetry-label">SAVED SOURCES</span>
                <span className="telemetry-value">
                  {loading ? '...' : <AnimatedCounter value={uniqueSources} />}
                </span>
              </div>
            </div>

            <div className="telemetry-card">
              <div className="telemetry-icon-wrapper">
                <Clock size={18} />
              </div>
              <div className="telemetry-info">
                <span className="telemetry-label">LAST TELEMETRY</span>
                <span className="telemetry-value">{lastSync ? lastSync : 'Offline'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Bookmarks Feed Area */}
      <main id="articles-section" className="dashboard-content">
        
        {/* Floating Search Controls */}
        <div className="controls-anchor">
          <div className="search-outer-container">
            <div className="glass-search-container">
              <Search className="search-symbol" size={18} />
              <input
                type="text"
                placeholder="Search secured signals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                  title="Clear Search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading / Content states */}
        {loading ? (
          <SkeletonLoader count={3} />
        ) : error ? (
          <div className="error-telemetry-card">
            <h3>Telemetry Access Terminated</h3>
            <p>{error}</p>
            <button onClick={loadUserBookmarks} className="retry-telemetry-btn">
              <span>Re-Initialize Sync</span>
            </button>
          </div>
        ) : (
          <>
            {filteredBookmarks.length > 0 ? (
              <div className="feed-wrap">
                <div className="grid-header-row">
                  <h3>DECRYPTED SECURE FEED</h3>
                  <span className="feed-status-badge">
                    {filteredBookmarks.length} Saved Relays
                  </span>
                </div>

                <motion.div 
                  className="news-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  {filteredBookmarks.map((bookmark) => (
                    <motion.div key={bookmark._id} variants={cardVariant}>
                      <TiltCard 
                        className="glass-news-card"
                        onClick={() => handleOpenModal(bookmark)}
                      >
                        {/* Hover zoomed image card top */}
                        {bookmark.image_url && (
                          <div className="card-image-viewport">
                            <img 
                              src={bookmark.image_url} 
                              alt={bookmark.title}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';
                              }}
                            />
                            <div className="image-overlay-glow"></div>
                          </div>
                        )}

                        {/* Card metadata and content */}
                        <div className="card-content-wrapper">
                          <div className="card-site-source">
                            {bookmark.news_site && (
                              <span className="neon-source-badge">{bookmark.news_site}</span>
                            )}
                            
                            {/* Bookmark delete trigger */}
                            <button 
                              className="card-bookmark-btn active"
                              onClick={(e) => handleRemoveBookmark(bookmark._id, e)}
                              title="Delete Bookmark"
                            >
                              <Bookmark size={15} fill="currentColor" />
                            </button>
                          </div>

                          <h3 className="card-headline-title">{bookmark.title}</h3>

                          {bookmark.summary && (
                            <p className="card-abstract-summary">{bookmark.summary}</p>
                          )}

                          <div className="card-feed-footer">
                            {bookmark.published_at && (
                              <span className="card-cosmic-date">
                                <Calendar size={12} />
                                {formatDate(bookmark.published_at)}
                              </span>
                            )}

                            <span className="card-decrypt-indicator">
                              <span>Open Intel</span>
                              <Zap size={10} />
                            </span>
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="empty-signals-card">
                <Bookmark size={48} className="empty-card-icon" />
                <h3>Secure Station Storage Empty</h3>
                <p>
                  No decrypted news items are stored. Search feeds in your Dashboard and click bookmark to save.
                </p>
                <button onClick={() => navigate('/')} className="reset-filter-btn">
                  Open Primary Dashboard
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* News Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isBookmarked={true}
            onToggleBookmark={(e) => handleRemoveBookmark(selectedArticle._id, e)}
            formatDate={formatDate}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            className={`toast-alert-container toast-${toast.type}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <div className="toast-content">
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'info' && <CheckCircle size={18} />}
              {toast.type === 'error' && <XCircle size={18} />}
              <span className="toast-msg">{toast.message}</span>
            </div>
            <div className="toast-progress"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            className="scroll-top-fab"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Scroll to Top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bookmarks;
