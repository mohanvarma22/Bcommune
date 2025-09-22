import React, { useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import type { User, Job, ApplicantDetails, AIAssistantAnalysis } from '../types';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';
import { CheckCircleIcon, InfoIcon, LogoIcon } from '../components/common/Icons';

const CandidateCard: React.FC<{ applicant: ApplicantDetails & { user: User } }> = ({ applicant }) => {
    const analysis = applicant.aiAssistantAnalysis;

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-5 flex-1 min-w-[320px] max-w-sm">
            <div className="flex items-center gap-4">
                <Avatar src={applicant.user.avatarUrl} alt={applicant.user.name} size="lg" />
                <div>
                    <Link to={`/profile/${applicant.user.id}`} target="_blank" className="font-bold text-lg text-blue-600 dark:text-blue-400 hover:underline">{applicant.user.name}</Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{applicant.user.title}</p>
                </div>
            </div>
            <div className="mt-4">
                 <p className="text-xs font-semibold uppercase text-slate-400">Current Status</p>
                 <p className="font-semibold text-slate-800 dark:text-slate-200">{applicant.status}</p>
            </div>
            
            {analysis ? (
                <div className="mt-4 space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">AI Fit Score</p>
                            <p className="text-md font-bold text-blue-600 dark:text-blue-400">{analysis.fitScore}%</p>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analysis.fitScore}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">AI Summary</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{analysis.summary}"</p>
                    </div>
                    <div>
                         <p className="text-xs font-semibold uppercase text-slate-400">Skill Validation</p>
                         <ul className="space-y-1.5 mt-2">
                            {analysis.skillValidation.map(skill => (
                                <li key={skill.skill} className="text-sm flex items-start gap-2">
                                    {skill.hasEvidence ? <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> : <InfoIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                                    <span className="text-slate-800 dark:text-slate-300">
                                        {skill.skill}: <span className="text-slate-500 dark:text-slate-400 text-xs">{skill.evidence}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="mt-4 text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-slate-500">No AI analysis has been run for this candidate yet.</p>
                </div>
            )}
        </div>
    );
};


const SharedDashboard: React.FC = () => {
    const { dashboardId } = useParams<{ dashboardId: string }>();
    // FIX: Destructure companies from context.
    const { sharedDashboards, jobs, users, companies } = useContext(DataContext);

    const dashboard = sharedDashboards.find(d => d.id === dashboardId);

    if (!dashboard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
                <LogoIcon />
                <h1 className="text-2xl font-bold mt-4">Dashboard Not Found</h1>
                <p className="text-slate-600">This link may be expired or incorrect.</p>
            </div>
        );
    }
    
    const job = jobs.find(j => j.id === dashboard.jobId);
    
    const applicants = dashboard.applicantUserIds.map(userId => {
        const user = users.find(u => u.id === userId);
        const details = job?.applicantDetails.find(ad => ad.userId === userId);
        if (user && details) {
            return { ...details, user };
        }
        return null;
    }).filter((a): a is ApplicantDetails & { user: User } => !!a);

    if (!job) {
        return <Navigate to="/" replace />;
    }
    
    // FIX: Find the company by ID to get its name.
    const company = companies.find(c => c.id === job.companyId);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <LogoIcon />
                        <span className="font-warnes text-2xl text-slate-900 tracking-wide dark:text-slate-100 font-bold">Bcommune</span>
                    </div>
                    <p className="text-sm text-slate-500">Shared Candidate Dashboard</p>
                    <div className="mt-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h1>
                        {/* FIX: Use the looked-up company name. */}
                        <p className="text-md text-slate-600 dark:text-slate-400">{company?.name} &middot; {job.location}</p>
                    </div>
                </header>

                <main>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {applicants.length > 0 ? (
                            applicants.map(app => (
                                <CandidateCard key={app.userId} applicant={app} />
                            ))
                        ) : (
                            <p>No candidates selected for this dashboard.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SharedDashboard;