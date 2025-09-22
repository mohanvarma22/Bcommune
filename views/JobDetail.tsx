import React, { useContext, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import type { User, ApplicantDetails } from '../types';
import ApplyConfirmModal from '../components/jobs/ApplyConfirmModal';
import InterviewProcessSection from '../components/jobs/InterviewProcessSection';
import AIFitAnalyzer from '../components/jobs/AIFitAnalyzer';

const ApplicantsSection: React.FC<{ applicantDetails: ApplicantDetails[] }> = ({ applicantDetails }) => {
    const { users } = useContext(DataContext);
    const applicants = applicantDetails.map(ad => users.find(u => u.id === ad.userId)).filter((u): u is User => !!u);

    return (
        <Card>
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Applicants ({applicants.length})</h3>
                <div className="space-y-4">
                    {applicants.length > 0 ? applicants.map(applicant => (
                        <Link key={applicant.id} to={`/profile/${applicant.id}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
                            <Avatar src={applicant.avatarUrl} alt={applicant.name} size="md" />
                            <div>
                                <p className="font-semibold text-slate-800">{applicant.name}</p>
                                <p className="text-sm text-slate-500">{applicant.title}</p>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-slate-500">No applicants yet.</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

const DetailSection: React.FC<{title: string, items?: string[]}> = ({title, items}) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );
};

const JobDetail: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { jobs, users, companies, currentUser, applyForJob } = useContext(DataContext);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
        return <Navigate to="/feed" replace />;
    }
    
    const company = companies.find(c => c.id === job.companyId);
    const poster = users.find(u => u.id === job.posterId);

    if (!company) {
        return <div>Company not found for this job.</div>
    }

    const isOwner = currentUser?.id === job.posterId;
    const hasApplied = job.applicantDetails.some(ad => ad.userId === currentUser?.id);

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <div className="p-8">
                        <p className="text-md text-slate-500">{company.name} &middot; {job.location}</p>
                        <h1 className="text-4xl font-bold text-slate-900 mt-2">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                             <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                {job.type}
                            </span>
                            {job.experienceLevel && (
                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                                    {job.experienceLevel} Level
                                </span>
                            )}
                             {job.salaryRange && (
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                    {job.salaryRange}
                                </span>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2">
                        <Card>
                            <div className="p-6 prose max-w-none text-slate-600 space-y-6">
                                {company.about && (
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">About {company.name}</h3>
                                        <p className="text-slate-600 italic">"{company.about}"</p>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Description</h2>
                                    <p className="whitespace-pre-wrap">{job.description}</p>
                                </div>
                                <DetailSection title="Key Responsibilities" items={job.responsibilities} />
                                <DetailSection title="Qualifications" items={job.qualifications} />
                                <DetailSection title="Benefits & Perks" items={job.benefits} />
                                <InterviewProcessSection 
                                    rounds={job.interviewRounds ?? []} 
                                    titleClassName="text-xl font-bold text-slate-900 mb-3"
                                />
                            </div>
                        </Card>
                    </div>
                    <aside className="space-y-6 sticky top-24">
                        {!isOwner && currentUser && (
                            <Card className="p-6 text-center">
                                <AIFitAnalyzer job={job} user={currentUser} />
                                <button 
                                    onClick={() => setIsApplyModalOpen(true)}
                                    disabled={hasApplied}
                                    className="w-full px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                                >
                                    {hasApplied ? 'Applied' : 'Apply Now'}
                                </button>
                            </Card>
                        )}
                        {poster && (
                            <Card className="p-4">
                                <h3 className="text-sm font-semibold text-slate-500 mb-3">Hiring Manager</h3>
                                <Link to={`/profile/${poster.id}`} className="flex items-center gap-3 group">
                                    <Avatar src={poster.avatarUrl} alt={poster.name} size="md" />
                                    <div>
                                        <p className="font-semibold text-slate-800 group-hover:underline">{poster.name}</p>
                                        <p className="text-xs text-slate-500">{poster.title}</p>
                                    </div>
                                </Link>
                            </Card>
                        )}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Skills Required</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </aside>
                </div>
                
                {isOwner && (
                    <div>
                        <ApplicantsSection applicantDetails={job.applicantDetails} />
                    </div>
                )}
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

export default JobDetail;
