import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [];
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
        applied: false
      },
      employer: {
        company: 'Tech Solutions',
        avatar: 'https://via.placeholder.com/150/f59e0b/ffffff?text=Company',
        postedJobs: 0,
        activeApplications: 0,
        hires: 0
      },
      officer: {
        avatar: 'https://via.placeholder.com/150/ef4444/ffffff?text=Officer',
        department: 'Placements',
        totalStudents: 450,
        placedStudents: 0,
        avgPackage: 0
      },
      admin: {
        avatar: 'https://via.placeholder.com/150/2563eb/ffffff?text=Admin',
        permissions: ['manage_users', 'manage_jobs', 'manage_applications', 'view_reports']
      }
    };
    return profiles[role] || {};
  };

  const register = useCallback((email, password, confirmPassword, role, fullName, phone) => {
    return new Promise((resolve) => {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          // Validation
          if (!email || !password || !confirmPassword || !role || !fullName || !phone) {
            setError('All fields are required');
            setLoading(false);
            resolve(null);
            return;
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email format');
            setLoading(false);
            resolve(null);
            return;
          }

          if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            resolve(null);
            return;
          }

          if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            resolve(null);
            return;
          }

          // Check if email already exists
          if (registeredUsers.some(u => u.email === email)) {
            setError('Email already registered');
            setLoading(false);
            resolve(null);
            return;
          }

          // Create new user
          const newUser = {
            id: Date.now().toString(),
            name: fullName,
            email,
            phone,
            password,
            role,
            ...getUserProfile(email, role),
            createdAt: new Date().toISOString()
          };

          // Save to registered users
          const updatedUsers = [...registeredUsers, newUser];
          setRegisteredUsers(updatedUsers);
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

          setLoading(false);
          resolve(newUser);
        } catch (err) {
          setError(err.message);
          setLoading(false);
          resolve(null);
        }
      }, 1000);
    });
  }, [registeredUsers]);

  const login = useCallback((email, password, role) => {
    return new Promise((resolve) => {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          // Find user in registered users
          const foundUser = registeredUsers.find(
            u => u.email === email && u.password === password && u.role === role
          );

          if (foundUser) {
            const { password: _, ...userData } = foundUser; // Don't store password in user state
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setLoading(false);
            resolve(userData);
          } else {
            setError('Invalid email, password, or role');
            setLoading(false);
            resolve(null);
          }
        } catch (err) {
          setError(err.message);
          setLoading(false);
          resolve(null);
        }
      }, 1000);
    });
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateProfile = useCallback((updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register, updateProfile, registeredUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
