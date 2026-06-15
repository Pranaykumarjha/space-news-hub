import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="news-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image shimmer"></div>
          <div className="skeleton-content">
            <div className="skeleton-badge shimmer"></div>
            <div className="skeleton-title shimmer"></div>
            <div className="skeleton-title short shimmer"></div>
            <div className="skeleton-text shimmer"></div>
            <div className="skeleton-text shimmer"></div>
            <div className="skeleton-footer shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
