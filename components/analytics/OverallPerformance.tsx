import React from 'react';
import Card from '../common/Card';
import { EyeIcon, SparklesIcon, PostingsIcon } from '../common/Icons';
import type { Job, Story } from '../../types';

interface OverallPerformanceProps {
    appliedJobs: Job[];
    stories: Story[];
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <Card className="p-5 flex items-center gap-5">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
    </Card>
);

const OverallPerformance: React.FC<OverallPerformanceProps> = ({ appliedJobs, stories }) => {
    // These are mocked/simulated values for the demo
    const totalApplications = appliedJobs.length;
    const profileViews = 843; // Mocked
    const contentImpressions = stories.length * 456;

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Overall Performance (Last 30 Days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={<PostingsIcon />}
                    label="Total Applications"
                    value={totalApplications.toLocaleString()}
                />
                <StatCard 
                    icon={<EyeIcon />}
                    label="Profile Views"
                    value={profileViews.toLocaleString()}
                />
                <StatCard 
                    icon={<SparklesIcon />}
                    label="Content Impressions"
                    value={contentImpressions.toLocaleString()}
                />
            </div>
        </div>
    );
};

export default OverallPerformance;