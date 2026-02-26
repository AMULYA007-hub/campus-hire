import React, { useState } from 'react';
import { Plus, Briefcase, Users, TrendingUp, Package, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../hooks/useData';
import '../../styles/employer-dashboard.css';

export default function EmployerDashboard({ user }) {
  const { jobs, applications, addJob, updateJob, deleteJob, updateApplicationStatus } = useData();
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJobTab, setSelectedJobTab] = useState('jobs');
  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    location: '',
    description: '',
    skills: ''
  });

  const employerJobs = jobs;
  const employerApplications = applications.filter(app => 
    employerJobs.find(job => job.id === app.jobId)
  );

  const handleAddJob = (e) => {
    e.preventDefault();
    if (formData.title && formData.salary && formData.location) {
      addJob({
        ...formData,
        company: user?.company,
        skills: formData.skills.split(',').map(s => s.trim()),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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

  const activeJobs = employerJobs.filter(job => job.status === 'active').length;
  const totalApplications = employerApplications.length;
  const shortlist = employerApplications.filter(app => app.status === 'shortlisted').length;

  return (
    <div className="employer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.company}! 👼</h1>
          <p>Manage job postings and review applications</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{activeJobs}</p>
              <p className="stat-label">Active Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{totalApplications}</p>
              <p className="stat-label">Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{shortlist}</p>
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
          <Briefcase size={18} />
          Job Postings ({activeJobs})
        </button>
        <button 
          className={`tab-btn ${selectedJobTab === 'applications' ? 'active' : ''}`}
          onClick={() => setSelectedJobTab('applications')}
        >
          <Users size={18} />
          Applications ({totalApplications})
        </button>
      </div>

      {selectedJobTab === 'jobs' ? (
        <div className="jobs-section">
          <button 
            className="btn btn-primary"
            onClick={() => setShowJobForm(true)}
            style={{ marginBottom: '2rem' }}
          >
            <Plus size={18} />
            Post New Job
          </button>

          {showJobForm && (
            <div className="form-container card">
              <div className="card-header">
                <h3>Post a New Job</h3>
              </div>
              <form onSubmit={handleAddJob} className="card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Senior React Developer"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary Range</label>
                    <input
                      type="text"
                      placeholder="e.g., 10-15 LPA"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Bangalore"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Required Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., React, Node.js, MongoDB"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Job Description</label>
                  <textarea
                    placeholder="Describe the job, responsibilities, and requirements..."
                    rows="5"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Post Job</button>
                  <button 
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowJobForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="jobs-list">
            {employerJobs.length > 0 ? (
              employerJobs.map(job => (
                <div key={job.id} className="job-item">
                  <div className="job-item-header">
                    <div>
                      <h4>{job.title}</h4>
                      <p>{job.location} • {job.salary}</p>
                    </div>
                    <div className="job-actions">
                      <button className="btn btn-sm btn-secondary" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="job-description">{job.description}</p>
                  <div className="job-stats">
                    <span>{job.applicants} applicants</span>
                    <span>Posted {job.posted}</span>
                    <span>Deadline {job.deadline}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Briefcase size={48} />
                <h3>No job postings yet</h3>
                <p>Start by posting a new job opportunity</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="applications-section">
          <div className="applications-list">
            {employerApplications.length > 0 ? (
              employerApplications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="app-item">
                    <div className="app-item-header">
                      <div>
                        <h4>{job?.title}</h4>
                        <p>Applied on {app.date}</p>
                      </div>
                      <span className={`app-status badge-${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="app-actions">
                      {app.status === 'applied' && (
                        <>
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleApplicationAction(app.id, 'shortlisted')}
                          >
                            Shortlist
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleApplicationAction(app.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'shortlisted' && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleApplicationAction(app.id, 'hired')}
                        >
                          Mark as Hired
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Users size={48} />
                <h3>No applications yet</h3>
                <p>Applications will appear here as students apply</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
