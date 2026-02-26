import React, { useState } from 'react';
import { Shield, Plus, Trash2, Users, Briefcase, TrendingUp, BarChart3, Edit } from 'lucide-react';
import { useData } from '../../hooks/useData';
import '../../styles/admin-dashboard.css';

export default function AdminDashboard({ user }) {
  const { users, jobs, applications, placements, addUser, deleteUser, addJob } = useData();
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student'
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.role) {
      addUser(formData);
      setFormData({ name: '', email: '', role: 'student' });
      setShowAddUser(false);
      alert('User added successfully!');
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const studentCount = users.filter(u => u.role === 'student').length;
  const employerCount = users.filter(u => u.role === 'employer').length;
  const totalApplications = applications.length;
  const totalPlacements = placements.length;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Control Panel ⚙️</h1>
          <p>Manage system settings, users, and placement data</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{users.length}</p>
              <p className="stat-label">Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{jobs.length}</p>
              <p className="stat-label">Job Postings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{totalApplications}</p>
              <p className="stat-label">Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{totalPlacements}</p>
              <p className="stat-label">Placements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          User Management ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Shield size={18} />
          Settings
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddUser(true)}
            style={{ marginBottom: '2rem' }}
          >
            <Plus size={18} />
            Add New User
          </button>

          {showAddUser && (
            <div className="form-container card">
              <div className="card-header">
                <h3>Add New User</h3>
              </div>
              <form onSubmit={handleAddUser} className="card-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter user's full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="user@campus.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="student">Student</option>
                    <option value="employer">Employer</option>
                    <option value="officer">Placement Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add User</button>
                  <button 
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowAddUser(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td><strong>{userItem.name}</strong></td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className={`badge badge-${userItem.role}`}>
                        {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">{userItem.status}</span>
                    </td>
                    <td>{userItem.joinDate}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(userItem.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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
              <h3>User Breakdown</h3>
              <div className="analytics-content">
                <div className="breakdown-item">
                  <span>Students</span>
                  <span className="value">{studentCount}</span>
                </div>
                <div className="breakdown-item">
                  <span>Employers</span>
                  <span className="value">{employerCount}</span>
                </div>
                <div className="breakdown-item">
                  <span>Placement Officers</span>
                  <span className="value">{users.filter(u => u.role === 'officer').length}</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Application Status</h3>
              <div className="analytics-content">
                <div className="breakdown-item">
                  <span>Applied</span>
                  <span className="value">{applications.filter(a => a.status === 'applied').length}</span>
                </div>
                <div className="breakdown-item">
                  <span>Shortlisted</span>
                  <span className="value">{applications.filter(a => a.status === 'shortlisted').length}</span>
                </div>
                <div className="breakdown-item">
                  <span>Rejected</span>
                  <span className="value">{applications.filter(a => a.status === 'rejected').length}</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Placement Insights</h3>
              <div className="analytics-content">
                <div className="breakdown-item">
                  <span>Total Placements</span>
                  <span className="value">{totalPlacements}</span>
                </div>
                <div className="breakdown-item">
                  <span>Placement Rate</span>
                  <span className="value">
                    {studentCount > 0 ? Math.round((totalPlacements / studentCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Platform Activity</h3>
              <div className="analytics-content">
                <div className="breakdown-item">
                  <span>Active Postings</span>
                  <span className="value">{jobs.filter(j => j.status === 'active').length}</span>
                </div>
                <div className="breakdown-item">
                  <span>Total Applicants</span>
                  <span className="value">{totalApplications}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-section card">
          <div className="card-header">
            <h3>System Settings</h3>
          </div>
          <div className="card-body">
            <div className="settings-group">
              <div className="setting-item">
                <div>
                  <h4>Maintenance Mode</h4>
                  <p>Enable maintenance mode for platform updates</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Send notifications to users for important events</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h4>Application Deadline</h4>
                  <p>Default deadline for job applications (days)</p>
                </div>
                <input type="number" defaultValue="30" min="1" max="180" style={{ width: '100px' }} />
              </div>

              <div className="setting-item">
                <div>
                  <h4>Max File Upload Size</h4>
                  <p>Maximum resume file size in MB</p>
                </div>
                <input type="number" defaultValue="5" min="1" max="50" style={{ width: '100px' }} />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-primary">Save Settings</button>
              <button className="btn btn-outline">Reset to Default</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
