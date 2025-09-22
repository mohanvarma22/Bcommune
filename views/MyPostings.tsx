import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import EventPostingManager from '../components/postings/EventPostingManager';
import StoryPostingManager from '../components/postings/StoryPostingManager';
import MyApplicationsView from '../components/core/MyApplicationsView';

type ActiveTab = 'applications' | 'events' | 'stories';

const MyActivity: React.FC = () => {
    const { currentUser, jobs, events, stories } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<ActiveTab>('applications');

    if (!currentUser) {
        return <div className="text-center py-12">Loading...</div>;
    }

    // Filter for personal events and stories only (no companyId)
    const myEvents = events.filter(e => e.authorId === currentUser.id && !e.companyId);
    const myStories = stories.filter(s => s.authorId === currentUser.id && !s.companyId);
    const myApplications = jobs.filter(job => job.applicantDetails.some(applicant => applicant.userId === currentUser.id));


    const TabButton: React.FC<{ tabName: ActiveTab, label: string, count: number }> = ({ tabName, label, count }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
        >
            {label} <span className="text-xs bg-slate-200/50 px-1.5 py-0.5 rounded-full">{count}</span>
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Manage Your Activity</h1>
            <p className="text-lg text-slate-500 mb-6">View and take action on your posts and applications.</p>

            <div className="flex items-center gap-2 p-1 bg-white/80 border border-slate-200 rounded-lg mb-6 sticky top-[70px] z-20 backdrop-blur-sm">
                <TabButton tabName="applications" label="My Applications" count={myApplications.length} />
                <TabButton tabName="stories" label="Stories Written" count={myStories.length} />
                <TabButton tabName="events" label="Events Created" count={myEvents.length} />
            </div>

            <div>
                {activeTab === 'applications' && <MyApplicationsView appliedJobs={myApplications} onBack={() => {}} isTabbedView />}
                {activeTab === 'events' && <EventPostingManager events={myEvents} />}
                {activeTab === 'stories' && <StoryPostingManager stories={myStories} />}
            </div>
        </div>
    );
};

export default MyActivity;