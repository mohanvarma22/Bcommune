import React, { useContext, useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
// FIX: Added GlobeAltIcon to imports
import { BuildingIcon, CheckBadgeIcon, GlobeAltIcon, UsersIcon } from '../components/common/Icons';
import JobCard from '../components/jobs/JobCard';

interface CompanyProfileProps {
    companyId?: string;
    isPane?: boolean;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyId: propCompanyId, isPane = false }) => {
    const params = useParams<{ companyId: string }>();
    const companyId = propCompanyId || params.companyId;

    const { companies, jobs, currentUser } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<'about' | 'jobs'>(isPane ? 'about' : 'jobs');
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const company = companies.find(c => c.id === companyId);

    const companyJobs = useMemo(() => {
        if (!company) return [];
        return jobs.filter(j => j.companyId === company.id);
    }, [jobs, company]);

    if (!company) {
        if (isPane) return <div className="p-8 text-center text-slate-500">Company not found.</div>;
        return <Navigate to="/feed" replace />;
    }

    const handleToggleExpand = (jobId: string) => {
        setExpandedJobId(prevId => (prevId === jobId ? null : jobId));
    };

    const TabButton: React.FC<{ tabName: 'about' | 'jobs'; label: string; count?: number }> = ({ tabName, label, count }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {label} {typeof count !== 'undefined' && <span className="text-xs bg-slate-200/50 px-1.5 py-0.5 rounded-full dark:bg-slate-600/50">{count}</span>}
        </button>
    );

    return (
        <div className={!isPane ? "max-w-4xl mx-auto" : "h-full"}>
            <div className={isPane ? "p-6" : "p-8 mb-6"}>
                 <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar src={company.logoUrl} alt={company.name} size="xl" />
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className={`${isPane ? 'text-2xl' : 'text-4xl'} font-bold text-slate-900 dark:text-slate-100`}>{company.name}</h1>
                            {/* FIX: Replaced the 'title' prop on CheckBadgeIcon with a wrapping span to provide a tooltip, resolving the TypeScript error. */}
                            {company.isVerified && <span title="Verified Company"><CheckBadgeIcon className="w-7 h-7 text-blue-500" /></span>}
                        </div>
                        <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">{company.tagline}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-slate-500 dark:text-slate-400">
                             <div className="flex items-center gap-1.5"><BuildingIcon className="w-4 h-4" /><span>{company.industry}</span></div>
                             <div className="flex items-center gap-1.5"><UsersIcon className="w-4 h-4" /><span>{company.size}</span></div>
                             <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition">
                                <GlobeAltIcon className="w-4 h-4" /><span>{company.website}</span>
                             </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-1 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 w-full max-w-xs ${isPane ? 'mx-6' : ''}`}>
                <TabButton tabName="jobs" label="Jobs" count={companyJobs.length} />
                <TabButton tabName="about" label="About" />
            </div>

            <div className={isPane ? "px-6 pb-6" : ""}>
                 {activeTab === 'about' && (
                    <Card className="p-8 space-y-6">
                         <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">About {company.name}</h3>
                            <p className="text-slate-600 whitespace-pre-wrap">{company.about}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Vision</h3>
                            <p className="text-slate-600 whitespace-pre-wrap">{company.vision}</p>
                        </div>
                    </Card>
                )}

                {activeTab === 'jobs' && (
                    <div className="space-y-6">
                        {companyJobs.length > 0 ? (
                            companyJobs.map(job => (
                                 <JobCard 
                                    key={job.id} 
                                    job={job}
                                    isExpanded={expandedJobId === job.id}
                                    onToggleExpand={() => handleToggleExpand(job.id)}
                                />
                            ))
                        ) : (
                            <Card className="p-8 text-center text-slate-500">
                                {company.name} has no open positions at the moment.
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;