/**
 * API Service Layer
 * Handles all HTTP requests with error handling, retries, and token management
 */

import axios from 'axios';
import { config } from './config';
import { logger } from './logger';
import { ErrorHandler, NetworkError, AuthenticationError } from './errorHandler';

class APIService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const token = this.getAuthToken();
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        logger.debug('API Request', { method: requestConfig.method, url: requestConfig.url }, 'APIService');
        return requestConfig;
      },
      (error) => {
        logger.error('Request interceptor error', error, 'APIService');
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.debug('API Response', { status: response.status, url: response.config.url }, 'APIService');
        return response;
      },
      (error) => {
        return this.handleResponseError(error);
      }
    );
  }

  handleResponseError(error) {
    if (error.response?.status === 401) {
      logger.warn('Unauthorized - Token may have expired', null, 'APIService');
      // Clear auth and redirect to login
      this.clearAuthToken();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const handledError = ErrorHandler.handle(error, 'APIService');
    logger.error(handledError.message, handledError, 'APIService');

    return Promise.reject(error);
  }

  // Token Management
  setAuthToken(token, refreshToken = null, expiresIn = null) {
    const storage = this.getSecureStorage();
    storage.setItem(config.auth.tokenKey, token);

    if (refreshToken) {
      storage.setItem(config.auth.refreshTokenKey, refreshToken);
    }

    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      storage.setItem(config.auth.tokenExpiryKey, expiryTime.toString());
    }

    logger.info('Auth token set', null, 'APIService');
  }

  getAuthToken() {
    const storage = this.getSecureStorage();
    const token = storage.getItem(config.auth.tokenKey);
    const expiryTime = storage.getItem(config.auth.tokenExpiryKey);

    if (!token) return null;

    // Check if token is expired
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      logger.warn('Token expired', null, 'APIService');
      this.clearAuthToken();
      return null;
    }

    return token;
  }

  clearAuthToken() {
    const storage = this.getSecureStorage();
    storage.removeItem(config.auth.tokenKey);
    storage.removeItem(config.auth.refreshTokenKey);
    storage.removeItem(config.auth.tokenExpiryKey);
    logger.info('Auth token cleared', null, 'APIService');
  }

  getSecureStorage() {
    // In production, use sessionStorage for sensitive data
    return config.isProduction ? sessionStorage : localStorage;
  }

  // HTTP Methods with Retry
  async request(method, url, data = null, config = {}) {
    let lastError;

    for (let attempt = 0; attempt <= this.getRetryAttempts(method); attempt++) {
      try {
        const response = await this.axiosInstance({
          method,
          url,
          data,
          ...config,
        });

        return {
          success: true,
          status: response.status,
          data: response.data,
        };
      } catch (error) {
        lastError = error;

        if (attempt < this.getRetryAttempts(method)) {
          const delay = this.getRetryDelay(attempt);
          logger.warn(`Retry attempt ${attempt + 1}`, { method, url }, 'APIService');
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    const handledError = ErrorHandler.handle(lastError, 'APIService');
    throw lastError;
  }

  getRetryAttempts(method) {
    // Only retry GET and safe methods
    return ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase()) ? config.api.retryAttempts : 0;
  }

  getRetryDelay(attempt) {
    // Exponential backoff
    return config.api.retryDelay * Math.pow(2, attempt);
  }

  // Convenience methods
  async get(url, config = {}) {
    return this.request('GET', url, null, config);
  }

  async post(url, data, config = {}) {
    return this.request('POST', url, data, config);
  }

  async put(url, data, config = {}) {
    return this.request('PUT', url, data, config);
  }

  async patch(url, data, config = {}) {
    return this.request('PATCH', url, data, config);
  }

  async delete(url, config = {}) {
    return this.request('DELETE', url, null, config);
  }

  // Batch requests
  async batch(requests) {
    return Promise.allSettled(requests);
  }
}

export const apiService = new APIService();
export default apiService;
