/**
 * Access Denied Component
 * Shown when user tries to access restricted content
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '../../utils/logger';
import './AccessDenied.css';

function AccessDenied() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    logger.info('User going back from access denied page', null, 'AccessDenied');
    navigate(-1);
  };

  const handleGoHome = () => {
    logger.info('User going to dashboard from access denied page', null, 'AccessDenied');
    navigate('/dashboard');
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="denied-icon">🔒</div>
        <h1>Access Denied</h1>
        
        <p className="denied-message">
          You don't have permission to access this resource.
        </p>

        <div className="denied-details">
          <p>Only authorized users with the appropriate role can access this area.</p>
          <p>If you believe this is a mistake, please contact your administrator.</p>
        </div>

        <div className="denied-actions">
          <button onClick={handleGoBack} className="btn btn-secondary">
            ← Go Back
          </button>
          <button onClick={handleGoHome} className="btn btn-primary">
            Go to Dashboard
          </button>
        </div>

        <div className="denied-footer">
          <small>Error Code: ACCESS_DENIED_403</small>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
