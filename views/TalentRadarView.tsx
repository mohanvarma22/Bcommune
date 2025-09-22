import React, { useContext, useState, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import TalentRadar from '../components/ventures/TalentRadar';
import TalentPreferencesModal from '../components/ventures/TalentPreferencesModal';
import MatchModal from '../components/ventures/MatchModal';
import type { User } from '../types';
import ReviewRadar from '../components/ventures/ReviewRadar';
import FirstBelieversList from '../components/ventures/FirstBelieversList';

type ActiveTab = 'discover' | 'review';
type ActiveReviewSubTab = 'collaborators' | 'believers';

const TalentRadarView: React.FC = () => {
    const { ventureId } = useParams<{ ventureId: string }>();
    const { ventures, currentUser } = useContext(DataContext);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [matchedUser, setMatchedUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
    const [activeReviewSubTab, setActiveReviewSubTab] = useState<ActiveReviewSubTab>('collaborators');
    
    const venture = ventures.find(v => v.id === ventureId);

    if (!currentUser || !venture || venture.ownerId !== currentUser.id) {
        return <Navigate to={`/profile/${currentUser?.id || ''}`} replace />;
    }
    
    const newRequestsCount = useMemo(() => {
        return venture.interestedUsers.filter(uid => !venture.expressedInterest.includes(uid)).length;
    }, [venture]);

    const handleMatch = (user: User) => {
        setMatchedUser(user);
    };
    
    const MainTabButton: React.FC<{ tabName: ActiveTab, label: string, count?: number }> = ({ tabName, label, count }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`relative px-4 py-2 text-sm font-semibold rounded-md transition-colors flex-1 ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {label} 
            {typeof count !== 'undefined' && count > 0 && (
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {count}
                </span>
            )}
        </button>
    );

    const SubTabButton: React.FC<{ tabName: ActiveReviewSubTab, label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveReviewSubTab(tabName)}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${activeReviewSubTab === tabName ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
        >
            {label}
        </button>
    );

    return (
        <>
            <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className="mb-4">
                     <Link to={`/profile/${currentUser.id}`} state={{ openVenturesTab: true }} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
                        &larr; Back to My Ventures
                    </Link>
                    <div className="md:flex md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Talent Connection Hub</h1>
                            <p className="text-lg text-slate-500 dark:text-slate-400">Discover talent and review interest for <span className="font-semibold text-blue-600">{venture.name}</span>.</p>
                        </div>
                         <div className="flex items-center gap-4 mt-2 md:mt-0">
                             <button onClick={() => setIsPreferencesOpen(true)} className="px-3 py-1.5 text-sm font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                                Set Preferences
                             </button>
                        </div>
                    </div>
                </div>
                 <div className="p-1 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 w-full max-w-sm">
                    <MainTabButton tabName="discover" label="Discover" />
                    <MainTabButton tabName="review" label="Review" count={newRequestsCount} />
                </div>
                
                <main className="flex-1">
                    {activeTab === 'discover' && <TalentRadar venture={venture} onMatch={handleMatch} onEditPreferences={() => setIsPreferencesOpen(true)} />}
                    
                    {activeTab === 'review' && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <SubTabButton tabName="collaborators" label="Potential Collaborators" />
                                <SubTabButton tabName="believers" label="First Believers" />
                            </div>
                            <div className="flex-1">
                                {activeReviewSubTab === 'collaborators' && <ReviewRadar venture={venture} onMatch={handleMatch} />}
                                {activeReviewSubTab === 'believers' && <FirstBelieversList venture={venture} />}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            {isPreferencesOpen && (
                <TalentPreferencesModal 
                    isOpen={isPreferencesOpen}
                    onClose={() => setIsPreferencesOpen(false)}
                    venture={venture}
                />
            )}
            {matchedUser && (
                <MatchModal 
                    isOpen={!!matchedUser}
                    onClose={() => setMatchedUser(null)}
                    venture={venture}
                    matchedUser={matchedUser}
                />
            )}
        </>
    );
};

export default TalentRadarView;