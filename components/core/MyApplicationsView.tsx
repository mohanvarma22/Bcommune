import React, { useState } from 'react';
import type { Job } from '../../types';
import ApplicationCard from './ApplicationCard';

interface MyApplicationsViewProps {
    appliedJobs: Job[];
    onBack: () => void;
    isTabbedView?: boolean;
}

const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({ appliedJobs, onBack, isTabbedView = false }) => {
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    // Sort by most recent application first
    const sortedJobs = [...appliedJobs].reverse();

    const handleToggleExpand = (jobId: string) => {
        setExpandedCardId(prevId => (prevId === jobId ? null : jobId));
    };

    return (
        <div>
            {!isTabbedView && (
                <div className="mb-6">
                    <button onClick={onBack} className="text-sm font-semibold text-blue-600 hover:underline mb-2">
                        &larr; Back to Job Search
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Applications ({appliedJobs.length})</h2>
                    <p className="text-slate-500 dark:text-slate-400">Track the status of opportunities you've applied for.</p>
                </div>
            )}
            
            <div className="space-y-6">
                {sortedJobs.length > 0 ? (
                    sortedJobs.map(job => (
                        <ApplicationCard 
                            key={job.id} 
                            job={job}
                            isExpanded={expandedCardId === job.id}
                            onToggleExpand={() => handleToggleExpand(job.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Applications Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">You haven't applied for any jobs yet.</p>
                        <button onClick={onBack} className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                            Discover Opportunities
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsView;
