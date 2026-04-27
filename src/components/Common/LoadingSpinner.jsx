/**
 * Loading Spinner Component
 * Displays loading states with various animations
 */

import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ 
  size = 'medium', 
  fullScreen = false, 
  message = 'Loading...',
  overlay = false 
}) => {
  const spinnerClass = `spinner spinner-${size}`;

  const content = (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className={spinnerClass}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {content}
      </div>
    );
  }

  return content;
};

export const SkeletonLoader = ({ count = 3, height = '20px', width = '100%' }) => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height,
            width,
            marginBottom: '10px',
          }}
        ></div>
      ))}
    </div>
  );
};

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="spinner spinner-large"></div>
        <h2>{message}</h2>
        <div className="loader-progress">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

export const InlineLoader = ({ message = '' }) => {
  return (
    <div className="inline-loader">
      <div className="spinner spinner-small"></div>
      {message && <span>{message}</span>}
    </div>
  );
};

export default LoadingSpinner;
