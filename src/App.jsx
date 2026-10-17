import React, { useState } from 'react';
import OriginCheckLanding from './OriginCheckLanding';
import SignIn from './SignIn';
import Register from './Register';
import Dashboard from './Dashboard';
import UploadAndVerify from './UploadAndVerify';

export default function App() {
  // Views: 'landing' | 'login' | 'register' | 'dashboard' | 'upload'
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);

  // Handle successful authentication
  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setCurrentView('dashboard');
  };

  // Handle logging out
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="app-container">
      {/* 1. Landing Page (Always initial view) */}
      {currentView === 'landing' && (
        <OriginCheckLanding
          onNavigateLogin={() => setCurrentView('login')}
          onNavigateRegister={() => setCurrentView('register')}
        />
      )}

      {/* 2. Sign In Page */}
      {currentView === 'login' && (
        <SignIn
          onLoginSuccess={handleLoginSuccess}
          onNavigateRegister={() => setCurrentView('register')}
          onNavigateHome={() => setCurrentView('landing')}
        />
      )}

      {/* 3. Register Page */}
      {currentView === 'register' && (
        <Register
          onRegisterSuccess={handleLoginSuccess}
          onNavigateLogin={() => setCurrentView('login')}
          onNavigateHome={() => setCurrentView('landing')}
        />
      )}

      {/* 4. Dashboard View */}
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateUpload={() => setCurrentView('upload')}
        />
      )}

      {/* 5. Upload & Verify View */}
      {currentView === 'upload' && (
        <UploadAndVerify 
          user={user} 
          onLogout={handleLogout}
          onNavigateDashboard={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}