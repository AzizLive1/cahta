
import React, { useState } from 'react';
import { User, Theme } from '../types';
import { SunIcon, MoonIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLogin: (user: User) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, theme, toggleTheme }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only jpg, png, and webp images are allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !avatar) return;

    setIsLoading(true);
    // Simulate backend processing
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        firstName,
        lastName,
        avatarUrl: avatar,
        createdAt: new Date().toISOString(),
      };
      onLogin(newUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <div className="fixed top-8 right-8">
        <button 
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-500/5 text-slate-600 dark:text-slate-300"
        >
          {theme === Theme.LIGHT ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/40 mb-6">
            <span className="text-white text-3xl font-bold">U</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Ultra Chat</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Powered by Azizbek Mavlonov AI</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800/50">
          <div className="mb-8 flex flex-col items-center">
            <label className="relative group cursor-pointer block">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${avatar ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-700'} flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-all duration-300 group-hover:scale-105 shadow-xl`}>
                {avatar ? (
                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <PhotoIcon className="w-12 h-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full text-white shadow-lg shadow-indigo-500/40 translate-x-1/4 translate-y-1/4 scale-90 group-hover:scale-100 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1a1 1 0 00-1 1v1h1V7a1 1 0 011-1h4a1 1 0 011 1v1h1V7a1 1 0 00-1-1H7zm-2 4v5a1 1 0 001 1h8a1 1 0 001-1v-5H5zm3 2a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
              </div>
              <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            <span className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Upload profile image</span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 px-1">First Name</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 px-1">Last Name</label>
              <input 
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !firstName || !lastName || !avatar}
            className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Start Experience</span>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-400 dark:text-slate-600 text-sm">
          Secure enterprise authentication powered by Azizbek Mavlonov AI.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
