import React, { useContext } from 'react';
import type { Job, ApplicantDetails, User } from '../../types';
import { CheckCircleIcon, InfoIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';

interface ApplicationStatusTrackerProps {
    job: Job;
    userApplication: ApplicantDetails;
}

const StageIcon: React.FC<{ status: 'completed' | 'current' | 'upcoming' | 'info' }> = ({ status }) => {
    if (status === 'completed') {
        return <CheckCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
    if (status === 'current') {
        return (
            <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50"></div>
            </div>
        );
    }
     if (status === 'info') {
        return <InfoIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />;
    }
    return (
        <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        </div>
    );
};

const Stage: React.FC<{ name: string; description?: React.ReactNode; status: 'completed' | 'current' | 'upcoming' | 'info'; isLast: boolean }> = ({ name, description, status, isLast }) => {
    const isUpcoming = status === 'upcoming';
    const textColor = isUpcoming ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200';
    const descriptionColor = isUpcoming ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400';

    return (
        <li className="relative flex items-start gap-4 pb-8">
            {!isLast && (
                <div className={`absolute left-3 top-6 h-full w-0.5 ${status === 'completed' ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            )}
            <div className="flex-shrink-0 z-10 bg-slate-50 dark:bg-slate-800/50">
                 <StageIcon status={status} />
            </div>
            <div>
                <p className={`font-semibold ${textColor}`}>{name}</p>
                {description && <div className={`text-sm ${descriptionColor}`}>{description}</div>}
                 {status === 'current' && !description && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 animate-pulse">
                        Hiring teams typically take 3-5 business days to review at this stage.
                    </p>
                )}
            </div>
        </li>
    );
};


const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({ job, userApplication }) => {
    const { users } = useContext(DataContext);
    const { status: currentStatus, aiReasoning, scheduledInterview } = userApplication;
    const definedStages = job.interviewRounds.map(r => ({ name: r.name, description: r.description }));
    
    const pipeline = [
        { name: 'Applied', description: 'Your application has been submitted.' },
        { name: 'Shortlisted', description: 'The hiring team has reviewed your profile.' },
        ...definedStages
    ];
    
    if (currentStatus === 'Hired') {
        pipeline.push({ name: 'Hired', description: 'Congratulations! You got the job.' });
    }

    const isRejected = currentStatus === 'Rejected';
    const currentStatusIndex = pipeline.findIndex(stage => stage.name === currentStatus);
    
    const rejectedPipeline = pipeline.slice(0, 2); 

    const displayedPipeline = isRejected ? rejectedPipeline : pipeline;

    const getInterviewDescription = (stageName: string) => {
        if (stageName === currentStatus && scheduledInterview) {
            const interviewers = scheduledInterview.interviewers
                .map(id => users.find(u => u.id === id)?.name)
                .filter(Boolean);
            
            return (
                <div className="mt-1 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">{scheduledInterview.date} at {scheduledInterview.time}</p>
                    {interviewers.length > 0 && <p>With: {interviewers.join(', ')}</p>}
                    {scheduledInterview.videoLink && <a href={scheduledInterview.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Video Link</a>}
                </div>
            );
        }
        return pipeline.find(p => p.name === stageName)?.description || null;
    }

    return (
        <ul>
            {displayedPipeline.map((stage, index) => {
                let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
                
                if (isRejected) {
                    status = 'completed';
                } else {
                    if (currentStatusIndex === -1) {
                         if (index < 1) status = 'completed';
                    } else {
                        if (index < currentStatusIndex) status = 'completed';
                        else if (index === currentStatusIndex) status = 'current';
                    }
                     if (currentStatus === 'Hired') status = 'completed';
                }

                return (
                    <Stage
                        key={stage.name}
                        name={stage.name}
                        description={getInterviewDescription(stage.name)}
                        status={status}
                        isLast={index === displayedPipeline.length - 1 && !isRejected}
                    />
                );
            })}

            {isRejected && (
                 <li className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 z-10 bg-slate-50 dark:bg-slate-800/50">
                         <StageIcon status="info" />
                    </div>
                    <div>
                        <p className="font-semibold text-red-600 dark:text-red-400">Not a Fit at This Time</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">Feedback:</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                            {aiReasoning || "The hiring team is moving forward with other candidates."}
                        </p>
                    </div>
                </li>
            )}
        </ul>
    );
};

export default ApplicationStatusTracker;