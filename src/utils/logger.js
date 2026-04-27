/**
 * Logging System
 * Handles application-wide logging with levels, timestamps, and remote logging support
 */

const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const LogLevelValue = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor(config = {}) {
    this.level = config.level || 'info';
    this.toConsole = config.toConsole !== false;
    this.toRemote = config.toRemote !== false;
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, data = null, context = '') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data,
      context,
      userAgent: navigator.userAgent,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const shouldLog = LogLevelValue[level.toUpperCase()] <= LogLevelValue[this.level.toUpperCase()];

    if (shouldLog) {
      if (this.toConsole) {
        this.logToConsole(logEntry);
      }

      if (this.toRemote) {
        this.logToRemote(logEntry);
      }
    }

    return logEntry;
  }

  logToConsole(entry) {
    const style = this.getConsoleStyle(entry.level);
    const message = `[${entry.timestamp}] [${entry.level}] ${entry.context ? `[${entry.context}]` : ''} ${entry.message}`;

    console.log(`%c${message}`, style);
    if (entry.data) {
      console.log(entry.data);
    }
  }

  logToRemote(entry) {
    // Implement remote logging to analytics service
    // Example: Send to Sentry, LogRocket, or custom logging endpoint
    if (import.meta.env.VITE_PRODUCTION) {
      // Uncomment when backend is ready
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) }).catch(() => {});
    }
  }

  getConsoleStyle(level) {
    const styles = {
      ERROR: 'color: #ff6b6b; font-weight: bold;',
      WARN: 'color: #ffa500; font-weight: bold;',
      INFO: 'color: #4a90e2; font-weight: bold;',
      DEBUG: 'color: #95e1d3; font-weight: bold;',
    };
    return styles[level] || '';
  }

  error(message, data = null, context = '') {
    return this.log('ERROR', message, data, context);
  }

  warn(message, data = null, context = '') {
    return this.log('WARN', message, data, context);
  }

  info(message, data = null, context = '') {
    return this.log('INFO', message, data, context);
  }

  debug(message, data = null, context = '') {
    return this.log('DEBUG', message, data, context);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  downloadLogs() {
    const logs = this.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const logger = new Logger({
  level: import.meta.env.VITE_LOG_LEVEL || 'info',
  toConsole: import.meta.env.VITE_LOG_TO_CONSOLE === 'true',
  toRemote: import.meta.env.PROD === true,
});

export default logger;
