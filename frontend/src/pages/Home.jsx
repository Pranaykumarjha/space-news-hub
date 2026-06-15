import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  LogOut, 
  Search, 
  Calendar, 
  ExternalLink, 
  ArrowUp, 
  RefreshCw, 
  Compass, 
  Layers, 
  Radio, 
  Clock,
  AlertOctagon,
  Bookmark,
  BookOpen,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { fetchBookmarks, saveBookmark, removeBookmark } from '../services/bookmarkService';
import Starfield from '../components/Starfield';
import SkeletonLoader from '../components/SkeletonLoader';
import AnimatedCounter from '../components/AnimatedCounter';
import TiltCard from '../components/TiltCard';
import ArticleModal from '../components/ArticleModal';
import '../styles/Home.css';

const Home = () => {
  // State management
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Advanced integrations states
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [heroCursor, setHeroCursor] = useState({ x: 0, y: 0 });
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState({}); // { [articleId]: true } while saving
  const [bookmarkAnimating, setBookmarkAnimating] = useState({}); // { [articleId]: true } for pop anim

  // Navigation hook
  const navigate = useNavigate();

  // Authentication check, bookmarks, and data fetch on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchNews();
    loadBookmarks();

    // Scroll progress indicator & top FAB triggers
    const handleScroll = () => {
      // FAB trigger
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Progress bar percentage calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  // Fetch bookmarks from database API
  const loadBookmarks = async () => {
    try {
      const data = await fetchBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/news');
      const articlesData = response.data.data || response.data;
      
      if (Array.isArray(articlesData)) {
        setNews(articlesData);
        // Set update timestamp
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      } else {
        console.warn('Articles data is not an array:', articlesData);
        setNews([]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to sync with ground telemetry.';
      setError(errorMsg);
      console.error('Error fetching news:', err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger feedback toast alerts
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

  // Add/Remove bookmark via backend integration (with optimistic UI)
  const handleToggleBookmark = async (article, e) => {
    if (e) e.stopPropagation();

    const articleIdStr = String(article.id || article.articleId);

    // Prevent double-click while loading
    if (bookmarkLoading[articleIdStr]) return;

    const existingBookmark = bookmarks.find(b => String(b.articleId) === articleIdStr);

    // --- Optimistic update: change UI immediately ---
    if (existingBookmark) {
      setBookmarks(prev => prev.filter(b => b._id !== existingBookmark._id));
    } else {
      // Build a temporary bookmark object for instant visual feedback
      const optimistic = {
        _id: `temp_${articleIdStr}`,
        articleId: articleIdStr,
        title: article.title,
        summary: article.summary,
        image_url: article.image_url,
        url: article.url,
        published_at: article.published_at,
        news_site: article.news_site,
      };
      setBookmarks(prev => [optimistic, ...prev]);
    }

    // Trigger pop animation
    setBookmarkAnimating(prev => ({ ...prev, [articleIdStr]: true }));
    setTimeout(() => setBookmarkAnimating(prev => ({ ...prev, [articleIdStr]: false })), 500);

    // Mark as loading
    setBookmarkLoading(prev => ({ ...prev, [articleIdStr]: true }));

    try {
      if (existingBookmark) {
        await removeBookmark(existingBookmark._id);
        showToast('Article Removed from Bookmarks', 'info');
      } else {
        const savedData = await saveBookmark(article);
        // Replace the optimistic entry with the real server record
        setBookmarks(prev =>
          prev.map(b =>
            b._id === `temp_${articleIdStr}` ? savedData : b
          )
        );
        showToast('Article Saved!', 'success');
      }
    } catch (err) {
      // Revert optimistic update on failure
      if (existingBookmark) {
        setBookmarks(prev => [existingBookmark, ...prev]);
      } else {
        setBookmarks(prev => prev.filter(b => b._id !== `temp_${articleIdStr}`));
      }
      const errorMsg = err.response?.data?.message || 'Failed to save bookmark.';
      showToast(errorMsg, 'error');
    } finally {
      setBookmarkLoading(prev => ({ ...prev, [articleIdStr]: false }));
    }
  };

  // Open article modal
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

  // Scroll to page top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date to human-readable format
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

  // Hero interactive parallax movements
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates for parallax offsets
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    setHeroCursor({ x, y });
    setHeroOffset({ x: dx * 15, y: dy * 15 });
  };

  const handleHeroMouseLeave = () => {
    setHeroOffset({ x: 0, y: 0 });
  };

  // Live filtering logic
  const filteredNews = news.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(query) ||
      article.summary?.toLowerCase().includes(query) ||
      article.news_site?.toLowerCase().includes(query)
    );
  });

  // Extract suggestions based on user query
  const suggestions = searchQuery 
    ? news
        .filter(article => article.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5) 
    : [];

  // Split news into Featured (first matching article) and Grid (the rest)
  const featuredArticle = filteredNews[0];
  const gridArticles = filteredNews.slice(1);

  // Statistics properties
  const uniqueSources = new Set(news.map(article => article.news_site).filter(Boolean)).size;

  // Bookmarked check array for highlights
  const bookmarkedIds = bookmarks.map(b => String(b.articleId));

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="home-layout"
    >
      {/* Scroll Progress Indicator sticky at top */}
      <div 
        className="scroll-progress-indicator"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Interactive Canvas Starfield */}
      <Starfield />

      {/* Sticky Premium Navbar */}
      <motion.nav 
        className="glass-navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-container">
          <div className="nav-logo" onClick={scrollToTop}>
            <div className="logo-badge">
              <Rocket size={18} className="rocket-icon" />
            </div>
            <span className="logo-brand-text">Space News Hub</span>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <span className="nav-link active" onClick={scrollToTop}>Dashboard</span>
            <span className="nav-link" onClick={() => navigate('/bookmarks')}>Bookmarks</span>
          </div>

          <button onClick={handleLogout} className="glass-logout-btn">
            <span className="btn-text">Logout</span>
            <LogOut size={16} />
          </button>
        </div>
      </motion.nav>

      {/* Hero Header Section with Aurora Glow tracking & Mouse Parallax */}
      <header 
        className="hero-section"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Dynamic Aurora Glow reacts to mouse position */}
        <div 
          className="hero-aurora-glow"
          style={{
            transform: `translate(${heroOffset.x * 1.5}px, ${heroOffset.y * 1.5}px)`,
            background: `radial-gradient(circle 350px at ${heroCursor.x}px ${heroCursor.y}px, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(0, 0, 0, 0) 100%)`
          }}
        />

        {/* Floating planet spheres with mouse parallax */}
        <motion.div 
          className="floating-planet planet-alpha"
          style={{ x: heroOffset.x * 0.8, y: heroOffset.y * 0.8 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="floating-planet planet-beta"
          style={{ x: -heroOffset.x * 0.5, y: -heroOffset.y * 0.5 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="hero-inner">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="pulse-indicator"></span>
            ORBITAL INTEL FEED ACTIVE
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore the Latest <br />
            <span className="text-glow-gradient">Space Discoveries</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Access decentralized spaceflight intelligence. Read real-time updates from NASA, SpaceX, ESA, and global cosmic research databases.
          </motion.p>

          <motion.div
            className="hero-cta-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button onClick={scrollToArticles} className="primary-glow-btn">
              <span>Enter Feed Stream</span>
              <Compass size={18} />
            </button>
          </motion.div>

          {/* Real-time statistics telemetry dashboard with Animated Counters */}
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
                <span className="telemetry-label">ARTICLES SECURED</span>
                <span className="telemetry-value">
                  {loading ? '...' : <AnimatedCounter value={news.length} />}
                </span>
              </div>
            </div>

            <div className="telemetry-card">
              <div className="telemetry-icon-wrapper">
                <Radio size={18} />
              </div>
              <div className="telemetry-info">
                <span className="telemetry-label">ACTIVE CHANNELS</span>
                <span className="telemetry-value">
                  {loading ? '...' : <AnimatedCounter value={uniqueSources} />}
                </span>
              </div>
            </div>

            <div className="telemetry-card">
              <div className="telemetry-icon-wrapper">
                <Bookmark size={18} />
              </div>
              <div className="telemetry-info">
                <span className="telemetry-label">SAVED SIGNALS</span>
                <span className="telemetry-value">
                  {loading ? '...' : <AnimatedCounter value={bookmarks.length} />}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Articles Dashboard Container */}
      <main id="articles-section" className="dashboard-content">
        
        {/* Floating Search Controls with Auto Suggestions Dropdown */}
        <div className="controls-anchor">
          <div className="search-outer-container">
            <div className="glass-search-container">
              <Search className="search-symbol" size={18} />
              <input
                type="text"
                placeholder="Search cosmic signals by title, summary, or space station source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
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

            {/* Suggestions drop-down menu */}
            <AnimatePresence>
              {searchFocused && suggestions.length > 0 && (
                <motion.div 
                  className="search-suggestions-dropdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="suggestions-header">
                    <span>SUGGESTED INTEL TRANSMISSIONS</span>
                    <span className="match-count">{filteredNews.length} MATCHES</span>
                  </div>
                  <ul className="suggestions-list">
                    {suggestions.map(article => (
                      <li 
                        key={article.id}
                        onClick={() => setSearchQuery(article.title)}
                        className="suggestion-item"
                      >
                        <Zap size={12} className="suggestion-icon" />
                        <span className="suggestion-title">{article.title}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loading / Error / Content states */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : error ? (
          <div className="error-telemetry-card">
            <AlertOctagon size={48} className="error-card-icon" />
            <h3>Satellite Connection Error</h3>
            <p>{error}</p>
            <button onClick={fetchNews} className="retry-telemetry-btn">
              <RefreshCw size={16} />
              <span>Retry Sync</span>
            </button>
          </div>
        ) : (
          <>
            {filteredNews.length > 0 ? (
              <div className="feed-wrap">
                {/* 1. Large Featured Article Section (Mission Briefing Style) */}
                {featuredArticle && !searchQuery && (
                  <motion.section 
                    className="featured-section"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="featured-banner-wrapper" onClick={() => handleOpenModal(featuredArticle)}>
                      {featuredArticle.image_url && (
                        <div className="featured-image-wrapper">
                          <img 
                            src={featuredArticle.image_url} 
                            alt={featuredArticle.title}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
                            }}
                          />
                          <div className="featured-image-shade"></div>
                        </div>
                      )}

                      <div className="featured-text-content">
                        <div className="featured-meta-row">
                          <span className="featured-briefing-badge">
                            <Zap size={12} />
                            PRIMARY MISSION BRIEFING
                          </span>
                          
                          {/* Bookmark simulation inside Featured */}
                          <button 
                            className={`featured-bookmark-btn ${bookmarkedIds.includes(String(featuredArticle.id)) ? 'active' : ''} ${bookmarkAnimating[String(featuredArticle.id)] ? 'animate-pop' : ''} ${bookmarkLoading[String(featuredArticle.id)] ? 'loading' : ''}`}
                            onClick={(e) => handleToggleBookmark(featuredArticle, e)}
                            title={bookmarkedIds.includes(String(featuredArticle.id)) ? "Remove Bookmark" : "Save Article"}
                            disabled={!!bookmarkLoading[String(featuredArticle.id)]}
                          >
                            <Bookmark size={16} fill={bookmarkedIds.includes(String(featuredArticle.id)) ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <h2 className="featured-headline-title">{featuredArticle.title}</h2>
                        
                        {featuredArticle.summary && (
                          <p className="featured-abstract-summary">{featuredArticle.summary}</p>
                        )}

                        <div className="featured-footer-row">
                          <div className="featured-stats-pills">
                            {featuredArticle.news_site && (
                              <span className="featured-source-pill">{featuredArticle.news_site}</span>
                            )}
                            {featuredArticle.published_at && (
                              <span className="featured-date-pill">
                                <Calendar size={12} />
                                {formatDate(featuredArticle.published_at)}
                              </span>
                            )}
                          </div>

                          <button className="featured-decrypt-action-btn">
                            <span>Decrypt Mission Details</span>
                            <BookOpen size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* 2. Grid Articles List (with 3D Card Tilt effects) */}
                <div className="grid-header-row">
                  <h3>{searchQuery ? 'DECRYPTED TRANSMISSIONS' : 'ORBITAL FEED LOGS'}</h3>
                  <span className="feed-status-badge">
                    {filteredNews.length} Signals Decoded
                  </span>
                </div>

                <motion.div 
                  className="news-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  {(searchQuery ? filteredNews : gridArticles).map((article) => (
                    <motion.div key={article.id} variants={cardVariant}>
                      <TiltCard 
                        className="glass-news-card"
                        onClick={() => handleOpenModal(article)}
                      >
                        {/* Hover zoomed image card top */}
                        {article.image_url && (
                          <div className="card-image-viewport">
                            <img 
                              src={article.image_url} 
                              alt={article.title}
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
                            {article.news_site && (
                              <span className="neon-source-badge">{article.news_site}</span>
                            )}
                            
                            {/* Bookmark button */}
                            <button 
                              className={`card-bookmark-btn ${bookmarkedIds.includes(String(article.id)) ? 'active' : ''} ${bookmarkAnimating[String(article.id)] ? 'animate-pop' : ''} ${bookmarkLoading[String(article.id)] ? 'loading' : ''}`}
                              onClick={(e) => handleToggleBookmark(article, e)}
                              title={bookmarkedIds.includes(String(article.id)) ? "Remove Bookmark" : "Save Article"}
                              disabled={!!bookmarkLoading[String(article.id)]}
                            >
                              <Bookmark size={15} fill={bookmarkedIds.includes(String(article.id)) ? "currentColor" : "none"} />
                            </button>
                          </div>

                          <h3 className="card-headline-title">{article.title}</h3>

                          {article.summary && (
                            <p className="card-abstract-summary">{article.summary}</p>
                          )}

                          <div className="card-feed-footer">
                            {article.published_at && (
                              <span className="card-cosmic-date">
                                <Calendar size={12} />
                                {formatDate(article.published_at)}
                              </span>
                            )}

                            <span className="card-decrypt-indicator">
                              <span>Decrypt Intel</span>
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
                <Radio size={48} className="empty-card-icon" />
                <h3>No Cosmic Signals Decrypted</h3>
                <p>
                  We couldn't resolve any telemetry matches for <strong>"{searchQuery}"</strong>. Try checking spelling or search other frequencies.
                </p>
                <button onClick={() => setSearchQuery('')} className="reset-filter-btn">
                  Reset Transmission Filter
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* News Detail Modal with decryption animation wrapper */}
      <AnimatePresence>
        {isModalOpen && selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isBookmarked={bookmarkedIds.includes(String(selectedArticle.id || selectedArticle.articleId))}
            onToggleBookmark={(e) => handleToggleBookmark(selectedArticle, e)}
            formatDate={formatDate}
          />
        )}
      </AnimatePresence>

      {/* Toast feedback alerts */}
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
              {toast.type === 'info' && <AlertCircle size={18} />}
              {toast.type === 'error' && <XCircle size={18} />}
              <span className="toast-msg">{toast.message}</span>
            </div>
            <div className="toast-progress"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Scroll to Top */}
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

export default Home;
