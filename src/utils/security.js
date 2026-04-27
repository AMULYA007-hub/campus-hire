/**
 * Security Utilities
 * Encryption, token management, and secure storage
 */

import CryptoJS from 'crypto-js';
import { config } from './config';
import { logger } from './logger';

export class SecurityManager {
  constructor() {
    this.secretKey = this.generateSecretKey();
  }

  // Generate a consistent secret key
  generateSecretKey() {
    const stored = localStorage.getItem('sk');
    if (stored) return stored;

    const key = CryptoJS.lib.WordArray.random(256 / 8).toString();
    localStorage.setItem('sk', key);
    return key;
  }

  // Encrypt data
  encrypt(data) {
    if (!config.security.encryptionEnabled) {
      return data;
    }

    try {
      const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
      logger.debug('Data encrypted', null, 'SecurityManager');
      return encrypted;
    } catch (error) {
      logger.error('Encryption failed', error, 'SecurityManager');
      throw error;
    }
  }

  // Decrypt data
  decrypt(encryptedData) {
    if (!config.security.encryptionEnabled) {
      return encryptedData;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      logger.error('Decryption failed', error, 'SecurityManager');
      throw error;
    }
  }

  // Hash password (for client-side validation only)
  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  // Generate token
  generateToken(payload, expiresIn = 3600) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn,
    };

    const encodedHeader = this.base64Encode(JSON.stringify(header));
    const encodedPayload = this.base64Encode(JSON.stringify(tokenPayload));
    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, this.secretKey).toString();

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Verify token
  verifyToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, payload, signature] = parts;
      const decodedPayload = JSON.parse(this.base64Decode(payload));

      // Check expiration
      if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return decodedPayload;
    } catch (error) {
      logger.error('Token verification failed', error, 'SecurityManager');
      return null;
    }
  }

  // Encode to base64
  base64Encode(str) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
  }

  // Decode from base64
  base64Decode(str) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(str));
  }

  // Secure storage
  secureSet(key, value) {
    try {
      const encrypted = this.encrypt(value);
      const storage = this.getStorage();
      storage.setItem(key, encrypted);
      logger.debug(`Secure set: ${key}`, null, 'SecurityManager');
    } catch (error) {
      logger.error(`Secure set failed for ${key}`, error, 'SecurityManager');
    }
  }

  secureGet(key) {
    try {
      const storage = this.getStorage();
      const encrypted = storage.getItem(key);
      if (!encrypted) return null;

      return this.decrypt(encrypted);
    } catch (error) {
      logger.error(`Secure get failed for ${key}`, error, 'SecurityManager');
      return null;
    }
  }

  secureRemove(key) {
    const storage = this.getStorage();
    storage.removeItem(key);
    logger.debug(`Secure remove: ${key}`, null, 'SecurityManager');
  }

  getStorage() {
    return config.isProduction ? sessionStorage : localStorage;
  }

  // Clear all secure data
  clearSecureStorage() {
    const storage = this.getStorage();
    const keysToRemove = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && (key.startsWith('secure_') || key.includes('token') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
    logger.info('Secure storage cleared', null, 'SecurityManager');
  }
}

export const securityManager = new SecurityManager();
export default securityManager;
