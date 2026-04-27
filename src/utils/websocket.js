/**
 * WebSocket Service for Real-time Updates
 * Handles WebSocket connections with automatic reconnection
 */

import { config } from './config';
import { logger } from './logger';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = config.ws.baseURL;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = config.ws.reconnectAttempts;
    this.reconnectDelay = config.ws.reconnectDelay;
    this.eventListeners = new Map();
    this.isManualClose = false;
  }

  /**
   * Connect to WebSocket server
   */
  connect(token = null) {
    if (!config.ws.enabled) {
      logger.warn('WebSocket disabled in config', null, 'WebSocketService');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = token ? `${this.url}?token=${token}` : this.url;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          logger.info('WebSocket connected', null, 'WebSocketService');
          this.reconnectAttempts = 0;
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          logger.error('WebSocket error', error, 'WebSocketService');
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          logger.info('WebSocket closed', null, 'WebSocketService');
          this.emit('disconnected');

          if (!this.isManualClose) {
            this.attemptReconnect(token);
          }
        };
      } catch (error) {
        logger.error('WebSocket connection failed', error, 'WebSocketService');
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      logger.debug('WebSocket message received', message, 'WebSocketService');

      const { type, payload } = message;
      this.emit(type, payload);
    } catch (error) {
      logger.error('Failed to parse WebSocket message', error, 'WebSocketService');
    }
  }

  /**
   * Send message to server
   */
  send(type, payload = {}) {
    if (!this.isConnected()) {
      logger.warn('WebSocket not connected', null, 'WebSocketService');
      return;
    }

    try {
      const message = JSON.stringify({ type, payload, timestamp: Date.now() });
      this.ws.send(message);
      logger.debug('WebSocket message sent', { type }, 'WebSocketService');
    } catch (error) {
      logger.error('Failed to send WebSocket message', error, 'WebSocketService');
    }
  }

  /**
   * Subscribe to event
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from event
   */
  off(event, callback) {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emit event
   */
  emit(event, data = null) {
    if (!this.eventListeners.has(event)) return;

    this.eventListeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        logger.error(`Error in event listener for ${event}`, error, 'WebSocketService');
      }
    });
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached', null, 'WebSocketService');
      this.emit('reconnect_failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    logger.info(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`, null, 'WebSocketService');

    setTimeout(() => {
      this.connect(token).catch(() => {
        // Retry will be handled in catch
      });
    }, delay);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
    }
    this.eventListeners.clear();
    logger.info('WebSocket manually disconnected', null, 'WebSocketService');
  }

  /**
   * Get connection status
   */
  getStatus() {
    const statusMap = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED',
    };

    return {
      connected: this.isConnected(),
      status: this.ws ? statusMap[this.ws.readyState] : 'DISCONNECTED',
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
