import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import type { ChatMessage, User } from '../../types';

interface ApplicationUpdatesProps {
    jobId: string;
}

const ApplicationUpdates: React.FC<ApplicationUpdatesProps> = ({ jobId }) => {
    const { conversations, users, currentUser } = useContext(DataContext);

    // Find all messages related to this job application
    // Note: Simple sorting, a real app would use real timestamps.
    const jobMessages: ChatMessage[] = conversations
        .flatMap(conv => conv.messages)
        .filter(msg => msg.jobId === jobId)
        .reverse(); // Show most recent first

    if (jobMessages.length === 0) {
        return (
            <div>
                 <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">Updates & Messages</h4>
                 <p className="text-sm text-center text-slate-500 py-4">No updates or messages yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">Updates & Messages</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto p-2 border-t border-slate-200 dark:border-slate-700">
                {jobMessages.map(message => {
                    const sender = users.find(u => u.id === message.senderId);
                    if (!sender) return null;

                    const isOwnMessage = sender.id === currentUser?.id;

                    return (
                        <div key={message.id} className={`flex items-start gap-3 ${isOwnMessage ? 'justify-end' : ''}`}>
                             {!isOwnMessage && (
                                 <Link to={`/profile/${sender.id}`}>
                                    <Avatar src={sender.avatarUrl} alt={sender.name} size="md" />
                                 </Link>
                             )}
                            <div className={`max-w-md rounded-lg p-3 ${isOwnMessage ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">{message.timestamp}</p>
                            </div>
                            {isOwnMessage && currentUser && (
                                <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationUpdates;
