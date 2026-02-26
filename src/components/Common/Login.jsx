import React, { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Register from './Register';
import '../../styles/login.css';

export default function Login({ onLogin }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const roles = [
    { id: 'student', label: 'Student', icon: '👨‍🎓' },
    { id: 'employer', label: 'Employer', icon: '🏢' },
    { id: 'officer', label: 'Placement Officer', icon: '👔' },
    { id: 'admin', label: 'Admin', icon: '⚙️' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password, selectedRole);
      if (result) {
        setLoading(false);
        onLogin(email, password, selectedRole);
      } else {
        setError('Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleRegisterSuccess = (regEmail, regPassword, regRole) => {
    setEmail(regEmail);
    setPassword(regPassword);
    setSelectedRole(regRole);
    setShowRegister(false);
    setTimeout(() => {
      login(regEmail, regPassword, regRole);
      setTimeout(() => {
        onLogin(regEmail, regPassword, regRole);
      }, 1500);
    }, 500);
  };

  if (showRegister) {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1>CampusHire</h1>
          <p>Placement Interaction System</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="role-selector">
            <label>Select Role:</label>
            <div className="role-grid">
              {roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <div className="role-label">{role.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#2563eb',
                textDecoration: 'underline',
                fontSize: 'inherit'
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
