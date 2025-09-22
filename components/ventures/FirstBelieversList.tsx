import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import type { Venture } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { CheckIcon } from '../common/Icons';

interface FirstBelieversListProps {
    venture: Venture;
}

const FirstBelieversList: React.FC<FirstBelieversListProps> = ({ venture }) => {
    const { users, acknowledgeFirstBeliever } = useContext(DataContext);

    const firstBelievers = users.filter(u => venture.firstBelievers.includes(u.id));

    if (firstBelievers.length === 0) {
        return (
            <Card className="text-center p-8 text-slate-500 dark:text-slate-400">
                No one has signed up as a First Believer yet.
            </Card>
        );
    }

    return (
        <Card className="dark:bg-slate-800">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">First Believers ({firstBelievers.length})</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your earliest supporters who want to follow your journey.</p>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {firstBelievers.map(user => {
                    const isAcknowledged = venture.acknowledgedBelievers.includes(user.id);
                    return (
                        <div key={user.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <Link to={`/profile/${user.id}`} className="flex items-center gap-4 group">
                                <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:underline">{user.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.title}</p>
                                </div>
                            </Link>
                            {isAcknowledged ? (
                                <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-300">
                                    <CheckIcon />
                                    <span>Acknowledged</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => acknowledgeFirstBeliever(venture.id, user.id)}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Acknowledge & Thank
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default FirstBelieversList;