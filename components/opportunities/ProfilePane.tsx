import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import { LocationIcon } from '../common/Icons';

interface ProfilePaneProps {
    userId: string;
}

const ProfilePane: React.FC<ProfilePaneProps> = ({ userId }) => {
    const { users } = useContext(DataContext);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return <div className="p-4 text-slate-500">User not found.</div>;
    }

    const latestExperience = user.experience[0];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">{user.name}</h3>
                    <p className="text-md text-blue-600 dark:text-blue-400">{user.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <LocationIcon className="w-4 h-4" />
                        <span>{user.location}</span>
                    </div>
                </div>
            </div>

            {user.vision && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{user.vision}"</p>
                </div>
            )}
            
            <div>
                <h4 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                    {user.skills.slice(0, 7).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {latestExperience && (
                <div>
                    <h4 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">Latest Experience</h4>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{latestExperience.role} at {latestExperience.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{latestExperience.description}</p>
                    </div>
                </div>
            )}

            <Link 
                to={`/profile/${user.id}`} 
                className="block w-full text-center px-4 py-2 text-sm font-semibold bg-white text-slate-800 rounded-md hover:bg-slate-100 transition border border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600"
            >
                View Full Profile
            </Link>
        </div>
    );
};

export default ProfilePane;