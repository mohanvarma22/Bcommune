import React, { useContext, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import StoryPostingManager from '../../components/postings/StoryPostingManager';
import EventPostingManager from '../../components/postings/EventPostingManager';

type ActiveTab = 'stories' | 'events';

const CompanyContent: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { stories, events, companies, currentUser, activeProfile } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<ActiveTab>('stories');

    if (activeProfile.type !== 'company' || activeProfile.id !== companyId) {
        return <Navigate to="/feed" replace />;
    }

    const company = companies.find(c => c.id === companyId);
    if (!company || !company.team.some(member => member.userId === currentUser?.id)) {
        return <Navigate to="/feed" replace />;
    }

    const companyStories = stories.filter(story => story.companyId === companyId);
    const companyEvents = events.filter(event => event.companyId === companyId);

    const TabButton: React.FC<{ tabName: ActiveTab, label: string, count: number }> = ({ tabName, label, count }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {label} <span className="text-xs bg-slate-200/50 px-1.5 py-0.5 rounded-full dark:bg-slate-600/50">{count}</span>
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">Manage Content</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Manage all stories and events published by {company.name}.</p>
            
            <div className="p-1 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 w-full max-w-xs">
                <TabButton tabName="stories" label="Stories" count={companyStories.length} />
                <TabButton tabName="events" label="Events" count={companyEvents.length} />
            </div>

            <div>
                {activeTab === 'stories' && <StoryPostingManager stories={companyStories} />}
                {activeTab === 'events' && <EventPostingManager events={companyEvents} />}
            </div>
        </div>
    );
};

export default CompanyContent;
