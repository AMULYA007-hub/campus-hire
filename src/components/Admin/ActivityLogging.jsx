import React, { useState } from 'react';
import { Activity, UserPlus, FileText, Heart, LogIn, LogOut, Edit3, Trash2, Download } from 'lucide-react';
import '../../styles/activity.css';

export default function ActivityLogging({ userId = 'user123' }) {
  const [activities, setActivities] = useState([
    {
      id: 1,
      userId: 'STU001',
      userName: 'John Doe',
      action: 'login',
      description: 'User logged in',
      timestamp: new Date(Date.now() - 600000),
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success'
    },
    {
      id: 2,
      userId: 'STU001',
      userName: 'John Doe',
      action: 'apply_job',
      description: 'Applied for Software Engineer at Google',
      timestamp: new Date(Date.now() - 500000),
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success'
    },
    {
      id: 3,
      userId: 'STU001',
      userName: 'John Doe',
      action: 'update_profile',
      description: 'Updated profile information',
      timestamp: new Date(Date.now() - 400000),
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success'
    },
    {
      id: 4,
      userId: 'EMP002',
      userName: 'Jane Smith',
      action: 'create_job',
      description: 'Created new job posting: Senior Developer',
      timestamp: new Date(Date.now() - 300000),
      ipAddress: '192.168.1.50',
      device: 'Firefox on Mac',
      status: 'success'
    },
    {
      id: 5,
      userId: 'ADMIN001',
      userName: 'Admin User',
      action: 'delete_user',
      description: 'Deleted user account: inactive123',
      timestamp: new Date(Date.now() - 200000),
      ipAddress: '192.168.1.1',
      device: 'Safari on Mac',
      status: 'success'
    },
    {
      id: 6,
      userId: 'STU001',
      userName: 'John Doe',
      action: 'logout',
      description: 'User logged out',
      timestamp: new Date(Date.now() - 100000),
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success'
    }
  ]);

  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getActionIcon = (action) => {
    const icons = {
      login: <LogIn size={18} />,
      logout: <LogOut size={18} />,
      apply_job: <FileText size={18} />,
      create_job: <Edit3 size={18} />,
      update_profile: <Edit3 size={18} />,
      delete_user: <Trash2 size={18} />,
      create_placement: <Heart size={18} />
    };
    return icons[action] || <Activity size={18} />;
  };

  const getActionLabel = (action) => {
    const labels = {
      login: 'Login',
      logout: 'Logout',
      apply_job: 'Job Application',
      create_job: 'Job Posted',
      update_profile: 'Profile Updated',
      delete_user: 'User Deleted',
      create_placement: 'Placement Created'
    };
    return labels[action] || action;
  };

  const getActionColor = (action) => {
    const colors = {
      login: 'action-blue',
      logout: 'action-gray',
      apply_job: 'action-green',
      create_job: 'action-purple',
      update_profile: 'action-orange',
      delete_user: 'action-red',
      create_placement: 'action-green'
    };
    return colors[action] || 'action-blue';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = activities.filter(activity => {
    const actionMatch = filterAction === 'all' || activity.action === filterAction;
    const userMatch = filterUser === 'all' || activity.userId === filterUser;
    const searchMatch = searchTerm === '' || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return actionMatch && userMatch && searchMatch;
  });

  const uniqueUsers = [...new Set(activities.map(a => a.userId))];
  const uniqueActions = [...new Set(activities.map(a => a.action))];

  const exportActivityLog = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,User,Action,Description,IP Address,Device,Status\n';
    
    activities.forEach(activity => {
      const row = [
        activity.timestamp.toISOString(),
        activity.userName,
        getActionLabel(activity.action),
        activity.description,
        activity.ipAddress,
        activity.device,
        activity.status
      ];
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `activity-log-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  return (
    <div className="activity-logging">
      <div className="activity-header">
        <h2>Activity Log</h2>
        <p>Track all user actions and system events</p>
      </div>

      <div className="activity-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {getActionLabel(action)}
              </option>
            ))}
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(userId => {
              const user = activities.find(a => a.userId === userId);
              return (
                <option key={userId} value={userId}>
                  {user?.userName}
                </option>
              );
            })}
          </select>

          <button className="btn btn-sm" onClick={exportActivityLog}>
            <Download size={16} />
            Export Log
          </button>
        </div>
      </div>

      <div className="activity-stats">
        <div className="stat">
          <h4>Total Activities</h4>
          <p>{activities.length}</p>
        </div>
        <div className="stat">
          <h4>Today's Activities</h4>
          <p>
            {activities.filter(a => {
              const today = new Date();
              return a.timestamp.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
        <div className="stat">
          <h4>Active Users</h4>
          <p>{uniqueUsers.length}</p>
        </div>
        <div className="stat">
          <h4>Action Types</h4>
          <p>{uniqueActions.length}</p>
        </div>
      </div>

      <div className="activity-timeline">
        {filteredActivities.length === 0 ? (
          <div className="no-activities">
            <Activity size={48} />
            <p>No activities found</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div key={activity.id} className={`activity-item ${getActionColor(activity.action)}`}>
              <div className="activity-icon">
                {getActionIcon(activity.action)}
              </div>

              <div className="activity-content">
                <div className="activity-title">
                  <h4>{activity.userName}</h4>
                  <span className="action-badge">{getActionLabel(activity.action)}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="meta-item">
                    <strong>Time:</strong> {formatTime(activity.timestamp)}
                  </span>
                  <span className="meta-item">
                    <strong>IP:</strong> {activity.ipAddress}
                  </span>
                  <span className="meta-item">
                    <strong>Device:</strong> {activity.device}
                  </span>
                  <span className={`status-badge status-${activity.status}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="activity-pagination">
        <button className="btn btn-outline">← Previous</button>
        <span>Page 1 of 1 ({filteredActivities.length} records)</span>
        <button className="btn btn-outline">Next →</button>
      </div>
    </div>
  );
}
