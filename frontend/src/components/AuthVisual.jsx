import { motion } from 'framer-motion';

const AuthVisual = () => {
  return (
    <div className="auth-visual-panel">
      {/* Abstract Animated Space Orbits */}
      <div className="space-orbital-container">
        {/* Sun/Core */}
        <div className="orbital-core">
          <div className="core-glow"></div>
        </div>

        {/* Orbit 1 with Satellite */}
        <motion.div 
          className="orbital-ring ring-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="satellite sat-1"></div>
        </motion.div>

        {/* Orbit 2 with Satellite */}
        <motion.div 
          className="orbital-ring ring-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          <div className="satellite sat-2"></div>
        </motion.div>

        {/* Orbit 3 with Satellite */}
        <motion.div 
          className="orbital-ring ring-3"
          animate={{ rotate: 280 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        >
          <div className="satellite sat-3"></div>
        </motion.div>

        {/* Constellation line overlays (decorations) */}
        <div className="grid-overlay"></div>
      </div>

      {/* Narrative Brand Copy */}
      <div className="visual-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="badge-tech">SYSTEM INCOMING TELEMETRY</span>
          <h2 className="visual-title">Humanity's Journey Beyond</h2>
          <p className="visual-desc">
            Gain real-time access to the universe. We aggregate and stream critical discoveries, launch telemetries, and orbital data from global aerospace intelligence networks.
          </p>
        </motion.div>

        {/* Stats footer in visual panel */}
        <motion.div 
          className="visual-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="stat-pill">
            <span className="stat-label">ORBITS TRACKED</span>
            <span className="stat-val">12,492</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">API LATENCY</span>
            <span className="stat-val">24ms</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">STATUS</span>
            <span className="stat-val active">ONLINE</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthVisual;
