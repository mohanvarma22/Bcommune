import React, { useContext } from 'react';
import type { User } from '../../types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const { currentUser, addConnection } = useContext(DataContext);
    const isConnected = currentUser?.connections.includes(user.id);

    return (
        <Card className="p-4 flex items-center gap-4 hover:border-blue-500/50 transition-colors duration-300">
            <Link to={`/profile/${user.id}`}>
                <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
            </Link>
            <div className="flex-1">
                <Link to={`/profile/${user.id}`} className="hover:underline">
                    <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                </Link>
                <p className="text-sm text-slate-500">{user.title}</p>
            </div>
            {isConnected ? (
                <Link 
                    to={`/messages`} 
                    state={{ preselectedUserId: user.id }} 
                    className="px-4 py-2 bg-slate-200 text-slate-800 text-sm font-semibold rounded-md hover:bg-slate-300 transition"
                >
                    Message
                </Link>
            ) : (
                <button 
                    onClick={() => addConnection(user.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition"
                >
                    Connect
                </button>
            )}
        </Card>
    );
};

export default UserCard;