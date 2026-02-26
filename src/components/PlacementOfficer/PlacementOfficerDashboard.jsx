import React, { useState } from 'react';
import { TrendingUp, BarChart3, Users, Plus, DownloadCloud, LineChart } from 'lucide-react';
import { useData } from '../../hooks/useData';
import PlacementOfficerOTP from './PlacementOfficerOTP';
import '../../styles/officer-dashboard.css';

function PlacementOfficerDashboardContent({ user }) {
  const { placements, applications, users, jobs, addPlacement } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPlacement, setShowAddPlacement] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    companyName: '',
    position: '',
    salary: ''
  });

  const handleAddPlacement = (e) => {
    e.preventDefault();
    if (formData.studentName && formData.companyName && formData.position && formData.salary) {
      addPlacement(formData);
      setFormData({ studentName: '', companyName: '', position: '', salary: '' });
      setShowAddPlacement(false);
      alert('Placement record added successfully!');
    }
  };

  const students = users.filter(u => u.role === 'student');
  const placementRate = students.length > 0 ? Math.round((placements.length / students.length) * 100) : 0;
  const avgPackage = placements.length > 0 
    ? (placements.reduce((sum, p) => sum + parseFloat(p.salary) || 0, 0) / placements.length).toFixed(2)
    : 0;

  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  const generateReport = () => {
    const reportData = {
      timestamp: new Date().toLocaleString(),
      totalStudents: students.length,
      placementRate: `${placementRate}%`,
      averagePackage: `${avgPackage} LPA`,
      totalPlacements: placements.length,
      totalApplications: applications.length,
      activeJobs: jobs.filter(j => j.status === 'active').length,
      placements: placements,
      topEmployers: [...new Set(placements.map(p => p.companyName))].slice(0, 5)
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `placement-report-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="officer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Placement Dashboard 📊</h1>
          <p>Track placements, monitor applications, and generate reports</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{placements.length}</p>
              <p className="stat-label">Total Placements</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{placementRate}%</p>
              <p className="stat-label">Placement Rate</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{avgPackage}</p>
              <p className="stat-label">Avg Package (LPA)</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <LineChart size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{students.length}</p>
              <p className="stat-label">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="officer-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={18} />
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
          onClick={() => setActiveTab('placements')}
        >
          <Users size={18} />
          Placements ({placements.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <LineChart size={18} />
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <DownloadCloud size={18} />
          Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Application Pipeline</h3>
              <div className="metric-content">
                <div className="metric-item">
                  <span className="metric-label">Applied</span>
                  <span className="metric-value applied">{appliedCount}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Shortlisted</span>
                  <span className="metric-value shortlisted">{shortlistedCount}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Rejected</span>
                  <span className="metric-value rejected">{rejectedCount}</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3>Placement Metrics</h3>
              <div className="metric-content">
                <div className="metric-item">
                  <span className="metric-label">Placed</span>
                  <span className="metric-value placed">{placements.length}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Pending</span>
                  <span className="metric-value pending">{students.length - placements.length}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Rate</span>
                  <span className="metric-value rate">{placementRate}%</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3>Job Market</h3>
              <div className="metric-content">
                <div className="metric-item">
                  <span className="metric-label">Active Jobs</span>
                  <span className="metric-value">{jobs.filter(j => j.status === 'active').length}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Total Employers</span>
                  <span className="metric-value">{users.filter(u => u.role === 'employer').length}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Package</span>
                  <span className="metric-value">{avgPackage}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-placements">
            <h3>Recent Placements</h3>
            {placements.length > 0 ? (
              <div className="placements-timeline">
                {placements.slice(0, 5).map(placement => (
                  <div key={placement.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{placement.studentName}</strong>
                        <span className="timeline-date">{placement.date}</span>
                      </div>
                      <p>{placement.position} at {placement.companyName}</p>
                      <p className="timeline-salary">Package: {placement.salary} LPA</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">No placements recorded yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'placements' && (
        <div className="placements-section">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddPlacement(true)}
            style={{ marginBottom: '2rem' }}
          >
            <Plus size={18} />
            Record Placement
          </button>

          {showAddPlacement && (
            <div className="form-container card">
              <div className="card-header">
                <h3>Record a New Placement</h3>
              </div>
              <form onSubmit={handleAddPlacement} className="card-body">
                <div className="form-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    placeholder="Enter student's full name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      placeholder="e.g., Software Engineer"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Salary (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g., 10.5"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Record Placement</button>
                  <button 
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowAddPlacement(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="placements-table-container">
            <table className="placements-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Salary (LPA)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {placements.map(placement => (
                  <tr key={placement.id}>
                    <td><strong>{placement.studentName}</strong></td>
                    <td>{placement.companyName}</td>
                    <td>{placement.position}</td>
                    <td className="salary">{placement.salary}</td>
                    <td>{placement.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Top Companies</h3>
              <div className="analytics-list">
                {[...new Set(placements.map(p => p.companyName))].slice(0, 10).map((company, idx) => {
                  const count = placements.filter(p => p.companyName === company).length;
                  return (
                    <div key={idx} className="list-item">
                      <span>{company}</span>
                      <span className="count">{count} hire{count !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="analytics-card">
              <h3>Salary Distribution</h3>
              <div className="analytics-list">
                {placements.length > 0 && (
                  <>
                    <div className="list-item">
                      <span>Highest Package</span>
                      <span className="value">{Math.max(...placements.map(p => parseFloat(p.salary) || 0)).toFixed(2)} LPA</span>
                    </div>
                    <div className="list-item">
                      <span>Lowest Package</span>
                      <span className="value">{Math.min(...placements.map(p => parseFloat(p.salary) || 0)).toFixed(2)} LPA</span>
                    </div>
                    <div className="list-item">
                      <span>Average Package</span>
                      <span className="value">{avgPackage} LPA</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="analytics-card">
              <h3>Application Status</h3>
              <div className="status-chart">
                <div className="chart-item">
                  <div className="chart-bar applied">
                    <span className="bar-value">{appliedCount}</span>
                  </div>
                  <span className="chart-label">Applied</span>
                </div>
                <div className="chart-item">
                  <div className="chart-bar shortlisted">
                    <span className="bar-value">{shortlistedCount}</span>
                  </div>
                  <span className="chart-label">Shortlisted</span>
                </div>
                <div className="chart-item">
                  <div className="chart-bar rejected">
                    <span className="bar-value">{rejectedCount}</span>
                  </div>
                  <span className="chart-label">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="reports-section">
          <div className="report-generator card">
            <div className="card-header">
              <h3>Generate Reports</h3>
            </div>
            <div className="card-body">
              <div className="report-options">
                <button 
                  className="report-btn"
                  onClick={generateReport}
                >
                  <DownloadCloud size={24} />
                  <div>
                    <h4>Placement Report</h4>
                    <p>Download comprehensive placement statistics</p>
                  </div>
                </button>

                <button className="report-btn" disabled>
                  <DownloadCloud size={24} />
                  <div>
                    <h4>Performance Analysis</h4>
                    <p>Year-over-year placement trends</p>
                  </div>
                </button>

                <button className="report-btn" disabled>
                  <DownloadCloud size={24} />
                  <div>
                    <h4>Company Feedback</h4>
                    <p>Employer satisfaction and feedback</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="report-summary card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
              <h3>Current Placement Summary</h3>
            </div>
            <div className="card-body">
              <div className="summary-grid">
                <div className="summary-item">
                  <p className="summary-label">Total Students</p>
                  <p className="summary-value">{students.length}</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Placed Students</p>
                  <p className="summary-value">{placements.length}</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Placement Rate</p>
                  <p className="summary-value">{placementRate}%</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Avg Package</p>
                  <p className="summary-value">{avgPackage} LPA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlacementOfficerDashboard({ user }) {
  const [otpVerified, setOtpVerified] = useState(false);

  // Restrict access to only placement officers
  if (user?.role !== 'officer') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        color: '#ef4444'
      }}>
        <h2>🚫 Access Denied</h2>
        <p>This dashboard is only accessible to Placement Officers.</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Please login with a placement officer account.
        </p>
      </div>
    );
  }

  if (!otpVerified) {
    return (
      <PlacementOfficerOTP
        user={user}
        onOTPVerified={() => setOtpVerified(true)}
      />
    );
  }

  return <PlacementOfficerDashboardContent user={user} />;
}
