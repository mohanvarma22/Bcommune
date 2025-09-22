import React, { useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIChatView from '../../views/AIChatView';
import RecentChats from '../ai/RecentChats';
import type { AIChatSession, AIChatMessage, User } from '../../types';
import { getAIResponse, generateTitleForChat } from '../../services/geminiChatService';
import { DataContext } from '../../context/DataContext';
import JobCard from '../jobs/JobCard';
import EventCard from '../events/EventCard';
import UserCard from '../connections/UserCard';


const Layout: React.FC = () => {
  const data = useContext(DataContext);
  const location = useLocation();
  const [isAiMode, setIsAiMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<AIChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const activeChat = chatHistory.find(c => c.id === activeChatId);
  const isOpportunitiesPage = location.pathname === '/opportunities';
  const isJobApplicantsPage = /^\/my-activity\/job\/.*\/applicants$/.test(location.pathname);
  const isKanbanPage = isOpportunitiesPage || isJobApplicantsPage;


  const handleNewChat = () => {
    const newChat: AIChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };
  
  const toggleAiMode = (forceState?: boolean) => {
    const nextState = typeof forceState === 'boolean' ? forceState : !isAiMode;
    setIsAiMode(nextState);
    if (nextState && chatHistory.length === 0) {
      handleNewChat();
    } else if (nextState && !activeChatId && chatHistory.length > 0) {
      setActiveChatId(chatHistory[0].id);
    }
  };
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };
  
  const addMessageToChat = (chatId: string, message: AIChatMessage) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: [...chat.messages, message] } 
        : chat
    ));
  };
  
  const handleSendMessage = async (prompt: string) => {
    if (!activeChatId || !data.currentUser) return;

    const currentChatId = activeChatId;
    addMessageToChat(currentChatId, { sender: 'user', content: prompt });
    setIsLoading(true);

    // If this is the first message, generate a title
    if (activeChat?.messages.length === 0) {
        generateTitleForChat(prompt).then(title => {
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId ? { ...chat, title } : chat
            ));
        });
    }

    try {
        const result = await getAIResponse(prompt, {
            jobs: data.jobs,
            users: data.users,
            events: data.events,
            companies: data.companies,
        }, data.currentUser);

        let responseContent: React.ReactNode = "I'm sorry, I couldn't find any relevant information for that query.";

        if (result.jobs) {
            const foundJobs = data.jobs.filter(j => result.jobs!.ids.includes(j.id));
            responseContent = (
                <div className="space-y-4">
                    <p className="whitespace-pre-wrap">{result.jobs.reasoning}</p>
                    {foundJobs.map(job => {
                        const cardId = `job-${job.id}`;
                        return <JobCard key={cardId} job={job} isExpanded={expandedCardId === cardId} onToggleExpand={() => setExpandedCardId(p => p === cardId ? null : cardId)} />;
                    })}
                </div>
            );
        } else if (result.people) {
            const foundUsers = data.users.filter(u => result.people!.ids.includes(u.id));
             responseContent = (
                <div className="space-y-2">
                    <p className="whitespace-pre-wrap">{result.people.summary}</p>
                    {foundUsers.map(user => <UserCard key={user.id} user={user} />)}
                </div>
            );
        } else if (result.events) {
            const foundEvents = data.events.filter(e => result.events!.ids.includes(e.id));
             responseContent = (
                <div className="space-y-4">
                    <p className="whitespace-pre-wrap">{result.events.summary}</p>
                   {foundEvents.map(event => {
                        const cardId = `event-${event.id}`;
                        return <EventCard key={cardId} event={event} isExpanded={expandedCardId === cardId} onToggleExpand={() => setExpandedCardId(p => p === cardId ? null : cardId)} />;
                    })}
                </div>
            );
        } else if (result.general) {
            responseContent = result.general.responseText;
        }
        
        addMessageToChat(currentChatId, { sender: 'ai', content: responseContent });
    } catch (err) {
        const errorMessage = (err as Error).message;
        addMessageToChat(currentChatId, { sender: 'ai', content: `Error: ${errorMessage}` });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <Header isAiMode={isAiMode} setIsAiMode={toggleAiMode} />
      <div className="flex pt-16 h-screen">
        <Sidebar />
        <main className={`flex-1 md:pl-64 transition-all duration-300 ${isKanbanPage ? 'overflow-y-hidden' : ''}`}>
            {isAiMode ? (
                <div className="flex h-full">
                    <RecentChats
                        chatHistory={chatHistory}
                        activeChatId={activeChatId}
                        onNewChat={handleNewChat}
                        onSelectChat={handleSelectChat}
                    />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        <AIChatView
                            key={activeChatId} // Force re-render on chat switch
                            messages={activeChat?.messages || []}
                            isLoading={isLoading}
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                </div>
            ) : (
                <div className={isKanbanPage ? 'h-full' : 'p-4 sm:p-6 lg:p-8 h-full overflow-y-auto'}>
                    <Outlet />
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Layout;