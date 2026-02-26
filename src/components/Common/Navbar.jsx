import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, LogOut, Bell, Settings, User, X } from 'lucide-react';
import EmailNotifications from './EmailNotifications';
import '../../styles/navbar.css';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <h1>CampusHire</h1>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <button className="navbar-icon-btn">
          <Settings size={20} />
        </button>
        
        <div className="navbar-user">
          <img src={user?.avatar} alt={user?.name} className="user-avatar" />
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
          </div>
        </div>

        <button className="navbar-logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>

    {showNotifications && (
      <div className="notifications-modal-overlay">
        <div className="notifications-modal">
          <div className="modal-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X size={20} />
            </button>
          </div>
          <EmailNotifications user={user} />
        </div>
      </div>
    )}
    </>
  );
}
