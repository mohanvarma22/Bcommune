import React, { useContext } from 'react';
import Card from '../common/Card';
import type { Job } from '../../types';
import { Link } from 'react-router-dom';
// FIX: Import DataContext to access companies.
import { DataContext } from '../../context/DataContext';

interface JobPostFunnelProps {
    jobs: Job[];
}

// Simple hash function to generate consistent "random" numbers for demo
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; 
    }
    return Math.abs(hash);
};


const JobPostFunnel: React.FC<JobPostFunnelProps> = ({ jobs }) => {
    // FIX: Get companies from context to look up names.
    const { companies } = useContext(DataContext);

    return (
        <Card>
            <div className="p-5 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Job Post Funnel</h3>
                <p className="text-sm text-slate-500">Track how your opportunities are performing.</p>
            </div>
            <div className="divide-y divide-slate-200">
                {jobs.length > 0 ? jobs.map(job => {
                    // Mocked data based on job ID for consistency
                    const impressions = simpleHash(job.id) % 5000 + 1000;
                    const views = Math.floor(impressions * (simpleHash(job.title) % 30 + 5) / 100);
                    const conversionRate = ((views / impressions) * 100).toFixed(1);
                    // FIX: Find the company object to get its name.
                    const company = companies.find(c => c.id === job.companyId);

                    return (
                        <div key={job.id} className="p-5 grid grid-cols-4 gap-4 items-center">
                            <div className="col-span-2">
                                <Link to={`/jobs/${job.id}`} className="font-semibold text-blue-600 hover:underline truncate">
                                    {job.title}
                                </Link>
                                {/* FIX: Display the company name. */}
                                <p className="text-sm text-slate-500 truncate">{company?.name}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-slate-900">{impressions.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Impressions</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-slate-900">{views.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Views ({conversionRate}%)</p>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="p-8 text-center text-slate-500">You haven't posted any jobs yet.</p>
                )}
            </div>
        </Card>
    );
};

export default JobPostFunnel;
