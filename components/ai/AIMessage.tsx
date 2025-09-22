import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import { AIIcon } from '../common/Icons';

interface AIMessageProps {
    sender: 'user' | 'ai';
    content: React.ReactNode;
}

const AIMessage: React.FC<AIMessageProps> = ({ sender, content }) => {
    const { currentUser } = useContext(DataContext);
    const isUser = sender === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full text-white">
                    <AIIcon className="w-6 h-6" />
                </div>
            )}
            <div
                className={`max-w-xl rounded-2xl p-4 ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
            >
                {typeof content === 'string' ? <p className="whitespace-pre-wrap">{content}</p> : content}
            </div>
             {isUser && currentUser && (
                <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
            )}
        </div>
    );
};

export default AIMessage;