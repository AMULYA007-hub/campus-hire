import React, { useState, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Login from './components/Common/Login';
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';

// Dashboards from your checklist
import StudentDashboard from './components/Student/StudentDashboard';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import PlacementOfficerDashboard from './components/PlacementOfficer/PlacementOfficerDashboard';

function AppContent() {
  const auth = useContext(AuthContext);
  if (!auth) return <div>Loading...</div>;

  const { user, logout } = auth;
  const [selectedView, setSelectedView] = useState('dashboard');

  if (!user) return <Login />;

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="main-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar now sits next to content, not over it */}
        <Sidebar user={user} activeView={selectedView} onViewChange={setSelectedView} />

        <main className="content-area" style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f5f7fb' }}>
          {/* Dynamic Role Rendering */}
          {user.role === 'student' && <StudentDashboard user={user} view={selectedView} />}
          {user.role === 'employer' && <EmployerDashboard user={user} view={selectedView} />}
          {user.role === 'admin' && <AdminDashboard user={user} view={selectedView} />}
          {user.role === 'officer' && <PlacementOfficerDashboard user={user} view={selectedView} />}
          
          {/* Helper for debugging: if role doesn't match, show a message */}
          {!['student', 'employer', 'admin', 'officer'].includes(user.role) && (
             <div style={{padding: '20px', textAlign: 'center'}}>
               <h2>Role "{user.role}" not recognized.</h2>
               <p>Check if your backend is sending the role in lowercase.</p>
             </div>
          )}
        </main>
      </div>
    </div>
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