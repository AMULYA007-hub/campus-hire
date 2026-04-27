# Production Code Examples & Recipes

## Login with Validation

```javascript
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { ValidationRules } from '../utils/validation';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';

function LoginForm() {
  const { login, error: authError } = useContext(AuthContext);
  const { values, errors, handleChange, handleBlur, isSubmitting, handleSubmit } = useForm(
    { email: '', password: '', role: 'student' },
    async (formData) => {
      const result = await login(formData.email, formData.password, formData.role);
      if (!result) {
        throw new Error('Login failed');
      }
    },
    {
      email: { required: true, pattern: ValidationRules.email },
      password: { required: true, pattern: ValidationRules.password }
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      {isSubmitting && <LoadingSpinner />}
      {authError && <div className="error">{authError}</div>}
      
      <input
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Password"
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
```

---

## API Call with Loading States

```javascript
import { useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';
import { LoadingSpinner, SkeletonLoader } from '../components/Common/LoadingSpinner';

function JobsList() {
  const { data: jobs, loading, error, get } = useAPI([]);

  useEffect(() => {
    get('/jobs');
  }, []);

  if (loading) return <SkeletonLoader count={5} />;
  
  if (error) return <div className="error">Failed to load jobs: {error}</div>;
  
  return (
    <div>
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.salary}</p>
        </div>
      ))}
    </div>
  );
}

export default JobsList;
```

---

## Form Submission with Error Handling

```javascript
import { useForm } from '../hooks/useForm';
import { apiService } from '../utils/apiService';
import { ValidationRules, Sanitizer } from '../utils/validation';
import { logger } from '../utils/logger';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';

function JobPostingForm() {
  const { values, errors, isSubmitting, handleChange, handleSubmit, submitError } = useForm(
    {
      title: '',
      description: '',
      salary: '',
      location: '',
      skills: ''
    },
    async (formData) => {
      try {
        // Sanitize inputs
        const sanitized = Sanitizer.sanitizeObject(formData);
        
        // Submit to API
        const response = await apiService.post('/jobs', sanitized);
        
        logger.info('Job posted successfully', { jobId: response.data.id }, 'JobForm');
        
        // Show success message or redirect
        window.alert('Job posted successfully!');
      } catch (error) {
        logger.error('Job posting failed', error, 'JobForm');
        throw new Error('Failed to post job');
      }
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      {isSubmitting && <LoadingSpinner message="Posting job..." />}
      {submitError && <div className="error">{submitError}</div>}

      <input
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Job Title"
      />
      {errors.title && <span className="error">{errors.title}</span>}

      <textarea
        name="description"
        value={values.description}
        onChange={handleChange}
        placeholder="Job Description"
      />

      <button type="submit" disabled={isSubmitting}>
        Post Job
      </button>
    </form>
  );
}

export default JobPostingForm;
```

---

## Real-time Notifications with WebSocket

```javascript
import { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { logger } from '../utils/logger';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const { isConnected, wsStatus } = useWebSocket('notification', (data) => {
    logger.info('New notification received', data, 'NotificationCenter');
    setNotifications(prev => [data, ...prev]);
  });

  const handleNotificationClick = (notificationId) => {
    // Send WebSocket message to mark as read
    // wsService.send('notification_read', { id: notificationId });
  };

  return (
    <div className="notification-center">
      <div className="status">
        Status: {isConnected ? '🟢 Connected' : '🔴 ' + wsStatus}
      </div>

      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className="notification" onClick={() => handleNotificationClick(notif.id)}>
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
            <time>{new Date(notif.timestamp).toLocaleTimeString()}</time>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationCenter;
```

---

## Cache API Response

```javascript
import { useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';
import { useCache } from '../hooks/useCache';
import { logger } from '../utils/logger';

function UserProfile({ userId }) {
  const { data: user, get } = useAPI();
  const { cached, set, invalidate } = useCache(`user_${userId}`, 10 * 60 * 1000);

  useEffect(() => {
    // Check cache first
    if (cached) {
      logger.debug('Loading user from cache', null, 'UserProfile');
      // Set data from cache
      return;
    }

    // Fetch from API if not cached
    get(`/users/${userId}`).then(response => {
      if (response.success) {
        set(response.data);
      }
    });
  }, [userId]);

  const handleProfileUpdate = async (updatedData) => {
    await fetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    });
    
    // Invalidate cache after update
    invalidate();
  };

  return (
    <div>
      {user && (
        <>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={() => handleProfileUpdate({name: 'New Name'})}>
            Update Profile
          </button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
```

---

## Error Handling & Logging

