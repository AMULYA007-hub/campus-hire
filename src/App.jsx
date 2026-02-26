import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Common/Login';
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';
import StudentDashboard from './components/Student/StudentDashboard';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import PlacementOfficerDashboard from './components/PlacementOfficer/PlacementOfficerDashboard';
import './styles/global.css';
import './App.css';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const DashboardLayout = ({ children, user, onLogout, selectedView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getSidebarItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', active: selectedView === 'dashboard' }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        {
          id: 'users',
          label: 'User Management',
          icon: '👥',
          submenu: [
            { id: 'all-users', label: 'All Users' },
            { id: 'roles', label: 'Manage Roles' }
          ]
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: '📈',
          submenu: [
            { id: 'placements', label: 'Placements' },
            { id: 'applications', label: 'Applications' }
          ]
        },
        { id: 'settings', label: 'System Settings', icon: '⚙️' }
      ];
    } else if (user?.role === 'student') {
      return [
        ...baseItems,
        { id: 'explore-jobs', label: 'Explore Jobs', icon: '💼', active: selectedView === 'explore-jobs' },
        { id: 'my-applications', label: 'My Applications', icon: '📋', active: selectedView === 'my-applications' },
        { id: 'profile', label: 'My Profile', icon: '👤', active: selectedView === 'profile' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', active: selectedView === 'notifications' },
        { id: 'advanced-search', label: 'Search Jobs', icon: '🔍', active: selectedView === 'advanced-search' }
      ];
    } else if (user?.role === 'employer') {
      return [
        ...baseItems,
        { id: 'post-job', label: 'Post Job', icon: '📢' },
        { id: 'my-jobs', label: 'My Jobs', icon: '💼' },
        { id: 'applications', label: 'Applications', icon: '📬' },
        { id: 'company', label: 'Company Profile', icon: '🏢' }
      ];
    } else if (user?.role === 'officer') {
      return [
        ...baseItems,
        { id: 'placements', label: 'Placements', icon: '🎓' },
        { id: 'tracking', label: 'Track Records', icon: '📊' },
        { id: 'reports', label: 'Reports', icon: '📈' },
        { id: 'interactions', label: 'Interactions', icon: '💬' }
      ];
    }

    return baseItems;
  };

  const handleSidebarClick = (item) => {
    onViewChange(item.id);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-content">
        <Sidebar items={getSidebarItems()} isOpen={sidebarOpen} onItemClick={handleSidebarClick} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  const { user, logout } = React.useContext(AuthContext);
  const [selectedView, setSelectedView] = useState('dashboard');

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout} selectedView={selectedView} onViewChange={setSelectedView}>
      {user.role === 'student' && <StudentDashboard user={user} view={selectedView} />}
      {user.role === 'employer' && <EmployerDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}
      {user.role === 'officer' && <PlacementOfficerDashboard user={user} />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
