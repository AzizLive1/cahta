
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalyticsData {
  totalVisits: number;
  liveUsers: number;
  uniqueUsers: number;
  totalSessions: number;
  totalMessages: number;
  avgResponseTime: number;
  dailyUsage: { date: string; count: number }[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ChatSession {
  id: string;
  messages: Message[];
  lastActivity: number;
}
