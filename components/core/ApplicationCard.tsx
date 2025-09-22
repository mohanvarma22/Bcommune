import React, { useState, useContext, useMemo } from 'react';
import type { Job } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import { Link } from 'react-router-dom';
import { AIIcon, UsersIcon, ChevronDownIcon } from '../common/Icons';
import { getShortlistProbability } from '../../services/geminiApplicantService';
import type { AIShortlistPrediction } from '../../types';
import ApplicationStatusTracker from './ApplicationStatusTracker';
import ApplicationUpdates from './ApplicationUpdates';

interface ApplicationCardProps {
    job: Job;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const statusColorMap: Record<string, string> = {
    Applied: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    Shortlisted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Hired: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({ job, isExpanded, onToggleExpand }) => {
    // FIX: Destructure companies from context.
    const { currentUser, conversations, markMessagesAsRead, companies } = useContext(DataContext);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [aiInsight, setAiInsight] = useState<AIShortlistPrediction | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const userApplication = job.applicantDetails.find(app => app.userId === currentUser?.id);
    // FIX: Find the company by ID to get its name.
    const company = companies.find(c => c.id === job.companyId);

    const hasUnreadMessages = useMemo(() => {
        return conversations
            .flatMap(c => c.messages)
            .some(m => m.jobId === job.id && !m.isRead && m.senderId !== currentUser?.id);
    }, [conversations, job.id, currentUser?.id]);

    const handleToggle = () => {
        if (!isExpanded && hasUnreadMessages) {
            markMessagesAsRead(job.id);
        }
        onToggleExpand();
    };

    const handleAnalyzeFit = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card from toggling
        if (!currentUser) return;
        setIsLoadingAI(true);
        setAiError(null);
        try {
            const result = await getShortlistProbability(job, currentUser);
            setAiInsight(result);
        } catch (error) {
            setAiError((error as Error).message);
        } finally {
            setIsLoadingAI(false);
        }
    };

    if (!userApplication || !company) return null;
    
    // Always show the tracker when expanded, regardless of status.
    // This provides a better UX as the user can always see the potential pipeline.
    const showTracker = true;
    
    // Use a more robust status color mapping
    const getStatusColor = (status: string) => {
        if (statusColorMap[status]) {
            return statusColorMap[status];
        }
        const interviewStageNames = job.interviewRounds.map(r => r.name);
        if (interviewStageNames.includes(status)) {
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        }
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }

    return (
        <Card className="dark:bg-slate-800 dark:border-slate-700 transition-all duration-300">
            <div className="p-5 cursor-pointer" onClick={handleToggle}>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <Link to={`/jobs/${job.id}`} onClick={e => e.stopPropagation()} className="hover:underline">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{job.title}</h3>
                        </Link>
                        {/* FIX: Use the looked-up company name. */}
                        <p className="text-md text-slate-700 dark:text-slate-300">{company.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{job.location} &middot; {job.type}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {hasUnreadMessages && !isExpanded && (
                            <div className="relative flex h-3 w-3" title="New updates">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </div>
                        )}
                        <div className="text-right">
                             <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(userApplication.status)}`}>
                                Status: {userApplication.status}
                            </span>
                            <div className="flex items-center justify-end gap-1.5 mt-2 text-slate-500 dark:text-slate-400">
                               <UsersIcon className="w-4 h-4" />
                               <span className="text-sm font-medium">{job.applicantDetails.length} Applicants</span>
                            </div>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-200 dark:border-slate-700 mt-2 pt-4 space-y-6">
                    {showTracker && <ApplicationStatusTracker job={job} userApplication={userApplication} />}
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Insight</h4>
                        {aiInsight ? (
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Probability of Shortlist</p>
                                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{aiInsight.probability}%</p>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${aiInsight.probability}%` }}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 italic">{aiInsight.reasoning}</p>
                            </div>
                        ) : aiError ? (
                            <p className="text-xs text-red-500">{aiError}</p>
                        ) : (
                            <button
                                onClick={handleAnalyzeFit}
                                disabled={isLoadingAI}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition disabled:opacity-50"
                            >
                            {isLoadingAI ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing...
                                </>
                            ) : (
                                    <>
                                        <AIIcon className="w-4 h-4" />
                                        Analyze My Fit
                                    </>
                            )}
                            </button>
                        )}
                    </div>

                    <ApplicationUpdates jobId={job.id} />
                </div>
            )}
        </Card>
    );
};

export default ApplicationCard;