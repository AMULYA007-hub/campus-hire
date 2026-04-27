import React, { useState } from 'react';
import { Plus, Briefcase, Users, TrendingUp, Edit, Trash2, User, FileText } from 'lucide-react';
import { useData } from '../../hooks/useData';
import '../../styles/employer-dashboard.css';

export default function EmployerDashboard({ user, view = 'dashboard' }) {
  const { jobs, users, applications, addJob, deleteJob, updateApplicationStatus } = useData();

  const companyName = user?.company || user?.name || 'Company';
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJobTab, setSelectedJobTab] = useState('jobs');
  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    location: '',
    description: '',
    skills: ''
  });

  // Synchronize internal tab state with parent sidebar view
  React.useEffect(() => {
    switch (view) {
      case 'post-job':
        setSelectedJobTab('jobs');
        setShowJobForm(true);
        break;
      case 'applicants':
      case 'applications':
        setSelectedJobTab('applications');
        setShowJobForm(false);
        break;
      default:
        setShowJobForm(false);
        break;
    }
  }, [view]);

  const employerJobs = jobs;
  const employerApplications = applications.filter(app => 
    employerJobs.find(job => job.id === app.jobId)
  );

  const handleAddJob = (e) => {
    e.preventDefault();
    if (formData.title && formData.salary && formData.location) {
      addJob({
        ...formData,
        company: companyName,
        skills: formData.skills.split(',').map(s => s.trim()),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        posted: 'Just now',
        applicants: 0
      });
      setFormData({ title: '', salary: '', location: '', description: '', skills: '' });
      setShowJobForm(false);
      alert('Job posted successfully!');
    }
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteJob(jobId);
    }
  };

  const handleApplicationAction = (appId, status) => {
    updateApplicationStatus(appId, status);
    alert(`Application ${status}!`);
  };

  const handleViewResume = (resumeUrl) => {
    if (!resumeUrl || resumeUrl === "#" || resumeUrl === "") {
      console.error("Invalid Resume URL:", resumeUrl);
      alert("Error: No valid resume file path found for this applicant.");
      return;
    }
    console.log("Opening resume at:", resumeUrl);
    window.open(resumeUrl, '_blank');
  };

  const activeJobsCount = employerJobs.filter(job => job.status === 'active').length;
  const totalAppsCount = employerApplications.length;
  const shortlistCount = employerApplications.filter(app => app.status === 'shortlisted').length;

  return (
    <div className="employer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {companyName}!</h1>
          <p>Manage job postings and review applications</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{activeJobsCount}</p>
              <p className="stat-label">Active Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{totalAppsCount}</p>
              <p className="stat-label">Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{shortlistCount}</p>
              <p className="stat-label">Shortlisted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${selectedJobTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setSelectedJobTab('jobs')}
        >
          <Briefcase size={18} /> Job Postings
        </button>
        <button 
          className={`tab-btn ${selectedJobTab === 'applications' ? 'active' : ''}`}
          onClick={() => setSelectedJobTab('applications')}
        >
          <Users size={18} /> Review Applicants
        </button>
      </div>

      {selectedJobTab === 'jobs' ? (
        <div className="jobs-section">
          <button className="btn btn-primary" onClick={() => setShowJobForm(true)} style={{ marginBottom: '2rem' }}>
            <Plus size={18} /> Post New Job
          </button>

          {showJobForm && (
            <div className="form-container card">
              <div className="card-header"><h3>Post a New Job</h3></div>
              <form onSubmit={handleAddJob} className="card-body">
                <div className="form-row">
  <div className="form-group">
    <label>Job Title</label>
    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
  </div>
  <div className="form-group">
    <label>Salary</label>
    <input type="text" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} required />
  </div>
  {/* ADD THIS GROUP BELOW */}
  <div className="form-group">
    <label>Location</label>
    <input type="text" placeholder="e.g. Remote or New York" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
  </div>
</div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Post Job</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowJobForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="jobs-list">
            {employerJobs.map(job => (
              <div key={job.id} className="job-item card">
                <div className="job-item-header">
                  <div><h4>{job.title}</h4><p>{job.location} • {job.salary}</p></div>
                  <div className="job-actions">
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteJob(job.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="job-stats">
                  <span>{job.applicants} applicants</span> • <span>Deadline: {job.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="applications-section">
          <div className="applications-list">
            {employerApplications.length > 0 ? (
              employerApplications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                const student = users.find(u => u.id === app.studentId);
                return (
                  <div key={app.id} className="app-item card">
                    <div className="app-item-header">
                      <div>
                        <h4 className="job-title-link">{job?.title}</h4>
                        <div className="applicant-meta">
                          <span className="applicant-name"><User size={14} /> {student?.name}</span>
                          <span className="apply-date">Applied: {app.date}</span>
                        </div>
                      </div>
                      <span className={`app-status badge-${app.status}`}>{app.status}</span>
                    </div>

                    <div className="app-review-section">
                      {/* Integrated Resume Review Button */}
                      {app.resume ? (
                        <button 
                          className="btn-review-resume"
                          onClick={() => handleViewResume(app.resume)}
                        >
                          <FileText size={16} /> Review Full Resume
                        </button>
                      ) : (
                        <span className="no-resume">No resume uploaded</span>
                      )}
                      
                      {app.coverLetter && (
                        <div className="app-cover-letter-preview">
                          <strong>Note from Applicant:</strong>
                          <p>"{app.coverLetter}"</p>
                        </div>
                      )}
                    </div>

                    <div className="app-actions">
                      {app.status === 'applied' && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleApplicationAction(app.id, 'shortlisted')}>Shortlist</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleApplicationAction(app.id, 'rejected')}>Reject</button>
                        </>
                      )}
                      {app.status === 'shortlisted' && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleApplicationAction(app.id, 'hired')}>Finalize Hiring</button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Users size={48} />
                <h3>No applications yet</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}