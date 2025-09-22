import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '../../types';
import Card from '../common/Card';
import { EditIcon, EyeIcon, UsersIcon, EllipsisVerticalIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';

interface JobPostingManagerProps {
    jobs: Job[];
}

const Stat: React.FC<{ icon: React.ReactNode, value: number, label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-sm font-medium">{value.toLocaleString()} {label}</span>
    </div>
);

const JobPostingManager: React.FC<JobPostingManagerProps> = ({ jobs }) => {
    // FIX: Destructure companies from context.
    const { updateJobStatus, companies } = useContext(DataContext);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-slate-700">No Jobs Posted</h3>
                <p className="text-slate-500 mt-2">Post a job to attract talent from the ecosystem.</p>
                <Link to="/create/job" className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                    Post a Job
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {jobs.map(job => {
                const isClosed = job.status === 'Closed';
                const views = job.applicantDetails.length * 13; // Mocked data
                // FIX: Find company by ID to get its name.
                const company = companies.find(c => c.id === job.companyId);

                return (
                    <Card key={job.id} className={`transition-opacity ${isClosed ? 'opacity-60' : ''}`}>
                        <div className="p-5">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {job.status}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                                    </div>
                                    {/* FIX: Use company name from the looked-up company object. */}
                                    <p className="text-sm text-slate-500 mt-1">{company?.name} &middot; {job.location}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <Stat icon={<UsersIcon />} value={job.applicantDetails.length} label="Applicants" />
                                    <Stat icon={<EyeIcon />} value={views} label="Views" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap justify-end items-center gap-2">
                            <Link to={`/my-activity/job/${job.id}/applicants`} className="px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                View Applicants
                            </Link>
                            <div className="relative" ref={openMenuId === job.id ? menuRef : null}>
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                                >
                                    <EllipsisVerticalIcon />
                                </button>
                                {openMenuId === job.id && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                                        <Link to={`/jobs/${job.id}`} onClick={() => setOpenMenuId(null)} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">View Job</Link>
                                        <button onClick={() => { alert('Edit not implemented'); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                                        <button 
                                            onClick={() => { updateJobStatus(job.id, isClosed ? 'Open' : 'Closed'); setOpenMenuId(null); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            {isClosed ? 'Reopen Posting' : 'Close Posting'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default JobPostingManager;
