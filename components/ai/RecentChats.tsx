import React from 'react';
import type { AIChatSession } from '../../types';
import { NewChatIcon } from '../common/Icons';

interface RecentChatsProps {
    chatHistory: AIChatSession[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (chatId: string) => void;
}

const RecentChats: React.FC<RecentChatsProps> = ({ chatHistory, activeChatId, onNewChat, onSelectChat }) => {
    return (
        <aside className="w-64 bg-slate-100 border-r border-slate-200 flex-col p-2 text-slate-800 hidden md:flex h-full">
            <div className="flex-shrink-0 mb-2">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-slate-300 hover:bg-slate-200 transition"
                >
                    <span>New Chat</span>
                    <NewChatIcon />
                </button>
            </div>

            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {chatHistory.map(chat => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md truncate transition-colors ${
                            activeChatId === chat.id ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
                        }`}
                        title={chat.title}
                    >
                        {chat.title}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default RecentChats;
