import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import '../../styles/session.css';

export default function SessionManagement({ onLogout, sessionTimeout = 30 }) {
  const [sessionActive, setSessionActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(sessionTimeout * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const warningThreshold = 5 * 60; // Show warning with 5 minutes left

  const inactivityTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  useEffect(() => {
    const handleActivity = () => {
      setLastActivityTime(Date.now());
      setShowWarning(false);
      resetSessionTimer();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  const resetSessionTimer = () => {
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    setTimeRemaining(sessionTimeout * 60);

    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, (sessionTimeout * 60 - warningThreshold) * 1000);

    inactivityTimeoutRef.current = setTimeout(() => {
      handleSessionTimeout();
    }, sessionTimeout * 60 * 1000);
  };

  const handleSessionTimeout = () => {
    setSessionActive(false);
    onLogout?.();
  };

  const handleExtendSession = () => {
    setShowWarning(false);
    setLastActivityTime(Date.now());
    resetSessionTimer();
  };

  useEffect(() => {
    resetSessionTimer();

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSessionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionActive) {
    return (
      <div className="session-expired">
        <div className="expired-content">
          <AlertTriangle size={64} />
          <h2>Session Expired</h2>
          <p>Your session has expired due to inactivity. Please log in again.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="session-indicator">
        <div className="session-info">
          <Shield size={16} />
          <span>Session Time: {formatTime(timeRemaining)}</span>
        </div>
      </div>

      {showWarning && (
        <div className="session-warning-modal">
          <div className="warning-content">
            <AlertTriangle size={48} />
            <h3>Session Ending Soon</h3>
            <p>Your session will expire in {formatTime(timeRemaining)} due to inactivity.</p>
            <div className="warning-timer">
              <Clock size={32} />
              <span className="timer-text">{formatTime(timeRemaining)}</span>
            </div>
            <div className="warning-actions">
              <button className="btn btn-primary" onClick={handleExtendSession}>
                Continue Session
              </button>
              <button className="btn btn-outline" onClick={handleSessionTimeout}>
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SessionSettings() {
  const [sessionConfig, setSessionConfig] = useState(() => {
    const saved = localStorage.getItem('sessionConfig');
    return saved ? JSON.parse(saved) : {
      timeout: 30,
      warningTime: 5,
      autoLockScreen: true,
      rememberLogin: false,
      maxSessions: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('sessionConfig', JSON.stringify(sessionConfig));
  }, [sessionConfig]);

  const handleChange = (key, value) => {
    setSessionConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="session-settings">
      <h3>Session & Security Settings</h3>

      <div className="settings-group">
        <label>
          <span>Session Timeout (minutes)</span>
          <input
            type="number"
            min="5"
            max="480"
            value={sessionConfig.timeout}
            onChange={(e) => handleChange('timeout', parseInt(e.target.value))}
          />
        </label>
        <small>User will be logged out after {sessionConfig.timeout} minutes of inactivity</small>
      </div>

      <div className="settings-group">
        <label>
          <span>Warning Time (minutes)</span>
          <input
            type="number"
            min="1"
            max={sessionConfig.timeout - 1}
            value={sessionConfig.warningTime}
            onChange={(e) => handleChange('warningTime', parseInt(e.target.value))}
          />
        </label>
        <small>Show warning {sessionConfig.warningTime} minutes before session expires</small>
      </div>

      <div className="settings-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={sessionConfig.autoLockScreen}
            onChange={(e) => handleChange('autoLockScreen', e.target.checked)}
          />
          <span>Auto-lock screen on timeout</span>
        </label>
      </div>

      <div className="settings-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={sessionConfig.rememberLogin}
            onChange={(e) => handleChange('rememberLogin', e.target.checked)}
          />
          <span>Remember me on this device</span>
        </label>
      </div>

      <div className="settings-group">
        <label>
          <span>Maximum Concurrent Sessions</span>
          <select
            value={sessionConfig.maxSessions}
            onChange={(e) => handleChange('maxSessions', parseInt(e.target.value))}
          >
            <option value="1">1 (Only this device)</option>
            <option value="3">3 (Up to 3 devices)</option>
            <option value="5">5 (Up to 5 devices)</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </label>
      </div>
    </div>
  );
}
