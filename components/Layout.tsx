
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Theme } from '../types';
import { 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  ArrowLeftOnRectangleIcon, 
  SunIcon, 
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  user: User;
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, theme, toggleTheme, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Chat', path: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Ultra Chat</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img 
              src={user.avatarUrl} 
              alt={user.firstName} 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Online</p>
            </div>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="flex w-full items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg dark:text-white">Ultra Chat</span>
        </div>
        <button onClick={toggleTheme} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
          {theme === Theme.LIGHT ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-64 h-full bg-white dark:bg-[#0f172a] p-6 shadow-2xl animate-slide-right" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold dark:text-white">Ultra Chat</span>
              <button onClick={() => setIsSidebarOpen(false)}><XMarkIcon className="w-6 h-6 dark:text-white" /></button>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3 p-3 rounded-lg
                    ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}
                  `}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <button 
                onClick={handleLogoutClick}
                className="flex items-center space-x-3 p-3 text-red-500 w-full"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 relative">
        {/* Top Header - Desktop only */}
        <header className="hidden md:flex items-center justify-end px-8 py-4 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
          >
            {theme === Theme.LIGHT ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#020617]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
