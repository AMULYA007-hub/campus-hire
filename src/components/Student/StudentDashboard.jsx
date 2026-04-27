import React, { useEffect, useState } from 'react';
import { getStudents } from '../../services/api'; // Removed duplicate import
import { Search, Users, Archive, Briefcase, TrendingUp } from 'lucide-react';
import { useData } from '../../hooks/useData';
import JobCard from './JobCard';
import StudentProfile from './StudentProfile';
import AdvancedSearch from '../Common/AdvancedSearch';
import EmailNotifications from '../Common/EmailNotifications';
import '../../styles/student-dashboard.css';

export default function StudentDashboard({ user, view = 'dashboard' }) {
  const { jobs, applications } = useData();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [viewType, setViewType] = useState('explore');

  // Stats Logic
  const applicationsCount = applications.length;
  const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;
  const allSkills = [...new Set(jobs.flatMap(job => job.skills))];

  const defaultFiltered = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !filterSkill || job.skills.includes(filterSkill);
    return matchesSearch && matchesSkill;
  });

  // Fetch backend students
  const fetchStudents = async () => {
  try {
    const res = await getStudents();
    setStudents(res.data);
  } catch (error) {
    console.error("Backend is down or returning 500:", error);
    setStudents([]); // Set to empty array so the map function doesn't crash
  }
};

  useEffect(() => {
    fetchStudents();
  }, []);

  // Sync sidebar selection
  useEffect(() => {
    if (view === 'explore-jobs') setViewType('explore');
    else if (view === 'my-applications') setViewType('applications');
  }, [view]);

  // Conditional Rendering for full-page views
  if (view === 'profile') return <StudentProfile user={user} onUpdate={(u) => console.log(u)} />;
  if (view === 'notifications') return <EmailNotifications user={user} />;
  if (view === 'advanced-search') return <AdvancedSearch jobs={jobs} onSearch={setFilteredJobs} />;

  return (
    <div className="student-dashboard">
      {/* 1. Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Explore job opportunities and track your applications</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}><Briefcase size={24} /></div>
            <div className="stat-info">
              <p className="stat-value">{applicationsCount}</p>
              <p className="stat-label">Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><TrendingUp size={24} /></div>
            <div className="stat-info">
              <p className="stat-value">{shortlistedCount}</p>
              <p className="stat-label">Shortlisted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Users size={24} /></div>
            <div className="stat-info">
              <p className="stat-value">{jobs.length}</p>
              <p className="stat-label">Open Positions</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BACKEND INTEGRATION TEST SECTION */}
      <div className="backend-test-section" style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0', color: '#1e293b' }}>
              <Users size={20} /> Connected Students (Live Database)
          </h3>
          {students.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading student data from backend...</p>
          ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {students.map((s) => (
                      <li key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '14px' }}>
                          <strong>{s.name}</strong> — {s.branch} <span style={{ color: '#9ca3af' }}>({s.email})</span>
                      </li>
                  ))}
              </ul>
          )}
      </div>

      {/* 3. Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button className={`tab-btn ${viewType === 'explore' ? 'active' : ''}`} onClick={() => setViewType('explore')}>
          <Briefcase size={18} /> Explore Jobs
        </button>
        <button className={`tab-btn ${viewType === 'applications' ? 'active' : ''}`} onClick={() => setViewType('applications')}>
          <Archive size={18} /> My Applications ({applicationsCount})
        </button>
      </div>

      {/* 4. Content Section */}
      {viewType === 'explore' ? (
        <div className="jobs-section">
          <div className="search-filters">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="Search title or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} className="filter-select">
              <option value="">All Skills</option>
              {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
            </select>
          </div>

          <div className="jobs-grid">
            {defaultFiltered.length > 0 ? (
              defaultFiltered.map(job => <JobCard key={job.id} job={job} user={user} />)
            ) : (
              <div className="empty-state">
                <Search size={48} />
                <h3>No jobs found</h3>
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
                      <span className={`app-status badge-${app.status}`}>{app.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Archive size={48} />
              <h3>No applications yet</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}