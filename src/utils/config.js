/**
 * Application Configuration
 * Loads environment variables with fallback defaults
 */

export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // WebSocket Configuration
  ws: {
    baseURL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000',
    enabled: import.meta.env.VITE_WS_ENABLED === 'true',
    reconnectAttempts: 5,
    reconnectDelay: 3000,
  },

  // Authentication
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
    tokenExpiryKey: import.meta.env.VITE_TOKEN_EXPIRY_KEY || 'token_expiry',
    tokenRefreshThreshold: 5 * 60 * 1000, // Refresh 5 minutes before expiry
  },

  // Security
  security: {
    encryptionEnabled: import.meta.env.VITE_ENCRYPTION_ENABLED === 'true',
    corsEnabled: import.meta.env.VITE_CORS_ENABLED === 'true',
    enableHTTPS: import.meta.env.PROD === true,
  },

  // Environment
  env: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',

  // Feature Flags
  features: {
    realTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    offlineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  },

  // Logging
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
    toConsole: import.meta.env.VITE_LOG_TO_CONSOLE === 'true',
    toRemote: import.meta.env.PROD === true,
  },
};

export default config;
