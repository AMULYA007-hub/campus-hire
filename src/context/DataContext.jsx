import React, { createContext, useState, useCallback } from 'react';

export const DataContext = createContext();

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
    logo: 'https://via.placeholder.com/100/2563eb/ffffff?text=TechCorp'
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
    logo: 'https://via.placeholder.com/100/f59e0b/ffffff?text=CloudNine'
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
    logo: 'https://via.placeholder.com/100/10b981/ffffff?text=DataSoft'
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
    logo: 'https://via.placeholder.com/100/ef4444/ffffff?text=CloudInfra'
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
    logo: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=AILabs'
  }
];

const mockUsers = [
  { id: 1, name: 'Raj Kumar', email: 'raj@campus.com', role: 'student', status: 'active', joinDate: '2023-01-15' },
  { id: 2, name: 'Priya Singh', email: 'priya@campus.com', role: 'student', status: 'active', joinDate: '2023-01-16' },
  { id: 3, name: 'Tech Corp', email: 'recruiter@techcorp.com', role: 'employer', status: 'active', joinDate: '2024-01-01' },
  { id: 4, name: 'CloudNine', email: 'recruiter@cloudnine.com', role: 'employer', status: 'active', joinDate: '2024-01-02' },
];

export const DataProvider = ({ children }) => {
  const [jobs, setJobs] = useState(mockJobs);
  const [users, setUsers] = useState(mockUsers);
  const [applications, setApplications] = useState([
    { id: 1, studentId: 2, jobId: 1, status: 'applied', date: '2024-02-21', resume: 'resume.pdf' },
    { id: 2, studentId: 2, jobId: 2, status: 'shortlisted', date: '2024-02-22', resume: 'resume.pdf' },
    { id: 3, studentId: 2, jobId: 3, status: 'rejected', date: '2024-02-19', resume: 'resume.pdf' },
  ]);
  const [placements, setPlacements] = useState([
    { id: 1, studentName: 'Ahmed Hassan', companyName: 'Tech Corp', position: 'Senior Developer', salary: '14 LPA', date: '2024-02-20' },
    { id: 2, studentName: 'Neha Sharma', companyName: 'CloudNine', position: 'Full Stack Developer', salary: '11 LPA', date: '2024-02-19' },
  ]);

  const addJob = useCallback((jobData) => {
    const newJob = {
      id: Math.max(...jobs.map(j => j.id), 0) + 1,
      ...jobData,
      posted: new Date().toISOString().split('T')[0],
      applicants: 0,
      status: 'active',
      logo: 'https://via.placeholder.com/100/2563eb/ffffff?text=' + jobData.company.substring(0, 3).toUpperCase()
    };
    setJobs([newJob, ...jobs]);
    return newJob;
  }, [jobs]);

  const updateJob = useCallback((id, jobData) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...jobData } : job));
  }, [jobs]);

  const deleteJob = useCallback((id) => {
    setJobs(jobs.filter(job => job.id !== id));
  }, [jobs]);

  const applyJob = useCallback((jobId, studentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newApplication = {
          id: Math.max(...applications.map(a => a.id), 0) + 1,
          studentId: studentData.id,
          jobId,
          status: 'applied',
          date: new Date().toISOString().split('T')[0],
          resume: studentData.resume
        };
        setApplications(prev => [newApplication, ...prev]);
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, applicants: job.applicants + 1 } : job
        ));
        resolve(newApplication);
      }, 500);
    });
  }, [applications, jobs]);

  const updateApplicationStatus = useCallback((id, status) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  }, [applications]);

  const addPlacement = useCallback((placementData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlacement = {
          id: Math.max(...(placements.length > 0 ? placements.map(p => p.id) : [0]), 0) + 1,
          ...placementData,
          date: new Date().toISOString().split('T')[0]
        };
        setPlacements(prev => [newPlacement, ...prev]);
        resolve(newPlacement);
      }, 300);
    });
  }, [placements]);

  const addUser = useCallback((userData) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...userData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers([newUser, ...users]);
    return newUser;
  }, [users]);

  const deleteUser = useCallback((id) => {
    setUsers(users.filter(user => user.id !== id));
  }, [users]);

  return (
    <DataContext.Provider value={{
      jobs,
      users,
      applications,
      placements,
      addJob,
      updateJob,
      deleteJob,
      applyJob,
      updateApplicationStatus,
      addPlacement,
      addUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
};
