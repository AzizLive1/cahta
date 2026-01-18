
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { User, Message, Theme } from '../types';
import { sessionService } from '../services/sessionService';
import { getGeminiStream } from '../services/geminiService';
import { analyticsService } from '../services/analyticsService';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface ChatPageProps {
  user: User;
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ user, theme, toggleTheme, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = sessionService.getMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    sessionService.saveMessages(messages);
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const startTime = Date.now();

    try {
      const stream = await getGeminiStream(messages, userMsg.content);
      
      let aiContent = '';
      const aiMsgId = (Date.now() + 1).toString();
      
      // Initial empty AI message for streaming
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of stream) {
        const text = chunk.text;
        aiContent += text;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiContent } : m));
      }

      const endTime = Date.now();
      analyticsService.trackMessage((endTime - startTime) / 1000);
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ I encountered an error. Please check your connection or try again later. 🛑',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Layout user={user} theme={theme} toggleTheme={toggleTheme} onLogout={onLogout}>
      <div className="flex flex-col h-full bg-white dark:bg-[#020617] relative">
        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-indigo-600/10 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold dark:text-white mb-2">Hello, {user.firstName}!</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Welcome to Ultra Chat. I am Azizbek Mavlonov AI. How can I assist you today? 🧠✨
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up-fade`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`flex max-w-[85%] md:max-w-[70%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <img src={user.avatarUrl} alt="You" className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-900 shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-indigo-500/20 shadow-lg">A</div>
                  )}
                </div>
                <div>
                  <div className={`
                    p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/50'}
                  `}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className={`mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 flex items-center ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'assistant' && (
                      <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded uppercase font-bold tracking-tighter scale-90">Azizbek Mavlonov AI</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start items-center space-x-2 animate-pulse pl-12">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 italic">Thinking...</span>
            </div>
          )}
        </div>

        {/* Sticky Input Field */}
        <div className="p-4 md:p-8 pt-0 sticky bottom-0 bg-gradient-to-t from-white dark:from-[#020617] via-white dark:via-[#020617] to-transparent">
          <form 
            onSubmit={handleSend}
            className="relative flex items-center max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to Azizbek Mavlonov AI..."
              className="w-full pl-6 pr-16 py-4 md:py-5 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl md:rounded-3xl shadow-xl dark:shadow-indigo-500/5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-3 p-3 md:p-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-slate-400 dark:text-slate-600">
            Powered by Ultra Chat Enterprise SaaS Engine.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 0.4s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default ChatPage;
