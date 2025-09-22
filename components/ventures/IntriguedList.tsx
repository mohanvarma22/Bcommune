import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Venture, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { SparklesIcon, MessagesIcon } from '../common/Icons';

interface IntriguedListProps {
    venture: Venture;
}

const IntriguedList: React.FC<IntriguedListProps> = ({ venture }) => {
    const { users } = useContext(DataContext);
    const navigate = useNavigate();

    const intriguedUsers = users.filter(u => venture.expressedInterest.includes(u.id));

    const handleStartConversation = (userId: string) => {
        navigate('/messages', { state: { preselectedUserId: userId } });
    };

    if (intriguedUsers.length === 0) {
        return (
            <Card className="text-center p-8 text-slate-500 dark:text-slate-400">
                You haven't expressed interest in any collaborators yet. Go to the "Discover" tab to find potential matches!
            </Card>
        );
    }

    return (
        <Card className="dark:bg-slate-800">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {intriguedUsers.map(user => {
                    const isMutual = venture.interestedUsers.includes(user.id);
                    return (
                        <div key={user.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <Link to={`/profile/${user.id}`} className="flex items-center gap-4 group">
                                <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:underline">{user.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.title}</p>
                                </div>
                            </Link>
                            {isMutual ? (
                                <button 
                                    onClick={() => handleStartConversation(user.id)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    <MessagesIcon className="w-5 h-5" />
                                    <span>Start Conversation</span>
                                </button>
                            ) : (
                                <span className="w-full sm:w-auto text-center px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                    Pending
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default IntriguedList;
