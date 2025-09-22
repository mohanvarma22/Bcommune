import React, { useContext, useMemo } from 'react';
import type { ApplicantDetails, Job, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import { CalendarIcon, CheckCircleIcon, ContactCardIcon, DocumentTextIcon } from '../common/Icons';

const DonutChart: React.FC<{ score: number }> = ({ score }) => {
    const size = 32;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
  
    const scoreColor = score >= 85 ? 'stroke-green-500' : score >= 70 ? 'stroke-blue-500' : score >= 50 ? 'stroke-yellow-500' : 'stroke-red-500';
    const textColor = score >= 85 ? 'text-green-600 dark:text-green-400' : score >= 70 ? 'text-blue-600 dark:text-blue-400' : score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';

    return (
      <div className="relative flex-shrink-0" style={{ width: size, height: size }} title={`AI Fit Score: ${score}%`}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} className="stroke-slate-200 dark:stroke-slate-600" fill="transparent" />
          <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} className={`${scoreColor} transition-all duration-500`} fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${textColor}`}>
            {score}
        </span>
      </div>
    );
};


interface KanbanApplicantCardProps {
    applicantDetail: ApplicantDetails;
    job: Job;
    isSelected: boolean;
    onSelectionChange: (applicantId: string) => void;
    onShowContact: (e: React.MouseEvent, applicantId: string) => void;
    onSchedule: (applicantId: string) => void;
    onShowAnalysisPane: (analysis: any) => void;
    highlightUnreviewed: boolean;
    onViewProfile: (applicant: User) => void;
}

const KanbanApplicantCard: React.FC<KanbanApplicantCardProps> = (props) => {
    const { 
        applicantDetail, job, isSelected, onSelectionChange, onShowContact, 
        onSchedule, onShowAnalysisPane, highlightUnreviewed, onViewProfile
    } = props;

    const { users, markApplicantAsReviewed, updateApplicantStatus, rejectApplicant } = useContext(DataContext);
    const applicant = users.find(u => u.id === applicantDetail.userId);
    
    const matchingSkills = useMemo(() => {
        if (!applicant || !applicantDetail.aiAssistantAnalysis) return [];
        return applicantDetail.aiAssistantAnalysis.skillValidation
            .filter(s => s.hasEvidence)
            .map(s => s.skill);
    }, [applicant, applicantDetail.aiAssistantAnalysis]);

    if (!applicant) return null;
    
    const handleInteraction = () => {
        if (!applicantDetail.hasBeenReviewed) {
            markApplicantAsReviewed(job.id, applicant.id);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        handleInteraction();
        e.dataTransfer.setData("applicantId", applicant.id);
        e.dataTransfer.setData("jobId", job.id);
        e.currentTarget.style.opacity = '0.5';
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
    };

    const handleClick = (e: React.MouseEvent) => {
        handleInteraction();
        // Check if the click is on an interactive element like a button or link inside the card
        if ((e.target as HTMLElement).closest('button, a')) {
            return;
        }
        e.preventDefault();
        onSelectionChange(applicantDetail.userId);
    };
    
    const fitScore = applicantDetail.aiAssistantAnalysis?.fitScore;
    const isInterviewStage = job.interviewRounds.map(r => r.name).includes(applicantDetail.status);
    const isDimmed = highlightUnreviewed && applicantDetail.hasBeenReviewed;

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            className={`p-3 bg-white dark:bg-slate-700/50 border rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 group relative ${
                isSelected 
                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-slate-600' 
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
            } ${isDimmed ? 'opacity-40 hover:opacity-100' : ''}`}
        >
            {!applicantDetail.hasBeenReviewed && (
                <span className="absolute top-1 left-1 block h-2 w-2 rounded-full bg-blue-500" title="Unreviewed"></span>
            )}
            <div className="flex items-start gap-3">
                <button onClick={(e) => { e.stopPropagation(); onViewProfile(applicant); }} className="flex-shrink-0">
                    <Avatar src={applicant.avatarUrl} alt={applicant.name} size="md" />
                </button>
                <div className="flex-1 overflow-hidden">
                    <button onClick={(e) => { e.stopPropagation(); onViewProfile(applicant); }} className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:underline truncate block text-left w-full">{applicant.name}</button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{applicant.title}</p>
                </div>
                {typeof fitScore === 'number' && <DonutChart score={fitScore} />}
            </div>

            {matchingSkills.length > 0 && (
                <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                        {matchingSkills.slice(0, 3).map(skill => (
                            <span key={skill} className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900/50 dark:text-green-300">
                                <CheckCircleIcon className="w-3 h-3"/> {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-2">
                {applicantDetail.aiSuggestion === 'shortlist' && applicantDetail.status === 'Applied' && (
                    <button onClick={(e) => {e.stopPropagation(); updateApplicantStatus(job.id, applicant.id, 'Shortlisted')}} className="w-full text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-900 transition">
                        AI Suggestion: Move to Shortlisted
                    </button>
                )}
                {applicantDetail.aiSuggestion === 'reject' && applicantDetail.status !== 'Rejected' && applicantDetail.status !== 'Hired' && (
                    <button onClick={(e) => {e.stopPropagation(); rejectApplicant(job.id, applicant.id)}} className="w-full text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900 transition">
                       AI Suggestion: Move to Rejected
                    </button>
                )}
            </div>
            
            {isInterviewStage && applicantDetail.scheduledInterview && (
                <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded flex items-center gap-1.5">
                    <CalendarIcon className="w-3 h-3"/>
                    <span>{applicantDetail.scheduledInterview.date} at {applicantDetail.scheduledInterview.time}</span>
                </div>
            )}
            
            <div className={`absolute -bottom-3 right-2 flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full shadow-sm px-1 py-0.5 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button onClick={(e) => { e.stopPropagation(); onShowContact(e, applicant.id); }} title="Contact" className="p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><ContactCardIcon className="w-4 h-4" /></button>
                {isInterviewStage && <button onClick={(e) => { e.stopPropagation(); onSchedule(applicant.id); }} title="Schedule" className="p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><CalendarIcon className="w-4 h-4"/></button>}
                {applicantDetail.aiAssistantAnalysis && <button onClick={(e) => { e.stopPropagation(); onShowAnalysisPane({ ...applicantDetail.aiAssistantAnalysis, userId: applicant.id }); }} title="View AI Analysis" className="p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><DocumentTextIcon className="w-4 h-4"/></button>}
            </div>
        </div>
    );
};

export default KanbanApplicantCard;