import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import type { Conversation, ChatMessage, User } from '../types';
import Avatar from '../components/common/Avatar';
import { DataContext } from '../context/DataContext';

const ChatListItem: React.FC<{ conversation: Conversation; isActive: boolean; onClick: () => void }> = ({ conversation, isActive, onClick }) => {
    const { users, currentUser } = useContext(DataContext);
    const otherParticipantId = conversation.participantIds.find(id => id !== currentUser?.id);
    const otherParticipant = users.find(u => u.id === otherParticipantId);
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!otherParticipant) return null;

    return (
        <div onClick={onClick} className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
            <Avatar src={otherParticipant.avatarUrl} alt={otherParticipant.name} size="md" />
            <div className="ml-3 overflow-hidden">
                <p className="font-semibold truncate text-slate-800">{otherParticipant.name}</p>
                <p className="text-sm text-slate-500 truncate">{lastMessage?.text}</p>
            </div>
        </div>
    );
};

const MessageBubble: React.FC<{ message: ChatMessage; isOwnMessage: boolean; sender: User | undefined }> = ({ message, isOwnMessage, sender }) => (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {!isOwnMessage && sender && <Avatar src={sender.avatarUrl} alt={sender.name} size="sm" />}
        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
            <p className="text-sm">{message.text}</p>
        </div>
    </div>
);


const Messages: React.FC = () => {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const { conversations: initialConversations, users, currentUser } = useContext(DataContext);
    const location = useLocation();
    const navigate = useNavigate();
    const preselectedUserId = location.state?.preselectedUserId;

    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

    const findConversationWithUser = (userId: string) => {
        return conversations.find(c => c.participantIds.includes(currentUser?.id || '') && c.participantIds.includes(userId));
    }

    const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationId || null);
    
    useEffect(() => {
        let newActiveId: string | null = null;
        if (preselectedUserId) {
            const existingConversation = findConversationWithUser(preselectedUserId);
            newActiveId = existingConversation ? existingConversation.id : null;
             if (!existingConversation) {
                console.log("No existing conversation, would create new one here.");
                newActiveId = conversations.length > 0 ? conversations[0].id : null;
            }
        } else if (conversationId) {
            newActiveId = conversationId;
        } else if (conversations.length > 0 && !activeConversationId) {
            newActiveId = conversations[0].id;
        }

        if (newActiveId && newActiveId !== activeConversationId) {
            setActiveConversationId(newActiveId);
            if(location.pathname !== `/messages/${newActiveId}`) {
                navigate(`/messages/${newActiveId}`, { replace: true });
            }
        }
    }, [conversationId, preselectedUserId, conversations, activeConversationId, navigate, location.pathname]);
    
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversation?.messages]);

    const otherParticipant = users.find(u => u.id === activeConversation?.participantIds.find(id => id !== currentUser?.id));

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {/* Chat List */}
            <div className="w-1/3 border-r border-slate-200 overflow-y-auto flex flex-col">
                <div className="p-4 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-slate-900">Chats</h2>
                </div>
                <div className="p-2 space-y-1 flex-1">
                    {conversations.map(conv => (
                        <ChatListItem
                            key={conv.id}
                            conversation={conv}
                            isActive={conv.id === activeConversationId}
                            onClick={() => {
                                setActiveConversationId(conv.id)
                                navigate(`/messages/${conv.id}`);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col bg-white">
                {activeConversation && otherParticipant ? (
                    <>
                        <div className="p-4 border-b border-slate-200 flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-sm">
                             <Avatar src={otherParticipant.avatarUrl} alt={otherParticipant.name} size="md"/>
                             <h3 className="text-lg font-semibold text-slate-900">{otherParticipant.name}</h3>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                            <div className="space-y-4">
                               {activeConversation.messages.map(msg => {
                                   const isOwn = msg.senderId === currentUser?.id;
                                   const sender = users.find(u => u.id === msg.senderId);
                                   return <MessageBubble key={msg.id} message={msg} isOwnMessage={isOwn} sender={sender} />
                               })}
                               <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full px-4 py-2 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;