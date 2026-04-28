import React, { createContext, useState, useCallback, useEffect } from 'react';
import { cacheManager } from '../utils/cache';
import { logger } from '../utils/logger';
import { apiService } from '../utils/apiService';
import { config } from '../utils/config';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      salary: '12-15 LPA',
      location: 'Bangalore',
      description: 'Looking for experienced React developers with strong TypeScript knowledge.',
      skills: ['React', 'TypeScript', 'Node.js'],
      posted: '2024-02-20',
      deadline: '2024-03-20',
      applicants: 45,
      status: 'active',
      logo: 'https://via.placeholder.com/100/2563eb/ffffff?text=TechCorp',
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'CloudNine',
      salary: '10-12 LPA',
      location: 'Pune',
      description: 'Join our team to build scalable cloud applications.',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      posted: '2024-02-18',
      deadline: '2024-03-18',
      applicants: 32,
      status: 'active',
      logo: 'https://via.placeholder.com/100/f59e0b/ffffff?text=CloudNine',
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'DataSoft',
      salary: '11-13 LPA',
      location: 'Hyderabad',
      description: 'Experienced developer needed for distributed systems.',
      skills: ['Python', 'Java', 'PostgreSQL', 'Docker'],
      posted: '2024-02-15',
      deadline: '2024-03-15',
      applicants: 28,
      status: 'active',
      logo: 'https://via.placeholder.com/100/10b981/ffffff?text=DataSoft',
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'CloudInfra',
      salary: '13-16 LPA',
      location: 'Mumbai',
      description: 'Manage and optimize cloud infrastructure.',
      skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD'],
      posted: '2024-02-10',
      deadline: '2024-03-10',
      applicants: 18,
      status: 'active',
      logo: 'https://via.placeholder.com/100/ef4444/ffffff?text=CloudInfra',
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'AI Labs',
      salary: '14-17 LPA',
      location: 'Bangalore',
      description: 'Work on cutting-edge ML and AI projects.',
      skills: ['Python', 'TensorFlow', 'Data Analysis', 'SQL'],
      posted: '2024-02-05',
      deadline: '2024-03-05',
      applicants: 56,
      status: 'active',
      logo: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=AILabs',
    },
  ];

  const loadStoredUsers = () => {
    try {
      const saved = localStorage.getItem('registeredUsers');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      logger.error('Failed to load stored users', error, 'DataContext');
      return [];
    }
  };

  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.info('DataContext: attempting backend load from', config.api.baseURL);

        // Load jobs
        try {
          const jobsResponse = await apiService.get('/jobs');
          setJobs(jobsResponse.data || []);
        } catch (err) {
          logger.warn('Failed to load jobs from backend, using mock data', err, 'DataContext');
          setJobs(mockJobs);
        }

        // Load users
        try {
          const usersResponse = await apiService.get('/users');
          setUsers(usersResponse.data || []);
        } catch (err) {
          logger.warn('Failed to load users from backend, using localStorage', err, 'DataContext');
          setUsers(loadStoredUsers());
        }

        // Load applications
        try {
          const applicationsResponse = await apiService.get('/applications');
          setApplications(applicationsResponse.data || []);
        } catch (err) {
          logger.warn('Failed to load applications from backend, using mock data', err, 'DataContext');
          setApplications([
            { id: 1, studentId: 2, jobId: 1, status: 'applied', date: '2024-02-21', resume: 'resume.pdf', coverLetter: '' },
            { id: 2, studentId: 2, jobId: 2, status: 'shortlisted', date: '2024-02-22', resume: 'resume.pdf', coverLetter: '' },
            { id: 3, studentId: 2, jobId: 3, status: 'rejected', date: '2024-02-19', resume: 'resume.pdf', coverLetter: '' },
          ]);
        }

        // Load placements
        try {
          const placementsResponse = await apiService.get('/placements');
          setPlacements(placementsResponse.data || []);
        } catch (err) {
          logger.warn('Failed to load placements from backend, using mock data', err, 'DataContext');
          setPlacements([
            { id: 1, studentName: 'Ahmed Hassan', companyName: 'Tech Corp', position: 'Senior Developer', salary: '14 LPA', date: '2024-02-20' },
            { id: 2, studentName: 'Neha Sharma', companyName: 'CloudNine', position: 'Full Stack Developer', salary: '11 LPA', date: '2024-02-19' },
          ]);
        }

      } catch (err) {
        logger.error('Failed to load data from backend', err, 'DataContext');
        setError('Failed to connect to backend. Using offline mode.');
        // Fallback to mock data
        setJobs(mockJobs);
        setUsers(loadStoredUsers());
        setApplications([
          { id: 1, studentId: 2, jobId: 1, status: 'applied', date: '2024-02-21', resume: 'resume.pdf', coverLetter: '' },
          { id: 2, studentId: 2, jobId: 2, status: 'shortlisted', date: '2024-02-22', resume: 'resume.pdf', coverLetter: '' },
          { id: 3, studentId: 2, jobId: 3, status: 'rejected', date: '2024-02-19', resume: 'resume.pdf', coverLetter: '' },
        ]);
        setPlacements([
          { id: 1, studentName: 'Ahmed Hassan', companyName: 'Tech Corp', position: 'Senior Developer', salary: '14 LPA', date: '2024-02-20' },
          { id: 2, studentName: 'Neha Sharma', companyName: 'CloudNine', position: 'Full Stack Developer', salary: '11 LPA', date: '2024-02-19' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Cache jobs on initial load
  useEffect(() => {
    cacheManager.set('all_jobs', jobs, 10 * 60 * 1000); // Cache for 10 minutes
    logger.debug('Jobs cached', null, 'DataContext');
  }, [jobs]);

  // Cache applications
  useEffect(() => {
    cacheManager.set('all_applications', applications, 5 * 60 * 1000); // Cache for 5 minutes
    logger.debug('Applications cached', null, 'DataContext');
  }, [applications]);

  const addJob = useCallback(
    async (jobData) => {
      try {
        const response = await apiService.post('/jobs', jobData);
        const newJob = response.data;
        setJobs(prev => [newJob, ...prev]);
        cacheManager.delete('all_jobs'); // Invalidate cache
        logger.info('Job added successfully', { jobId: newJob.id }, 'DataContext');
        return newJob;
      } catch (error) {
        logger.error('Failed to add job via API, falling back to local', error, 'DataContext');
        // Fallback to local operation
        return new Promise((resolve) => {
          setJobs(prev => {
            const newJob = {
              id: Math.max(...prev.map((j) => j.id), 0) + 1,
              ...jobData,
              posted: new Date().toISOString().split('T')[0],
              applicants: 0,
              status: 'active',
              logo: 'https://via.placeholder.com/100/2563eb/ffffff?text=' + jobData.company.substring(0, 3).toUpperCase(),
            };
            cacheManager.delete('all_jobs');
            logger.info('Job added locally (fallback)', { jobId: newJob.id }, 'DataContext');
            resolve(newJob);
            return [newJob, ...prev];
          });
        });
      }
    },
    []
  );

  const updateJob = useCallback(
    (id, jobData) => {
      try {
        setJobs(prev => prev.map((job) => (job.id === id ? { ...job, ...jobData } : job)));
        cacheManager.delete('all_jobs'); // Invalidate cache
        logger.info('Job updated successfully', { jobId: id }, 'DataContext');
      } catch (error) {
        logger.error('Failed to update job', error, 'DataContext');
        throw error;
      }
    },
    []
  );

  const deleteJob = useCallback(
    async (id) => {
      try {
        await apiService.delete(`/jobs/${id}`);
        setJobs(prev => prev.filter((job) => job.id !== id));
        cacheManager.delete('all_jobs'); // Invalidate cache
        logger.info('Job deleted successfully', { jobId: id }, 'DataContext');
      } catch (error) {
        logger.error('Failed to delete job via API, falling back to local', error, 'DataContext');
        // Fallback to local operation
        setJobs(prev => prev.filter((job) => job.id !== id));
        cacheManager.delete('all_jobs');
        logger.info('Job deleted locally (fallback)', { jobId: id }, 'DataContext');
      }
    },
    []
  );

  const applyJob = useCallback(
    async (jobId, studentData) => {
      try {
        const response = await apiService.post('/applications', {
          jobId,
          studentId: studentData.id,
          resume: studentData.resume,
          coverLetter: studentData.coverLetter || ''
        });
        const newApplication = response.data;
        setApplications((prev) => [newApplication, ...prev]);
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, applicants: job.applicants + 1 } : job))
        );
        cacheManager.delete('all_applications');
        logger.info('Job application submitted', { applicationId: newApplication.id, jobId }, 'DataContext');
        return newApplication;
      } catch (error) {
        logger.error('Failed to apply for job via API, falling back to local', error, 'DataContext');
        // Fallback to local operation
        return new Promise((resolve, reject) => {
          try {
            setTimeout(() => {
              let newApplication;
              setApplications((prev) => {
                newApplication = {
                  id: Math.max(...prev.map((a) => a.id), 0) + 1,
                  studentId: studentData.id,
                  jobId,
                  status: 'applied',
                  date: new Date().toISOString().split('T')[0],
                  resume: studentData.resume,
                  coverLetter: studentData.coverLetter || '',
                };
                return [newApplication, ...prev];
              });
              setJobs((prev) =>
                prev.map((job) => (job.id === jobId ? { ...job, applicants: job.applicants + 1 } : job))
              );
              cacheManager.delete('all_applications');
              logger.info('Job application submitted locally (fallback)', { applicationId: newApplication.id, jobId }, 'DataContext');
              resolve(newApplication);
            }, 500);
          } catch (error) {
            logger.error('Failed to apply for job locally', error, 'DataContext');
            reject(error);
          }
        });
      }
    },
    []
  );

  const updateApplicationStatus = useCallback(
    async (id, status) => {
      try {
        await apiService.put(`/applications/${id}/status`, { status });
        setApplications(prev => prev.map((app) => (app.id === id ? { ...app, status } : app)));
        cacheManager.delete('all_applications'); // Invalidate cache
        logger.info('Application status updated', { applicationId: id, status }, 'DataContext');
      } catch (error) {
        logger.error('Failed to update application status via API, falling back to local', error, 'DataContext');
        // Fallback to local operation
        setApplications(prev => prev.map((app) => (app.id === id ? { ...app, status } : app)));
        cacheManager.delete('all_applications');
        logger.info('Application status updated locally (fallback)', { applicationId: id, status }, 'DataContext');
      }
    },
    []
  );

  const addPlacement = useCallback(
    async (placementData) => {
      try {
        const response = await apiService.post('/placements', placementData);
        const newPlacement = response.data;
        setPlacements((prev) => [newPlacement, ...prev]);
        cacheManager.delete('all_placements'); // Invalidate cache
        logger.info('Placement added successfully', { placementId: newPlacement.id }, 'DataContext');
        return newPlacement;
      } catch (error) {
        logger.error('Failed to add placement via API, falling back to local', error, 'DataContext');
        // Fallback to local operation
        return new Promise((resolve, reject) => {
          try {
            setTimeout(() => {
              let newPlacement;
              setPlacements((prev) => {
                newPlacement = {
                  id: Math.max(...(prev.length > 0 ? prev.map((p) => p.id) : [0]), 0) + 1,
                  ...placementData,
                  date: new Date().toISOString().split('T')[0],
                };
                cacheManager.delete('all_placements');
                logger.info('Placement added locally (fallback)', { placementId: newPlacement.id }, 'DataContext');
                resolve(newPlacement);
                return [newPlacement, ...prev];
              });
            }, 300);
          } catch (error) {
            logger.error('Failed to add placement locally', error, 'DataContext');
            reject(error);
          }
        });
      }
    },
    []
  );

  const addUser = useCallback(
    (userData) => {
      try {
        let newUser;
        setUsers((prev) => {
          newUser = {
            id: Math.max(...prev.map((u) => u.id), 0) + 1,
            ...userData,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
          };
          const updated = [newUser, ...prev];
          localStorage.setItem('registeredUsers', JSON.stringify(updated));
          logger.info('User added successfully', { userId: newUser.id }, 'DataContext');
          return updated;
        });
        return newUser;
      } catch (error) {
        logger.error('Failed to add user', error, 'DataContext');
        throw error;
      }
    },
    []
  );

  const deleteUser = useCallback(
    (id) => {
      try {
        setUsers(prev => prev.filter((user) => user.id !== id));
        logger.info('User deleted successfully', { userId: id }, 'DataContext');
      } catch (error) {
        logger.error('Failed to delete user', error, 'DataContext');
        throw error;
      }
    },
    []
  );

  const value = {
    jobs,
    users,
    applications,
    placements,
    loading,
    error,
    addJob,
    updateJob,
    deleteJob,
    applyJob,
    updateApplicationStatus,
    addPlacement,
    addUser,
    deleteUser,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
