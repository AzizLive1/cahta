
import { AnalyticsData } from '../types';

const ANALYTICS_KEY = 'ultra_chat_analytics';

export const analyticsService = {
  // Use method shorthand to ensure 'this' refers to the analyticsService object
  trackVisit() {
    const data = this.getAnalytics();
    data.totalVisits += 1;
    this.saveAnalytics(data);
  },

  trackSession(userId: string) {
    const data = this.getAnalytics();
    data.totalSessions += 1;
    data.uniqueUsers = Math.max(data.uniqueUsers, 124); // Mocking real-ish scaling
    data.liveUsers = Math.floor(Math.random() * 20) + 5;
    this.saveAnalytics(data);
  },

  trackMessage(responseTime: number) {
    const data = this.getAnalytics();
    data.totalMessages += 1;
    // Calculate new average response time
    data.avgResponseTime = (data.avgResponseTime * (data.totalMessages - 1) + responseTime) / data.totalMessages;
    this.saveAnalytics(data);
  },

  getAnalytics(): AnalyticsData {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (!data) {
      return {
        totalVisits: 1450,
        liveUsers: 12,
        uniqueUsers: 342,
        totalSessions: 890,
        totalMessages: 4520,
        avgResponseTime: 1.2,
        dailyUsage: [
          { date: '2023-10-01', count: 400 },
          { date: '2023-10-02', count: 300 },
          { date: '2023-10-03', count: 500 },
          { date: '2023-10-04', count: 800 },
          { date: '2023-10-05', count: 600 },
          { date: '2023-10-06', count: 900 },
          { date: '2023-10-07', count: 1100 },
        ]
      };
    }
    return JSON.parse(data);
  },

  saveAnalytics(data: AnalyticsData) {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  }
};