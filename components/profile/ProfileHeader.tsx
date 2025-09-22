import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { LocationIcon, MessagesIcon, PlusIcon, CheckIcon, EditIcon } from '../common/Icons';
import EditHeaderModal from './edit/EditHeaderModal';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    const { currentUser, addConnection } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isCurrentUser = currentUser?.id === user.id;
    const isConnected = currentUser?.connections.includes(user.id);

    return (
        <>
            <Card className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar src={user.avatarUrl} alt={user.name} size="xl" />
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h1>
                                <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 mt-1">{user.title}</p>
                                <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
                                    <LocationIcon className="w-5 h-5"/>
                                    <span>{user.location}</span>
                                </div>
                            </div>
                            {isCurrentUser && (
                                <button onClick={() => setIsEditModalOpen(true)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                                    <EditIcon />
                                </button>
                            )}
                        </div>
                    </div>
                    {!isCurrentUser && (
                        <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                            {isConnected ? (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-transparent border border-slate-300 text-slate-600 text-sm font-semibold rounded-md hover:bg-slate-50 transition dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                                        <CheckIcon />
                                        <span>Following</span>
                                    </button>
                                    <Link 
                                        to={`/messages`} 
                                        state={{ preselectedUserId: user.id }} 
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition"
                                    >
                                        <MessagesIcon className="w-5 h-5" />
                                        <span>Message</span>
                                    </Link>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => addConnection(user.id)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition"
                                >
                                    <PlusIcon />
                                    <span>Connect</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {user.vision && (
                    <>
                        <hr className="border-slate-200 dark:border-slate-700 my-6" />
                        <div>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{user.vision}</p>
                        </div>
                    </>
                )}
            </Card>
            {isEditModalOpen && (
                <EditHeaderModal
                    user={user}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProfileHeader;