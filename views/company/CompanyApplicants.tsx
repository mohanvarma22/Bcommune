import React, { useContext, useMemo, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import type { Job, User, ApplicantStatus } from '../../types';
import TalentPoolFilterSidebar from '../../components/company/TalentPoolFilterSidebar';

const CompanyApplicants: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { jobs, companies, users, currentUser, activeProfile } = useContext(DataContext);
    
    // Filters State
    const [jobFilters, setJobFilters] = useState<string[]>([]);
    const [skillFilters, setSkillFilters] = useState<string[]>([]);
    const [statusFilters, setStatusFilters] = useState<ApplicantStatus[]>([]);

    if (activeProfile.type !== 'company' || activeProfile.id !== companyId) {
        return <Navigate to="/feed" replace />;
    }

    const company = companies.find(c => c.id === companyId);
    if (!company || !company.team.some(member => member.userId === currentUser?.id)) {
        return <Navigate to="/feed" replace />;
    }

    const companyJobs = jobs.filter(job => job.companyId === companyId);

    const { allUniqueApplicants, uniqueSkills, uniqueStatuses } = useMemo(() => {
        const applicantMap = new Map<string, { user: User, applications: { job: Job, status: ApplicantStatus }[] }>();
        const skillSet = new Set<string>();
        const statusSet = new Set<ApplicantStatus>();

        for (const job of companyJobs) {
            for (const applicantDetail of job.applicantDetails) {
                statusSet.add(applicantDetail.status);
                const user = users.find(u => u.id === applicantDetail.userId);
                if (user) {
                    user.skills.forEach(s => skillSet.add(s));
                    const application = { job, status: applicantDetail.status };
                    if (applicantMap.has(user.id)) {
                        applicantMap.get(user.id)!.applications.push(application);
                    } else {
                        applicantMap.set(user.id, { user, applications: [application] });
                    }
                }
            }
        }
        return {
            allUniqueApplicants: Array.from(applicantMap.values()),
            uniqueSkills: Array.from(skillSet).sort(),
            uniqueStatuses: Array.from(statusSet).sort(),
        };
    }, [companyJobs, users]);

    const filteredApplicants = useMemo(() => {
        return allUniqueApplicants.filter(({ user, applications }) => {
            const jobMatch = jobFilters.length === 0 || applications.some(app => jobFilters.includes(app.job.id));
            const skillMatch = skillFilters.length === 0 || skillFilters.every(skill => user.skills.includes(skill));
            const statusMatch = statusFilters.length === 0 || applications.some(app => statusFilters.includes(app.status));
            
            return jobMatch && skillMatch && statusMatch;
        });
    }, [allUniqueApplicants, jobFilters, skillFilters, statusFilters]);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">Company Talent Pool</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
                A unified view of all applicants across all jobs at {company.name}. ({allUniqueApplicants.length} unique candidates)
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <aside className="lg:col-span-1 sticky top-24">
                    <TalentPoolFilterSidebar
                        companyJobs={companyJobs}
                        jobFilters={jobFilters}
                        onJobChange={setJobFilters}
                        skillFilters={skillFilters}
                        onSkillChange={setSkillFilters}
                        statusFilters={statusFilters}
                        onStatusChange={setStatusFilters}
                        uniqueSkills={uniqueSkills}
                        uniqueStatuses={uniqueStatuses}
                    />
                </aside>

                <main className="lg:col-span-3">
                    <Card className="dark:bg-slate-800">
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Filtered Candidates ({filteredApplicants.length})</h3>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredApplicants.length > 0 ? (
                                filteredApplicants.map(({ user, applications }) => (
                                    <div key={user.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.title}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">{applications.length} Application{applications.length > 1 ? 's' : ''}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                                {applications.map(app => app.job.title).join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="p-8 text-center text-slate-500">No applicants match the current filters.</p>
                            )}
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default CompanyApplicants;