/**
 * Custom Error Classes for Better Error Handling
 */

import { logger } from './logger';

export class AppError extends Error {
  constructor(message, statusCode = 500, errorType = 'APP_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.timestamp = new Date();
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', resource = '') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'Server error', statusCode = 500) {
    super(message, statusCode, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

/**
 * Error Handler Utility
 */
export class ErrorHandler {
  static handle(error, context = '') {
    if (error instanceof AppError) {
      return {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errorType: error.errorType,
        field: error.field || null,
        context,
      };
    }

    if (error.response) {
      // API Error
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || error.message,
        errorType: 'API_ERROR',
        context,
      };
    }

    if (error.request) {
      // Network Error
      return {
        success: false,
        statusCode: 0,
        message: 'Network error. Please check your connection.',
        errorType: 'NETWORK_ERROR',
        context,
      };
    }

    // Generic Error
    return {
      success: false,
      statusCode: 500,
      message: error.message || 'An unexpected error occurred',
      errorType: 'UNKNOWN_ERROR',
      context,
    };
  }

  static getUserMessage(error) {
    const errorMap = {
      AUTH_ERROR: 'Please log in again',
      AUTHORIZATION_ERROR: 'You do not have permission for this action',
      VALIDATION_ERROR: 'Please check your input and try again',
      NOT_FOUND: 'The requested resource was not found',
      NETWORK_ERROR: 'Network connection error. Please try again.',
      SERVER_ERROR: 'Server error. Please try again later.',
      API_ERROR: error.message || 'An error occurred. Please try again.',
      UNKNOWN_ERROR: 'An unexpected error occurred',
    };

    return errorMap[error.errorType] || error.message;
  }

  static logError(error, context = '') {
    const handled = this.handle(error, context);
    logger.error(handled.message, handled, context);
    return handled;
  }
}

export default ErrorHandler;
