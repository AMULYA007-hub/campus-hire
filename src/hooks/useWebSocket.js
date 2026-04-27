/**
 * Custom Hook for WebSocket
 * Manages WebSocket connection and event subscription
 */

import { useEffect, useCallback, useState } from 'react';
import { webSocketService } from '../utils/websocket';
import { logger } from '../utils/logger';

export const useWebSocket = (eventName, eventHandler) => {
  const [isConnected, setIsConnected] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected');

  useEffect(() => {
    // Subscribe to event
    if (eventName && eventHandler) {
      const unsubscribe = webSocketService.on(eventName, eventHandler);

      // Cleanup
      return () => {
        unsubscribe();
      };
    }
  }, [eventName, eventHandler]);

  useEffect(() => {
    // Setup connection listeners
    const handleConnected = () => {
      setIsConnected(true);
      setWsStatus('connected');
      logger.info('WebSocket hook: connected', null, 'useWebSocket');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setWsStatus('disconnected');
      logger.info('WebSocket hook: disconnected', null, 'useWebSocket');
    };

    const handleError = (error) => {
      setWsStatus('error');
      logger.error('WebSocket hook: error', error, 'useWebSocket');
    };

    const handleReconnectFailed = () => {
      setWsStatus('reconnect_failed');
      logger.error('WebSocket hook: reconnect failed', null, 'useWebSocket');
    };

    webSocketService.on('connected', handleConnected);
    webSocketService.on('disconnected', handleDisconnected);
    webSocketService.on('error', handleError);
    webSocketService.on('reconnect_failed', handleReconnectFailed);

    return () => {
      webSocketService.off('connected', handleConnected);
      webSocketService.off('disconnected', handleDisconnected);
      webSocketService.off('error', handleError);
      webSocketService.off('reconnect_failed', handleReconnectFailed);
    };
  }, []);

  const sendMessage = useCallback((type, payload) => {
    if (isConnected) {
      webSocketService.send(type, payload);
    } else {
      logger.warn('WebSocket not connected, message not sent', null, 'useWebSocket');
    }
  }, [isConnected]);

  return {
    isConnected,
    wsStatus,
    sendMessage,
    subscribe: (event, handler) => webSocketService.on(event, handler),
    unsubscribe: (event, handler) => webSocketService.off(event, handler),
  };
};

export default useWebSocket;
