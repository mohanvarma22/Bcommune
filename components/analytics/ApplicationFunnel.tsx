import React, { useContext } from 'react';
import Card from '../common/Card';
import type { Job } from '../../types';
import { DataContext } from '../../context/DataContext';

interface ApplicationFunnelProps {
    appliedJobs: Job[];
}

const ApplicationFunnel: React.FC<ApplicationFunnelProps> = ({ appliedJobs }) => {
    const { currentUser } = useContext(DataContext);

    if (!currentUser) return null;

    const funnelData = appliedJobs.reduce((acc, job) => {
        const userApp = job.applicantDetails.find(app => app.userId === currentUser.id);
        if (!userApp) return acc;

        acc.total += 1;
        if (userApp.status !== 'Applied' && userApp.status !== 'Rejected') {
            acc.reviewed += 1;
        }
        if (job.interviewRounds.map(r => r.name).includes(userApp.status)) {
            acc.interviews += 1;
        }
        if (userApp.status === 'Hired') {
            acc.offers += 1;
        }
        return acc;
    }, {
        total: 0,
        reviewed: 0,
        interviews: 0,
        offers: 0,
    });

    const funnelSteps = [
        { label: 'Applications Sent', value: funnelData.total },
        { label: 'Reviewed by Team', value: funnelData.reviewed },
        { label: 'Interviews', value: funnelData.interviews },
        { label: 'Offers', value: funnelData.offers },
    ];

    const maxValue = Math.max(funnelData.total, 1);

    return (
        <Card>
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Application Funnel</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track your progress across all applications.</p>
            </div>
            {appliedJobs.length > 0 ? (
                <div className="p-5 space-y-4">
                    {funnelSteps.map(step => (
                        <div key={step.label}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{step.label}</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{step.value}</p>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${(step.value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="p-8 text-center text-slate-500 dark:text-slate-400">Apply for jobs to see your funnel here.</p>
            )}
        </Card>
    );
};

export default ApplicationFunnel;