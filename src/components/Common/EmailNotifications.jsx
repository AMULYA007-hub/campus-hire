import React, { useState } from 'react';
import { Mail, Bell, CheckCircle, AlertCircle, Trash2, Archive } from 'lucide-react';
import '../../styles/notifications.css';

export default function EmailNotifications({ user = {} }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'job_match',
      title: 'New Job Match!',
      message: 'Google is hiring for a Software Engineer role matching your skills',
      read: false,
      timestamp: new Date(Date.now() - 3600000),
      priority: 'high',
      actionUrl: '/jobs/123'
    },
    {
      id: 2,
      type: 'application_status',
      title: 'Application Shortlisted',
      message: 'Your application to Microsoft has been shortlisted. Next round is scheduled for Jan 20.',
      read: false,
      timestamp: new Date(Date.now() - 7200000),
      priority: 'high',
      actionUrl: '/applications/456'
    },
    {
      id: 3,
      type: 'placement',
      title: 'Congratulations!',
      message: 'You have been selected by Amazon. Package: ₹1.2 LPA',
      read: true,
      timestamp: new Date(Date.now() - 86400000),
      priority: 'high',
      actionUrl: '/placements/789'
    },
    {
      id: 4,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: 'Your technical interview with Google is scheduled for Jan 18, 2024 at 10:00 AM',
      read: true,
      timestamp: new Date(Date.now() - 172800000),
      priority: 'medium',
      actionUrl: '/interviews/101'
    },
    {
      id: 5,
      type: 'application_rejected',
      title: 'Application Update',
      message: 'Your application to IBM did not progress to the next round.',
      read: true,
      timestamp: new Date(Date.now() - 259200000),
      priority: 'low',
      actionUrl: '/applications/102'
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, high priority

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleSendNotification = (title, message, type = 'info', priority = 'medium') => {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      message,
      read: false,
      timestamp: new Date(),
      priority,
      actionUrl: '#'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    const icons = {
      job_match: '💼',
      application_status: '📋',
      placement: '🎉',
      interview_scheduled: '🗓️',
      application_rejected: '❌'
    };
    return icons[type] || '📬';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="email-notifications">
      <div className="notifications-header">
        <div className="header-title">
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-sm btn-outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Priority
          </button>
        </div>
      </div>

      <div className="test-notifications">
        <h4>Send Test Notifications</h4>
        <div className="test-buttons">
          <button
            className="btn btn-sm"
            onClick={() => handleSendNotification(
              'New Job Posted',
              'Amazon is hiring for a Senior Developer position',
              'job_match',
              'high'
            )}
          >
            Test Job Match
          </button>
          <button
            className="btn btn-sm"
            onClick={() => handleSendNotification(
              'Application Shortlisted',
              'Congratulations! Your application has been selected',
              'application_status',
              'high'
            )}
          >
            Test Shortlist
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <p>No {filter === 'unread' ? 'unread' : filter === 'high' ? 'high priority' : ''} notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-item ${notif.read ? 'read' : 'unread'} priority-${notif.priority}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="notification-content" onClick={() => handleMarkAsRead(notif.id)}>
                <div className="notification-title">
                  <h4>{notif.title}</h4>
                  <span className="priority-badge">{notif.priority}</span>
                </div>
                <p className="notification-message">{notif.message}</p>
                <span className="notification-time">{formatTime(notif.timestamp)}</span>
              </div>

              <div className="notification-actions">
                {notif.actionUrl !== '#' && (
                  <a href={notif.actionUrl} className="action-link">
                    View →
                  </a>
                )}
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(notif.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notification-settings">
        <h4>Notification Preferences</h4>
        <div className="preference-group">
          <label>
            <input type="checkbox" defaultChecked /> Job matches matching your skills
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Application status updates
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Interview schedules
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Placement offers
          </label>
          <label>
            <input type="checkbox" /> Weekly digest
          </label>
        </div>
      </div>
    </div>
  );
}
