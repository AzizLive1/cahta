
import { User, Message } from '../types';

const USER_KEY = 'ultra_chat_user';
const MESSAGES_KEY = 'ultra_chat_memory';

export const sessionService = {
  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  getMessages: (): Message[] => {
    const data = sessionStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMessages: (messages: Message[]) => {
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  clearAll: () => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(MESSAGES_KEY);
  }
};
