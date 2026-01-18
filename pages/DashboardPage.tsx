
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, Theme, AnalyticsData } from '../types';
import { analyticsService } from '../services/analyticsService';
import { 
  UsersIcon, 
  ChatBubbleLeftIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  FingerPrintIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardPageProps {
  user: User;
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, theme, toggleTheme, onLogout }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setData(analyticsService.getAnalytics());
    
    // Live polling simulation
    const interval = setInterval(() => {
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          liveUsers: Math.max(1, prev.liveUsers + (Math.random() > 0.5 ? 1 : -1))
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  const stats = [
    { name: 'Total Visits', value: data.totalVisits.toLocaleString(), icon: GlobeAltIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { name: 'Live Users', value: data.liveUsers.toString(), icon: UsersIcon, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
    { name: 'Unique Users', value: data.uniqueUsers.toLocaleString(), icon: FingerPrintIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    { name: 'Total Messages', value: data.totalMessages.toLocaleString(), icon: ChatBubbleLeftIcon, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
    { name: 'Avg Latency', value: `${data.avgResponseTime.toFixed(2)}s`, icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { name: 'Growth Rate', value: '+12.5%', icon: ArrowTrendingUpIcon, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10' },
  ];

  return (
    <Layout user={user} theme={theme} toggleTheme={toggleTheme} onLogout={onLogout}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Analytics Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time system metrics for Ultra Chat Enterprise</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 h-[450px] flex flex-col">
            <h3 className="text-xl font-bold dark:text-white mb-8 px-2">Message Volume History</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyUsage}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === Theme.DARK ? '#1e293b' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme === Theme.DARK ? '#64748b' : '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme === Theme.DARK ? '#64748b' : '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === Theme.DARK ? '#0f172a' : '#fff', 
                      borderColor: theme === Theme.DARK ? '#1e293b' : '#e2e8f0',
                      borderRadius: '16px',
                      color: theme === Theme.DARK ? '#fff' : '#000'
                    }} 
                  />
                  <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-2">System Performance</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Optimized by Azizbek Mavlonov AI core</p>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium dark:text-slate-300">Server Health</span>
                    <span className="text-sm font-bold text-green-500">99.9%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[99.9%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium dark:text-slate-300">API Response Accuracy</span>
                    <span className="text-sm font-bold text-indigo-500">98.4%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[98.4%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium dark:text-slate-300">Redis Session Lock Latency</span>
                    <span className="text-sm font-bold text-amber-500">14ms</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[20%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-indigo-900/10 rounded-2xl border border-slate-200/50 dark:border-indigo-500/20">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">PRO TIP</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                You can increase system throughput by enabling "Turbo Context" in your Azizbek Mavlonov AI settings. This reduces token overhead by 15% across all active sessions. 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
