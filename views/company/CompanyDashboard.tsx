import React, { useContext, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import { EyeIcon, UsersIcon, PostingsIcon } from '../../components/common/Icons';
import { DataContext } from '../../context/DataContext';
import type { Job, User } from '../../types';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <Card className="p-5 flex items-center gap-5 dark:bg-slate-800">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
    </Card>
);

const RecentActivityItem: React.FC<{ applicant: User, job: Job }> = ({ applicant, job }) => (
    <Link to={`/my-activity/job/${job.id}/applicants`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
        <Avatar src={applicant.avatarUrl} alt={applicant.name} size="md" />
        <div className="text-sm">
            <p className="text-slate-800 dark:text-slate-200">
                <span className="font-semibold">{applicant.name}</span> just applied for <span className="font-semibold text-blue-600">{job.title}</span>.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Just now</p>
        </div>
    </Link>
);


const CompanyDashboard: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { jobs, users } = useContext(DataContext);

    const companyJobs = useMemo(() => jobs.filter(j => j.companyId === companyId), [jobs, companyId]);

    const stats = useMemo(() => {
        const activeJobs = companyJobs.filter(j => j.status === 'Open').length;
        const totalApplicants = companyJobs.reduce((sum, job) => sum + job.applicantDetails.length, 0);
        const totalViews = totalApplicants * 13; // Mocked for demo
        return { activeJobs, totalApplicants, totalViews };
    }, [companyJobs]);

    const recentApplicants = useMemo(() => {
        return companyJobs
            .flatMap(job => job.applicantDetails.map(ad => ({ ...ad, job })))
            .slice(0, 5) // Mocking recency
            .map(({ userId, job }) => ({
                user: users.find(u => u.id === userId),
                job,
            }))
            .filter(item => item.user);
    }, [companyJobs, users]);

    const applicantsToReview = useMemo(() => {
        return companyJobs.reduce((sum, job) => {
            return sum + job.applicantDetails.filter(ad => ad.status === 'Applied').length;
        }, 0);
    }, [companyJobs]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Company Dashboard</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">Here's a snapshot of your company's activity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<PostingsIcon />} label="Active Job Postings" value={stats.activeJobs.toString()} />
                <StatCard icon={<UsersIcon />} label="Total Applicants" value={stats.totalApplicants.toLocaleString()} />
                <StatCard icon={<EyeIcon />} label="Total Job Views" value={stats.totalViews.toLocaleString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card className="dark:bg-slate-800">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Needs Action</h3>
                    </div>
                    <div className="p-5">
                        {applicantsToReview > 0 ? (
                            <div className="text-center">
                                <p className="text-5xl font-bold text-blue-600">{applicantsToReview}</p>
                                <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">New applicants are waiting for review.</p>
                                <Link to={`/company/${companyId}/jobs`} className="mt-3 inline-block px-5 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                                    Review Applicants
                                </Link>
                            </div>
                        ) : (
                             <p className="text-center text-slate-500 py-8">Your hiring pipeline is all caught up!</p>
                        )}
                    </div>
                </Card>
                <Card className="dark:bg-slate-800">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity</h3>
                    </div>
                    <div className="p-2">
                        {recentApplicants.length > 0 ? (
                            recentApplicants.map(item => <RecentActivityItem key={item.user!.id} applicant={item.user!} job={item.job} />)
                        ) : (
                            <p className="text-center text-slate-500 py-8">No recent activity.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CompanyDashboard;