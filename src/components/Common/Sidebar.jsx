// src/components/Common/Sidebar.jsx
import React from 'react';
import { LayoutDashboard, User, Briefcase, FileText, Users } from 'lucide-react';

export default function Sidebar({ user, activeView, onViewChange }) {
  
  // 1. Define the menu items based on the user's role
  const getMenuItems = () => {
    const role = user?.role?.toLowerCase();
    
    if (role === 'student') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
        { id: 'profile', label: 'My Profile', icon: <User size={20}/> },
        { id: 'jobs', label: 'Browse Jobs', icon: <Briefcase size={20}/> },
        { id: 'applications', label: 'My Applications', icon: <FileText size={20}/> },
      ];
    }
    
    if (role === 'employer') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
        { id: 'post-job', label: 'Post a Job', icon: <Briefcase size={20}/> },
        { id: 'applicants', label: 'View Applicants', icon: <Users size={20}/> },
      ];
    }

    return []; // Return empty if no role matches
  };

  const menuItems = getMenuItems();

  // 2. Return a single JSX block
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {menuItems.map((item) => (
          <button
            key={item.id}
            // Use 'activeView' from props to determine the active class
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            // Use 'onViewChange' from props to change the view in App.jsx
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}