/**
 * Custom Hook for Local Cache
 * Manages component-level caching
 */

import { useState, useCallback, useEffect } from 'react';
import { cacheManager } from '../utils/cache';

export const useCache = (key, ttl = 5 * 60 * 1000) => {
  const [cached, setCached] = useState(null);

  useEffect(() => {
    const value = cacheManager.get(key);
    if (value) {
      setCached(value);
    }
  }, [key]);

  const set = useCallback(
    (value) => {
      cacheManager.set(key, value, ttl);
      setCached(value);
    },
    [key, ttl]
  );

  const get = useCallback(() => {
    return cacheManager.get(key);
  }, [key]);

  const invalidate = useCallback(() => {
    cacheManager.delete(key);
    setCached(null);
  }, [key]);

  return {
    cached,
    set,
    get,
    invalidate,
  };
};

export default useCache;
