/**
 * Data Caching Utility
 * Implements in-memory and localStorage caching with TTL support
 */

import { logger } from './logger';

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.cacheConfig = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
    };
  }

  /**
   * Set cache with TTL
   */
  set(key, value, ttl = this.cacheConfig.defaultTTL) {
    const cacheEntry = {
      value,
      timestamp: Date.now(),
      ttl,
      expiresAt: Date.now() + ttl,
    };

    this.memoryCache.set(key, cacheEntry);

    // Cleanup old entries if cache is too large
    if (this.memoryCache.size > this.cacheConfig.maxSize) {
      this.cleanup();
    }

    logger.debug(`Cache set: ${key}`, null, 'CacheManager');
  }

  /**
   * Get value from cache
   */
  get(key) {
    const entry = this.memoryCache.get(key);

    if (!entry) {
      logger.debug(`Cache miss: ${key}`, null, 'CacheManager');
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      logger.debug(`Cache expired: ${key}`, null, 'CacheManager');
      return null;
    }

    logger.debug(`Cache hit: ${key}`, null, 'CacheManager');
    return entry.value;
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key
   */
  delete(key) {
    this.memoryCache.delete(key);
    logger.debug(`Cache deleted: ${key}`, null, 'CacheManager');
  }

  /**
   * Clear all cache
   */
  clear() {
    this.memoryCache.clear();
    logger.info('Cache cleared', null, 'CacheManager');
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expiresAt) {
        this.memoryCache.delete(key);
        removed++;
      }
    }

    logger.debug(`Cache cleanup: removed ${removed} entries`, null, 'CacheManager');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const stats = {
      totalEntries: this.memoryCache.size,
      maxSize: this.cacheConfig.maxSize,
      entries: [],
    };

    for (const [key, entry] of this.memoryCache.entries()) {
      const isExpired = Date.now() > entry.expiresAt;
      stats.entries.push({
        key,
        size: JSON.stringify(entry.value).length,
        isExpired,
        expiresIn: Math.max(0, entry.expiresAt - Date.now()),
      });
    }

    return stats;
  }

  /**
   * Get cache as formatted string
   */
  export() {
    const exported = {};
    for (const [key, entry] of this.memoryCache.entries()) {
      exported[key] = {
        value: entry.value,
        expiresAt: entry.expiresAt,
      };
    }
    return JSON.stringify(exported, null, 2);
  }
}

/**
 * API Response Cache Decorator
 * Caches API responses automatically
 */
export class CachedAPIResponse {
  constructor(apiService, cacheManager) {
    this.apiService = apiService;
    this.cacheManager = cacheManager;
  }

  async get(url, options = {}) {
    const { cached = true, ttl = 5 * 60 * 1000 } = options;
    const cacheKey = `GET_${url}`;

    if (cached) {
      const cached = this.cacheManager.get(cacheKey);
      if (cached) {
        logger.debug(`Using cached response for ${url}`, null, 'CachedAPI');
        return cached;
      }
    }

    const response = await this.apiService.get(url);

    if (cached && response.success) {
      this.cacheManager.set(cacheKey, response, ttl);
    }

    return response;
  }

  invalidate(pattern) {
    for (const [key] of this.cacheManager.memoryCache.entries()) {
      if (key.includes(pattern)) {
        this.cacheManager.delete(key);
      }
    }
    logger.info(`Cache invalidated for pattern: ${pattern}`, null, 'CachedAPI');
  }
}

export const cacheManager = new CacheManager();
export default cacheManager;
