import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Users, Archive, Briefcase, TrendingUp } from 'lucide-react';
import { useData } from '../../hooks/useData';
import JobCard from './JobCard';
import StudentProfile from './StudentProfile';
import AdvancedSearch from '../Common/AdvancedSearch';
import EmailNotifications from '../Common/EmailNotifications';
import '../../styles/student-dashboard.css';

export default function StudentDashboard({ user, view = 'dashboard' }) {
  const { jobs, applications } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [viewType, setViewType] = useState('explore'); // explore or applications

  const defaultFiltered = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !filterSkill || job.skills.includes(filterSkill);
    return matchesSearch && matchesSkill;
  });

  const applicationsCount = applications.length;
  const appliedCount = applications.filter(app => app.status === 'applied').length;
  const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;

  const allSkills = [...new Set(jobs.flatMap(job => job.skills))];

  // Render different views based on sidebar selection
  if (view === 'profile') {
    return <StudentProfile user={user} onUpdate={(updatedUser) => console.log(updatedUser)} />;
  }

  if (view === 'notifications') {
    return <EmailNotifications user={user} />;
  }

  if (view === 'advanced-search') {
    return <AdvancedSearch jobs={jobs} onSearch={setFilteredJobs} />;
  }

  // Default: Dashboard view
  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Explore job opportunities and track your applications</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{applicationsCount}</p>
              <p className="stat-label">Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{shortlistedCount}</p>
              <p className="stat-label">Shortlisted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{jobs.length}</p>
              <p className="stat-label">Open Positions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${viewType === 'explore' ? 'active' : ''}`}
          onClick={() => setViewType('explore')}
        >
          <Briefcase size={18} />
          Explore Jobs
        </button>
        <button 
          className={`tab-btn ${viewType === 'applications' ? 'active' : ''}`}
          onClick={() => setViewType('applications')}
        >
          <Archive size={18} />
          My Applications ({applicationsCount})
        </button>
      </div>

      {viewType === 'explore' ? (
        <div className="jobs-section">
          <div className="search-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="filter-select"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div className="jobs-grid">
            {defaultFiltered.length > 0 ? (
              defaultFiltered.map(job => (
                <JobCard key={job.id} job={job} user={user} />
              ))
            ) : (
              <div className="empty-state">
                <Search size={48} />
                <h3>No jobs found</h3>
                <p>Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="applications-section">
          {applications.length > 0 ? (
            <div className="applications-list">
              {applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="application-item">
                    <div className="app-header">
                      <div className="app-job-info">
                        <h3>{job?.title}</h3>
                        <p>{job?.company}</p>
                      </div>
                      <span className={`app-status badge-${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="app-details">
                      <p><strong>Applied:</strong> {app.date}</p>
                      <p><strong>Salary:</strong> {job?.salary}</p>
                      <p><strong>Location:</strong> {job?.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Archive size={48} />
              <h3>No applications yet</h3>
              <p>Start exploring jobs to apply</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


