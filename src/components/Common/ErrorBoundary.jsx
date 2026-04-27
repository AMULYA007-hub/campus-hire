/**
 * Error Boundary Component
 * Catches errors in component tree and displays fallback UI
 */

import React from 'react';
import { logger } from '../../utils/logger';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Component Error Caught', { error: error.toString(), componentStack: errorInfo.componentStack }, 'ErrorBoundary');

    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  downloadErrorLog = () => {
    const errorLog = {
      error: this.state.error?.toString(),
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(errorLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something went wrong</h1>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  <strong>{this.state.error && this.state.error.toString()}</strong>
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <p className="error-message">
              We're sorry for the inconvenience. Our team has been notified about this error.
            </p>

            <div className="error-actions">
              <button onClick={this.resetError} className="btn btn-primary">
                Try Again
              </button>
              <button onClick={() => (window.location.href = '/')} className="btn btn-secondary">
                Go Home
              </button>
              {process.env.NODE_ENV === 'development' && (
                <button onClick={this.downloadErrorLog} className="btn btn-outline">
                  Download Error Log
                </button>
              )}
            </div>

            {this.state.errorCount > 3 && (
              <div className="error-warning">
                <p>Multiple errors detected. Please refresh the page.</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
