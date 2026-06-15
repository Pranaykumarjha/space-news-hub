import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, UserPlus, Rocket, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Starfield from '../components/Starfield';
import AuthVisual from '../components/AuthVisual';
import '../styles/Auth.css';

const Register = () => {
  // State management for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Send registration request to backend
      const response = await api.post('/auth/register', {
        email,
        password,
      });

      // Backend returns { success, data: { _id, email, token } }
      const token = response.data.data?.token || response.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }

      // Show success message
      setSuccess('Channel established! Relaying to access terminal...');
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try another signal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="auth-container"
    >
      {/* Background Starfield and Nebula Glow */}
      <Starfield />

      {/* Left split screen visual details */}
      <AuthVisual />

      {/* Right split screen registration form */}
      <div className="auth-panel">
        <div className="auth-card-wrapper">
          {/* Logo Heading */}
          <div className="auth-header-logo">
            <div className="logo-icon">
              <Rocket size={20} />
            </div>
            <span className="logo-text">Space News Hub</span>
          </div>

          {/* Form Card */}
          <motion.div 
            className="auth-form-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1>Join the Fleet</h1>
            <p className="auth-subtitle">Provision access keys for space telemetry</p>

            {/* Error notifications */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success notifications */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle size={18} />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Secure Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Access Key</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Access Key</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span>Relaying coordinates...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <UserPlus size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-link">
              Already have coordinates? <a href="/login">Access console here</a>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
