import React, { useContext, useMemo, useState } from 'react';
import type { Venture, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import { HeartIcon, XMarkIcon } from '../common/Icons';
import TalentCard from './TalentCard';

interface ReviewRadarProps {
    venture: Venture;
    onMatch: (user: User) => void;
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

const ReviewRadar: React.FC<ReviewRadarProps> = ({ venture, onMatch }) => {
    const { users, ventureExpressesInterestInUser } = useContext(DataContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviewQueue = useMemo(() => {
        // Users who are interested but the venture has not yet expressed interest back
        return users.filter(user => 
            venture.interestedUsers.includes(user.id) && !venture.expressedInterest.includes(user.id)
        );
    }, [users, venture]);

    const handleMatch = () => {
        const currentUser = reviewQueue[currentIndex];
        if (currentUser) {
            // This will always be a match since the user is already interested
            const isMatch = ventureExpressesInterestInUser(venture.id, currentUser.id);
            if (isMatch) {
                onMatch(currentUser);
            }
        }
        setCurrentIndex(prev => prev + 1);
    };

    const handlePass = () => {
        // For simplicity, we just move to the next person.
        // A more robust implementation might mark them as 'passed'.
        setCurrentIndex(prev => prev + 1);
    };

    const currentUser = reviewQueue[currentIndex];

    if (reviewQueue.length === 0) {
        return (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center">
                 <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Review Queue Clear!</h3>
                 <p className="text-slate-500 dark:text-slate-400 mt-2">You've reviewed all inbound collaboration requests.</p>
            </Card>
        );
    }
    
    if (currentIndex >= reviewQueue.length) {
         return (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">That's Everyone for Now!</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">You've reviewed all pending requests.</p>
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
                    onClick={handleMatch}
                    title="Match"
                    icon={<HeartIcon className="w-10 h-10" />}
                    className="bg-white text-blue-500 border-2 border-blue-500 dark:bg-slate-700 dark:border-blue-500 dark:text-blue-400"
                 />
            </div>
        </div>
    );
};

export default ReviewRadar;