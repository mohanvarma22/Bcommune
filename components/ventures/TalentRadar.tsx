import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Venture, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import { HeartIcon, XMarkIcon } from '../common/Icons';
import TalentCard from './TalentCard';

interface TalentRadarProps {
    venture: Venture;
    onMatch: (user: User) => void;
    onEditPreferences: () => void;
}

const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    className: string;
    title: string;
}> = ({ onClick, icon, className, title }) => (
    <button
        onClick={onClick}
        title={title}
        className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${className}`}
    >
        {icon}
    </button>
);

const TalentRadar: React.FC<TalentRadarProps> = ({ venture, onMatch, onEditPreferences }) => {
    const { users, ventureExpressesInterestInUser } = useContext(DataContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    const potentialMatches = useMemo(() => {
        const seekingLower = (venture.preferences?.skills || venture.seeking).map(s => s.toLowerCase());
        const locationLower = (venture.preferences?.location || 'All').toLowerCase();

        return users.filter(user => {
            if (user.id === venture.ownerId) return false;
            if (venture.expressedInterest.includes(user.id)) return false;
            
            const locationMatch = locationLower === 'all' || user.location.toLowerCase().includes(locationLower);
            if (!locationMatch) return false;

            const userSkillsLower = user.skills.map(s => s.toLowerCase());
            return seekingLower.some(seekingSkill => 
                userSkillsLower.includes(seekingSkill) || user.title.toLowerCase().includes(seekingSkill)
            );
        });
    }, [users, venture]);

    const handleInterest = () => {
        const currentUser = potentialMatches[currentIndex];
        if (currentUser) {
            const isMatch = ventureExpressesInterestInUser(venture.id, currentUser.id);
            if (isMatch) {
                onMatch(currentUser);
            }
        }
        setCurrentIndex(prev => prev + 1);
    };

    const handlePass = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const currentUser = potentialMatches[currentIndex];

    if (potentialMatches.length === 0) {
        return (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center">
                 <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Radar Clear!</h3>
                 <p className="text-slate-500 dark:text-slate-400 mt-2">No potential matches found with your current preferences.</p>
                 <button onClick={onEditPreferences} className="mt-4 inline-block px-5 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                    Adjust Preferences
                 </button>
            </Card>
        );
    }
    
    if (currentIndex >= potentialMatches.length) {
         return (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">That's Everyone for Now!</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">You've reviewed all potential matches. New users will appear here later.</p>
                <div className="flex gap-4 mt-4">
                    <button onClick={onEditPreferences} className="px-5 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                        Adjust Preferences
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-1">
                <TalentCard key={currentUser.id} user={currentUser} venture={venture} />
            </div>
            <div className="flex-shrink-0 flex justify-center gap-8 py-4">
                 <ActionButton 
                    onClick={handlePass}
                    title="Pass"
                    icon={<XMarkIcon className="w-10 h-10" />}
                    className="bg-white text-slate-500 border-2 border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400"
                 />
                 <ActionButton
                    onClick={handleInterest}
                    title="Intrigued"
                    icon={<HeartIcon className="w-10 h-10" />}
                    className="bg-white text-blue-500 border-2 border-blue-500 dark:bg-slate-700 dark:border-blue-500 dark:text-blue-400"
                 />
            </div>
        </div>
    );
};

export default TalentRadar;
