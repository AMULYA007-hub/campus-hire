/**
 * Custom Hook for API Calls
 * Handles loading, error, and success states
 */

import { useState, useCallback } from 'react';
import { apiService } from '../utils/apiService';
import { logger } from '../utils/logger';

export const useAPI = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (method, url, payload = null, config = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService[method.toLowerCase()](url, payload, config);

        if (response.success) {
          setData(response.data);
          logger.info(`API call successful: ${method} ${url}`, null, 'useAPI');
          return response;
        } else {
          throw new Error(response.message || 'API request failed');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        logger.error(`API call failed: ${method} ${url}`, { error: errorMessage }, 'useAPI');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback((url, config = {}) => request('GET', url, null, config), [request]);
  const post = useCallback((url, payload, config = {}) => request('POST', url, payload, config), [request]);
  const put = useCallback((url, payload, config = {}) => request('PUT', url, payload, config), [request]);
  const patch = useCallback((url, payload, config = {}) => request('PATCH', url, payload, config), [request]);
  const del = useCallback((url, config = {}) => request('DELETE', url, null, config), [request]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
    setData,
    setError,
  };
};

export default useAPI;