```javascript
import { useEffect } from 'react';
import { apiService } from '../utils/apiService';
import { ErrorHandler } from '../utils/errorHandler';
import { logger } from '../utils/logger';

function DataFetcher() {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiService.get('/data');
      
      if (response.success) {
        logger.info('Data fetched successfully', null, 'DataFetcher');
        // Process data
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // Handle error
      const handled = ErrorHandler.handle(error, 'DataFetcher');
      const userMessage = ErrorHandler.getUserMessage(handled);
      
      logger.error('Data fetch failed', handled, 'DataFetcher');
      
      // Show user-friendly message
      alert(userMessage);
    }
  };

  return <div>Loading data...</div>;
}

export default DataFetcher;
```

---

## Batch API Calls

```javascript
import { useEffect } from 'react';
import { apiService } from '../utils/apiService';
import { logger } from '../utils/logger';

function Dashboard() {
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch multiple resources in parallel
      const results = await apiService.batch([
        apiService.get('/jobs'),
        apiService.get('/applications'),
        apiService.get('/placements'),
        apiService.get('/analytics')
      ]);

      const [jobsRes, applicationsRes, placementsRes, analyticsRes] = results;

      const data = {
        jobs: jobsRes.status === 'fulfilled' ? jobsRes.value.data : [],
        applications: applicationsRes.status === 'fulfilled' ? applicationsRes.value.data : [],
        placements: placementsRes.status === 'fulfilled' ? placementsRes.value.data : [],
        analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : {}
      };

      logger.info('Dashboard data loaded', null, 'Dashboard');
      // Update state with data
    } catch (error) {
      logger.error('Dashboard load error', error, 'Dashboard');
    }
  };

  return <div>Dashboard Content</div>;
}

export default Dashboard;
```

---

## Secure Token Management

```javascript
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { securityManager } from '../utils/security';
import { apiService } from '../utils/apiService';
import { logger } from '../utils/logger';

function AppInit() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setupSecureSession();
    }
  }, [user]);

  const setupSecureSession = async () => {
    try {
      // Get stored auth token
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Verify token is still valid
        const payload = securityManager.verifyToken(token);
        
        if (payload) {
          logger.info('Valid session token verified', null, 'AppInit');
          // Set auth token for API calls
          apiService.setAuthToken(token);
        } else {
          logger.warn('Stored token is invalid, clearing session', null, 'AppInit');
          securityManager.clearSecureStorage();
        }
      }
    } catch (error) {
      logger.error('Session setup error', error, 'AppInit');
    }
  };

  return <div>App Initialized</div>;
}

export default AppInit;
```

---

## Custom Error Component

```javascript
import { useMemo } from 'react';
import { ErrorHandler } from '../utils/errorHandler';
import { logger } from '../utils/logger';

function ErrorDisplay({ error, context = 'Unknown' }) {
  const errorInfo = useMemo(() => {
    if (!error) return null;
    
    const handled = ErrorHandler.handle(error, context);
    const userMessage = ErrorHandler.getUserMessage(handled);
    
    return { handled, userMessage };
  }, [error, context]);

  if (!errorInfo) return null;

  const retry = () => {
    logger.info('User clicked retry', null, 'ErrorDisplay');
    window.location.reload();
  };

  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{errorInfo.userMessage}</p>
      
      {process.env.NODE_ENV === 'development' && (
        <details>
          <summary>Error Details</summary>
          <pre>{JSON.stringify(errorInfo.handled, null, 2)}</pre>
        </details>
      )}
      
      <button onClick={retry}>Try Again</button>
    </div>
  );
}

export default ErrorDisplay;
```

---

## Data Caching Optimization

```javascript
import { useEffect } from 'react';
import { cacheManager } from '../utils/cache';
import { apiService } from '../utils/apiService';
import { logger } from '../utils/logger';

function OptimizedJobsList() {
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const cacheKey = 'GET_/jobs';
    
    // Check if data is in cache
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      logger.info('Using cached jobs data', null, 'JobsList');
      // Use cached data
      return cached;
    }

    // Fetch from API
    const response = await apiService.get('/jobs');
    
    if (response.success) {
      // Cache the response for 10 minutes
      cacheManager.set(cacheKey, response.data, 10 * 60 * 1000);
      logger.info('Jobs cached for future use', null, 'JobsList');
    }
    
    return response.data;
  };

  const handleJobUpdate = async (jobId, updates) => {
    // Update on server
    await apiService.put(`/jobs/${jobId}`, updates);
    
    // Invalidate related caches
    cacheManager.delete('GET_/jobs');
    cacheManager.delete(`GET_/jobs/${jobId}`);
    
    logger.info('Job caches invalidated after update', { jobId }, 'JobsList');
  };

  return <div>Jobs List Component</div>;
}

export default OptimizedJobsList;
```

---

These examples demonstrate production-ready patterns for your Campus Hire application!
