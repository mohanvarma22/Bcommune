import React, { useState, useContext, useMemo } from 'react';
import Modal from './Modal';
import Card from './Card';
import { DataContext } from '../../context/DataContext';
import Avatar from './Avatar';
import { SearchIcon } from './Icons';
import type { User } from '../../types';

interface ShareViaMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemType: 'job' | 'story';
    itemId: string;
    itemTitle: string;
}

const ShareViaMessageModal: React.FC<ShareViaMessageModalProps> = ({ isOpen, onClose, itemType, itemId, itemTitle }) => {
    const { currentUser, users, findOrCreateConversation, sendMessage } = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const connections = useMemo(() => {
        return users.filter(u => currentUser?.connections.includes(u.id));
    }, [users, currentUser]);

    const filteredConnections = useMemo(() => {
        return connections.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [connections, searchTerm]);

    const handleSend = () => {
        if (!selectedUserId) return;
        
        const url = `${window.location.origin}${window.location.pathname}#/${itemType}s/${itemId}`;
        const messageText = `Check out this ${itemType}: "${itemTitle}"\n${url}`;
        
        const conversation = findOrCreateConversation(selectedUserId);
        sendMessage(conversation.id, messageText);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="max-h-[80vh] flex flex-col">
                <div className="p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Share via Message</h2>
                    <p className="text-sm text-slate-500 truncate">Sharing: {itemTitle}</p>
                </div>

                <div className="p-4 border-b border-slate-200">
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search connections..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-800 placeholder-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 p-2 overflow-y-auto space-y-1">
                    {filteredConnections.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => setSelectedUserId(user.id)}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedUserId === user.id ? 'bg-blue-100' : 'hover:bg-slate-50'}`}
                        >
                            <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                            <div>
                                <p className="font-semibold text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button 
                        onClick={handleSend}
                        disabled={!selectedUserId}
                        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default ShareViaMessageModal;