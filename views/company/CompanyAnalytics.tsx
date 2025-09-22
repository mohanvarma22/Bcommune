import React, { useContext, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import OverallPerformance from '../../components/analytics/OverallPerformance';
import JobPostFunnel from '../../components/analytics/JobPostFunnel';
import ContentEngagement from '../../components/analytics/ContentEngagement';
import AudienceSkills from '../../components/analytics/AudienceSkills';

const CompanyAnalytics: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { companies, jobs, stories, users, currentUser, activeProfile } = useContext(DataContext);

    // Security check: ensure the active profile matches the URL
    if (activeProfile.type !== 'company' || activeProfile.id !== companyId) {
        return <Navigate to="/feed" replace />;
    }

    const company = companies.find(c => c.id === companyId);
    
    // Security check: ensure the current user is part of the company's team
    if (!company || !company.team.some(member => member.userId === currentUser?.id)) {
        return <Navigate to="/feed" replace />;
    }

    const companyJobs = useMemo(() => jobs.filter(job => job.companyId === companyId), [jobs, companyId]);
    const companyStories = useMemo(() => stories.filter(story => story.companyId === companyId), [stories, companyId]);

    // For OverallPerformance, we can create a mock "company user" object
    const companyAsUser = {
        ...currentUser, // Use some base from currentUser
        id: company.id,
        name: company.name,
        connections: [], // Companies don't have connections in this context
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{company.name} Analytics</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">Actionable insights on your posts and audience.</p>
            </div>
            
            {/* Note: OverallPerformance is using mock data and is less relevant for companies, but we reuse for consistency */}
            {/* <OverallPerformance jobs={companyJobs} stories={companyStories} currentUser={companyAsUser} /> */}
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="xl:col-span-2 space-y-8">
                    <JobPostFunnel jobs={companyJobs} />
                    <ContentEngagement stories={companyStories} />
                </div>
                <div className="xl:col-span-1">
                    <AudienceSkills />
                </div>
            </div>
        </div>
    );
};

export default CompanyAnalytics;