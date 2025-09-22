import React, { useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import JobPostingManager from '../../components/postings/JobPostingManager';
import { UsersIcon } from '../../components/common/Icons';

const CompanyJobs: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { jobs, companies, currentUser, activeProfile } = useContext(DataContext);
    
    // Security check: ensure the active profile matches the URL
    if (activeProfile.type !== 'company' || activeProfile.id !== companyId) {
        return <Navigate to="/feed" replace />;
    }
    
    const company = companies.find(c => c.id === companyId);
    
    // Security check: ensure the current user is part of the company's team
    if (!company || !company.team.some(member => member.userId === currentUser?.id)) {
        return <Navigate to="/feed" replace />;
    }

    const companyJobs = jobs.filter(job => job.companyId === companyId);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">Manage Job Postings</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">View, edit, and manage all job postings for {company.name}.</p>
                </div>
            </div>
            <JobPostingManager jobs={companyJobs} />
        </div>
    );
};

export default CompanyJobs;