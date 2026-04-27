import React, { createContext, useState, useCallback, useEffect } from 'react';
import { securityManager } from '../utils/security';
import { logger } from '../utils/logger';
import { Validator, Sanitizer } from '../utils/validation';
import { webSocketService } from '../utils/websocket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      logger.error('Failed to load user from localStorage', error, 'AuthContext');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('registeredUsers');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      logger.error('Failed to load registered users', error, 'AuthContext');
      return [];
    }
  });

  // Get user profile data based on role
  const getUserProfile = (email, role) => {
    const profiles = {
      student: {
        roll: 'MCS-2023-001',
        avatar: 'https://via.placeholder.com/150/10b981/ffffff?text=Student',
        department: 'Computer Science',
        gpa: 3.8,
        skills: ['React', 'Node.js', 'Python', 'MongoDB'],
        applications: 0,
        applied: false,
      },
      employer: {
        company: 'Tech Solutions',
        avatar: 'https://via.placeholder.com/150/f59e0b/ffffff?text=Company',
        postedJobs: 0,
        activeApplications: 0,
        hires: 0,
      },
      officer: {
        avatar: 'https://via.placeholder.com/150/ef4444/ffffff?text=Officer',
        department: 'Placements',
        totalStudents: 450,
        placedStudents: 0,
        avgPackage: 0,
      },
      admin: {
        avatar: 'https://via.placeholder.com/150/2563eb/ffffff?text=Admin',
        permissions: ['manage_users', 'manage_jobs', 'manage_applications', 'view_reports'],
      },
    };
    return profiles[role] || {};
  };

  // Validate registration inputs
  const validateRegistration = (email, password, confirmPassword, role, fullName, phone) => {
    if (!email || !password || !confirmPassword || !role || !fullName || !phone) {
      return 'All fields are required';
    }

    const emailValidation = Validator.email(email);
    if (!emailValidation.valid) {
      return emailValidation.message;
    }

    const passwordValidation = Validator.password(password);
    if (!passwordValidation.valid) {
      return passwordValidation.message;
    }

    const matchValidation = Validator.match(password, confirmPassword, 'Passwords');
    if (!matchValidation.valid) {
      return matchValidation.message;
    }

    const phoneValidation = Validator.phone(phone);
    if (!phoneValidation.valid) {
      return phoneValidation.message;
    }

    //const nameValidation = Validator.name(fullName);
    if (!fullName || fullName.length < 2) return "Invalid Name"
    return null;
  };

  const register = useCallback(
    (email, password, confirmPassword, role, fullName, phone) => {
      return new Promise((resolve) => {
        setLoading(true);
        setError(null);

        setTimeout(() => {
          try {
            // Validate inputs
            const validationError = validateRegistration(email, password, confirmPassword, role, fullName, phone);
            if (validationError) {
              setError(validationError);
              logger.warn('Registration validation failed', { validationError }, 'AuthContext');
              setLoading(false);
              resolve(null);
              return;
            }

            // Sanitize inputs
            const sanitizedData = Sanitizer.sanitizeObject({
              email,
              fullName,
              phone,
            });

            // Check if email already exists
            if (registeredUsers.some((u) => u.email === sanitizedData.email)) {
              const err = 'Email already registered';
              setError(err);
              logger.warn('Registration failed: email already exists', { email: sanitizedData.email }, 'AuthContext');
              setLoading(false);
              resolve(null);
              return;
            }

            // Hash password securely
            const hashedPassword = securityManager.hashPassword(password);

            // Create new user
            const newUser = {
              id: Date.now().toString(),
              name: sanitizedData.fullName,
              email: sanitizedData.email,
              phone: sanitizedData.phone,
              role,
              ...getUserProfile(sanitizedData.email, role),
              createdAt: new Date().toISOString(),
              lastLogin: null,
              isActive: true,
            };

            // Save user securely (hash password, don't store plain password)
            const userToStore = {
              ...newUser,
              passwordHash: hashedPassword,
            };

            const updatedUsers = [...registeredUsers, userToStore];
            setRegisteredUsers(updatedUsers);
            localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

            logger.info('User registered successfully', { userId: newUser.id, email: newUser.email }, 'AuthContext');
            setLoading(false);
            resolve(newUser);
          } catch (err) {
            const errorMsg = err.message || 'Registration failed';
            setError(errorMsg);
            logger.error('Registration error', err, 'AuthContext');
            setLoading(false);
            resolve(null);
          }
        }, 1000);
      });
    },
    [registeredUsers]
  );

  const login = useCallback(
    (email, password, role) => {
      return new Promise((resolve) => {
        setLoading(true);
        setError(null);

        setTimeout(() => {
          try {
            // Validate inputs
            const emailValidation = Validator.email(email);
            if (!emailValidation.valid) {
              setError(emailValidation.message);
              setLoading(false);
              resolve(null);
              return;
            }

            // Find user in registered users
            const foundUser = registeredUsers.find(
              (u) => u.email === email && u.role === role && u.isActive !== false
            );

            if (!foundUser) {
              const err = 'Invalid email or role';
              setError(err);
              logger.warn('Login failed: user not found', { email, role }, 'AuthContext');
              setLoading(false);
              resolve(null);
              return;
            }

            // Verify password
            const hashedInput = securityManager.hashPassword(password);
            if (foundUser.passwordHash !== hashedInput && foundUser.password !== password) {
              const err = 'Invalid password';
              setError(err);
              logger.warn('Login failed: invalid password', { email }, 'AuthContext');
              setLoading(false);
              resolve(null);
              return;
            }

            // Generate auth token
            const token = securityManager.generateToken(
              { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
              3600 // 1 hour
            );

            // Prepare user data (without password)
            const { passwordHash, password: _, ...userData } = foundUser;
            const userSession = {
              ...userData,
              lastLogin: new Date().toISOString(),
            };

            // Store user session
            setUser(userSession);
            localStorage.setItem('user', JSON.stringify(userSession));
            localStorage.setItem('authToken', token);

            // Store auth token securely
            securityManager.secureSet('auth_token', token);

            logger.info('User logged in successfully', { userId: foundUser.id, email: foundUser.email }, 'AuthContext');

            // Connect WebSocket if enabled
            if (webSocketService) {
              webSocketService.connect(token).catch((err) => {
                logger.warn('WebSocket connection failed during login', err, 'AuthContext');
              });
            }

            setLoading(false);
            resolve(userSession);
          } catch (err) {
            const errorMsg = err.message || 'Login failed';
            setError(errorMsg);
            logger.error('Login error', err, 'AuthContext');
            setLoading(false);
            resolve(null);
          }
        }, 1000);
      });
    },
    [registeredUsers]
  );

  const logout = useCallback(() => {
    try {
      // Disconnect WebSocket
      if (webSocketService && webSocketService.isConnected()) {
        webSocketService.disconnect();
      }

      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      securityManager.clearSecureStorage();

      logger.info('User logged out', null, 'AuthContext');
    } catch (error) {
      logger.error('Logout error', error, 'AuthContext');
    }
  }, []);

  const updateProfile = useCallback(
    (updatedData) => {
      try {
        const sanitizedData = Sanitizer.sanitizeObject(updatedData);
        const updated = { ...user, ...sanitizedData };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));

        logger.info('User profile updated', { userId: user.id }, 'AuthContext');
      } catch (error) {
        logger.error('Profile update error', error, 'AuthContext');
      }
    },
    [user]
  );

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && user) {
      const verified = securityManager.verifyToken(token);
      if (!verified) {
        logger.warn('Stored token is invalid, logging out', null, 'AuthContext');
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        updateProfile,
        registeredUsers,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

