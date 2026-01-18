
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import { User, Theme } from './types';
import { sessionService } from './services/sessionService';
import { analyticsService } from './services/analyticsService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [loading, setLoading] = useState(true);

  // Initialize App
  useEffect(() => {
    const init = async () => {
      // 1. Check Auth
      const currentUser = sessionService.getUser();
      if (currentUser) {
        setUser(currentUser);
        analyticsService.trackSession(currentUser.id);
      }

      // 2. Initialize Theme
      const savedTheme = localStorage.getItem('theme') as Theme;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? Theme.DARK : Theme.LIGHT);
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === Theme.DARK);

      setLoading(false);
    };

    init();
    analyticsService.trackVisit();
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === Theme.DARK);
  }, [theme]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    sessionService.setUser(newUser);
    analyticsService.trackSession(newUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    sessionService.clearAll();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#020617]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/chat" />} 
        />
        <Route 
          path="/chat" 
          element={user ? <ChatPage user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage user={user} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
