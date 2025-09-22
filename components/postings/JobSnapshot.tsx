import React, { useState } from 'react';
import type { Job } from '../../types';
import { ChevronDownIcon } from '../common/Icons';

interface JobSnapshotProps {
    job: Job;
}

const JobSnapshot: React.FC<JobSnapshotProps> = ({ job }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center p-3 text-left"
            >
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Job Snapshot</span>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Description Summary</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                            {job.description}
                        </p>
                    </div>
                     <div>
                        <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobSnapshot;