import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import OverallPerformance from '../components/analytics/OverallPerformance';
import ApplicationFunnel from '../components/analytics/ApplicationFunnel';
import ContentEngagement from '../components/analytics/ContentEngagement';
import AudienceSkills from '../components/analytics/AudienceSkills';

const Analytics: React.FC = () => {
    const { currentUser, jobs, stories } = useContext(DataContext);

    if (!currentUser) {
        return <div className="text-center py-12">Loading user data...</div>;
    }

    const appliedJobs = jobs.filter(job => job.applicantDetails.some(applicant => applicant.userId === currentUser.id));
    const myStories = stories.filter(story => story.authorId === currentUser.id && !story.companyId);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your Personal Dashboard</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">Insights on your applications, profile, and content.</p>
            </div>

            <OverallPerformance appliedJobs={appliedJobs} stories={myStories} />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="xl:col-span-2 space-y-8">
                    <ApplicationFunnel appliedJobs={appliedJobs} />
                    <ContentEngagement stories={myStories} />
                </div>
                <div className="xl:col-span-1">
                    <AudienceSkills />
                </div>
            </div>
        </div>
    );
};

export default Analytics;