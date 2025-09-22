import React, { useContext, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import ApplyConfirmModal from '../jobs/ApplyConfirmModal';
import InterviewProcessSection from '../jobs/InterviewProcessSection';
import AIFitAnalyzer from '../jobs/AIFitAnalyzer';

interface JobDetailPaneProps {
    jobId: string;
    onViewCompany: (companyId: string) => void;
    onViewUser: (userId: string) => void;
}


const DetailSection: React.FC<{title: string, items?: string[]}> = ({title, items}) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{title}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );
};

const JobDetailPane: React.FC<JobDetailPaneProps> = ({ jobId, onViewCompany, onViewUser }) => {
    const { jobs, users, companies, currentUser, applyForJob } = useContext(DataContext);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
        return <p>Job not found.</p>;
    }
    
    const company = companies.find(c => c.id === job.companyId);
    const poster = users.find(u => u.id === job.posterId);

    if (!company) {
        return <p>Company not found for this job.</p>
    }

    const isOwner = currentUser?.id === job.posterId;
    const hasApplied = job.applicantDetails.some(ad => ad.userId === currentUser?.id);

    return (
        <>
            <div className="p-6">
                <button onClick={() => onViewCompany(company.id)} className="text-md text-slate-500 dark:text-slate-400 hover:underline">{company.name} &middot; {job.location}</button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{job.title}</h1>
                 <div className="flex flex-wrap items-center gap-2 mt-4">
                     <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                        {job.type}
                    </span>
                    {job.experienceLevel && (
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full dark:bg-slate-700 dark:text-slate-300">
                            {job.experienceLevel} Level
                        </span>
                    )}
                     {job.salaryRange && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full dark:bg-green-900/50 dark:text-green-300">
                            {job.salaryRange}
                        </span>
                    )}
                </div>
                {!isOwner && currentUser && (
                    <div className="mt-6 text-left">
                        <AIFitAnalyzer job={job} user={currentUser} />
                        <button 
                            onClick={() => setIsApplyModalOpen(true)}
                            disabled={hasApplied}
                            className="w-full sm:w-auto px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                            {hasApplied ? 'Applied' : 'Apply Now'}
                        </button>
                    </div>
                )}

                 <div className="mt-8 prose max-w-none text-slate-600 dark:text-slate-400 space-y-6">
                    {poster && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Hiring Manager</h3>
                            <button onClick={() => onViewUser(poster.id)} className="flex items-center gap-3 group text-left">
                                <Avatar src={poster.avatarUrl} alt={poster.name} size="md" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:underline">{poster.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{poster.title}</p>
                                </div>
                            </button>
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Job Description</h2>
                        <p className="whitespace-pre-wrap">{job.description}</p>
                    </div>
                    <DetailSection title="Key Responsibilities" items={job.responsibilities} />
                    <DetailSection title="Qualifications" items={job.qualifications} />
                    <DetailSection title="Benefits & Perks" items={job.benefits} />
                    <InterviewProcessSection 
                        rounds={job.interviewRounds ?? []} 
                        titleClassName="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3"
                    />
                </div>
            </div>
             {isApplyModalOpen && (
                <ApplyConfirmModal
                    isOpen={isApplyModalOpen}
                    onClose={() => setIsApplyModalOpen(false)}
                    onConfirm={() => applyForJob(job.id)}
                    jobTitle={job.title}
                    companyName={company.name}
                />
            )}
        </>
    );
};

export default JobDetailPane;