import React, { useState, useEffect } from 'react';
import { Lock, Phone, CheckCircle } from 'lucide-react';
import '../../styles/login.css';

export default function PlacementOfficerOTP({ user, onOTPVerified }) {
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate OTP on mount
  useEffect(() => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    const maskedPhone = user?.phone ? `${user.phone.slice(0, 2)}****${user.phone.slice(-2)}` : 'your mobile';
    console.log(`OTP sent to ${maskedPhone}: ${newOTP}`); // In real app, send via SMS/Email
  }, [user]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (otp === generatedOTP) {
        setVerified(true);
        setTimeout(() => {
          onOTPVerified();
        }, 1000);
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  const handleResendOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    setOtp('');
    setTimeLeft(300);
    setError('');
    const maskedPhone = user?.phone ? `${user.phone.slice(0, 2)}****${user.phone.slice(-2)}` : 'your mobile';
    console.log(`New OTP sent to ${maskedPhone}: ${newOTP}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (verified) {
    return (
      <div className="login-container">
        <div className="login-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <div className="login-wrapper" style={{ maxWidth: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Verified!</h2>
            <p>OTP verified successfully. Granting access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="login-wrapper" style={{ maxWidth: '450px' }}>
        <div className="login-header">
          <div className="login-logo" style={{ fontSize: '2.5rem' }}>🔐</div>
          <h1>Verify OTP</h1>
          <p>Placement Officer Access</p>
        </div>

        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <Phone size={20} style={{ color: '#10b981', marginTop: '0.25rem', flexShrink: 0 }} />
          <div>
            <strong>OTP Sent</strong>
            <p style={{ fontSize: '0.875rem', color: '#059669', margin: '0.25rem 0 0 0' }}>
              A 6-digit code has been sent to {user?.phone ? `${user.phone.slice(0, 2)}****${user.phone.slice(-2)}` : 'your registered mobile number'}
            </p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleVerifyOTP} className="login-form">
          <div className="form-group">
            <label htmlFor="otp">
              <Lock size={16} style={{ marginRight: '0.5rem' }} />
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              maxLength="6"
              pattern="[0-9]*"
              required
              style={{
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: timeLeft > 60 ? '#6b7280' : '#ef4444' }}>
              Time remaining: <strong>{formatTime(timeLeft)}</strong>
            </span>
            {timeLeft < 60 && (
              <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>
                ⚠️ OTP expiring soon
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={loading || otp.length !== 6 || timeLeft <= 0}
            style={{ width: '100%' }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            Didn't receive the OTP?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#2563eb',
              textDecoration: 'underline',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            Resend OTP
          </button>
        </div>

        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: '#92400e',
          textAlign: 'center'
        }}>
          <strong>Demo:</strong> Check browser console to see the OTP
        </div>
      </div>
    </div>
  );
}
