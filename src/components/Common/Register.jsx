import React, { useState } from 'react';
import { Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/login.css';

export default function Register({ onRegisterSuccess, onBackToLogin }) {
  const { register, loading, error } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const roles = [
    { id: 'student', label: 'Student', icon: '👨‍🎓' },
    { id: 'employer', label: 'Employer', icon: '🏢' },
    { id: 'officer', label: 'Placement Officer', icon: '👔' },
    { id: 'admin', label: 'Admin', icon: '⚙️' }
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    setSuccessMessage('');

    const result = await register(email, password, confirmPassword, selectedRole, fullName, phone);
    
    if (result) {
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        onRegisterSuccess(email, password, selectedRole);
      }, 1500);
    } else if (error) {
      setRegistrationError(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="login-wrapper" style={{ maxWidth: '500px' }}>
        <button
          type="button"
          onClick={onBackToLogin}
          className="back-button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#2563eb',
            fontSize: '14px',
            marginBottom: '16px',
            padding: '8px 0'
          }}
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="login-header">
          <div className="login-logo">📝</div>
          <h1>Create Account</h1>
          <p>Join CampusHire Today</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {registrationError && <div className="alert alert-danger">{registrationError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              required
              maxLength="10"
            />
          </div>

          <div className="role-selector">
            <label>Select Role *</label>
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
            <label>Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#2563eb',
                textDecoration: 'underline',
                fontSize: 'inherit'
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
