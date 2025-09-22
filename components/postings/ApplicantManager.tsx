import React, { useContext } from 'react';
import type { ApplicantDetails, Job, ApplicantStatus, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import KanbanApplicantCard from './KanbanApplicantCard';
import KanbanColumn from './KanbanColumn';

// Main Component
interface ApplicantManagerProps {
    job: Job;
    selectedApplicantIds: Set<string>;
    onSelectionChange: (applicantId: string) => void;
    onSortColumn: (status: string) => void;
    sortedColumns: Record<string, 'asc' | 'desc' | null>;
    onSelectAll: (applicantIds: string[]) => void;
    onShowContactPopover: (e: React.MouseEvent, applicantId: string) => void;
    onSchedule: (applicantId: string) => void;
    onShowAnalysisPane: (analysis: any) => void;
    columnFilters: Record<string, any>;
    setColumnFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    highlightUnreviewed: boolean;
    onViewProfile: (applicant: User) => void;
}

const ApplicantManager: React.FC<ApplicantManagerProps> = (props) => {
    const { 
        job, selectedApplicantIds, onSelectionChange, onSortColumn, sortedColumns, 
        onSelectAll, onShowContactPopover, onSchedule, onShowAnalysisPane,
        columnFilters, setColumnFilters, highlightUnreviewed, onViewProfile,
    } = props;
    const { updateApplicantStatus, rejectApplicant } = useContext(DataContext);
    const applicants = job.applicantDetails;

    const pipelineStages = ['Applied', 'Shortlisted', ...job.interviewRounds.map(r => r.name), 'Hired'];
    const finalStages = ['Rejected'];

    const handleDrop = (applicantId: string, newStatus: ApplicantStatus) => {
        const applicant = applicants.find(a => a.userId === applicantId);
        if (applicant && applicant.status !== newStatus) {
            if (newStatus === 'Rejected') {
                 if (window.confirm("Are you sure you want to reject this candidate? AI-powered feedback will be made available to them.")) {
                    rejectApplicant(job.id, applicantId);
                }
            } else {
                updateApplicantStatus(job.id, applicantId, newStatus);
            }
        }
    };

    if (applicants.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No applicants yet for this position.</p>;
    }

    const groupedAndSortedApplicants = (stages: string[]): Record<string, ApplicantDetails[]> => {
        const groups: Record<string, ApplicantDetails[]> = {};
        stages.forEach(stage => groups[stage] = []);
        applicants.forEach(app => {
            if (groups[app.status] !== undefined) {
                groups[app.status].push(app);
            }
        });

        // Apply filters and sorting
        for (const status in groups) {
            const filters = columnFilters[status];
            if (filters) {
                groups[status] = groups[status].filter(app => {
                    const score = app.aiAssistantAnalysis?.fitScore;
                    const skills = app.aiAssistantAnalysis?.skillValidation.filter(s => s.hasEvidence).map(s => s.skill) || [];

                    const scoreMatch = !filters.minScore || (score && score >= filters.minScore);
                    const skillMatch = !filters.skills || filters.skills.every((s: string) => skills.includes(s));
                    
                    return scoreMatch && skillMatch;
                });
            }
            
            const sortOrder = sortedColumns[status];
            if (sortOrder) {
                groups[status].sort((a, b) => {
                    const scoreA = a.aiAssistantAnalysis?.fitScore ?? 0;
                    const scoreB = b.aiAssistantAnalysis?.fitScore ?? 0;
                    return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
                });
            }
        }
        return groups;
    }
    
    const pipelineGroups = groupedAndSortedApplicants(pipelineStages);
    const finalGroups = groupedAndSortedApplicants(finalStages);

    const isAllSelected = (applicantsInColumn: ApplicantDetails[]) => {
        if (applicantsInColumn.length === 0) return false;
        return applicantsInColumn.every(a => selectedApplicantIds.has(a.userId));
    };

    return (
        <div className="flex gap-6 p-4 h-full">
            {pipelineStages.map(status => (
                <KanbanColumn
                    key={status}
                    status={status}
                    applicants={pipelineGroups[status] || []}
                    job={job}
                    onDrop={handleDrop}
                    isSelected={(id) => selectedApplicantIds.has(id)}
                    onSelectionChange={onSelectionChange}
                    onSort={onSortColumn}
                    onSelectAll={onSelectAll}
                    allSelected={isAllSelected(pipelineGroups[status] || [])}
                    onShowContact={onShowContactPopover}
                    onSchedule={onSchedule}
                    onShowAnalysisPane={onShowAnalysisPane}
                    filters={columnFilters[status]}
                    setFilters={(filters) => setColumnFilters(prev => ({ ...prev, [status]: filters }))}
                    highlightUnreviewed={highlightUnreviewed}
                    onViewProfile={onViewProfile}
                />
            ))}
            <div className="border-l-2 border-dashed border-slate-300 dark:border-slate-600 ml-4 pl-6 h-full flex">
                {finalStages.map(status => (
                     <KanbanColumn
                        key={status}
                        status={status}
                        applicants={finalGroups[status] || []}
                        job={job}
                        onDrop={handleDrop}
                        isSelected={(id) => selectedApplicantIds.has(id)}
                        onSelectionChange={onSelectionChange}
                        onSort={onSortColumn}
                        onSelectAll={onSelectAll}
                        allSelected={isAllSelected(finalGroups[status] || [])}
                        onShowContact={onShowContactPopover}
                        onSchedule={onSchedule}
                        onShowAnalysisPane={onShowAnalysisPane}
                        filters={columnFilters[status]}
                        setFilters={(filters) => setColumnFilters(prev => ({ ...prev, [status]: filters }))}
                        highlightUnreviewed={highlightUnreviewed}
                        onViewProfile={onViewProfile}
                    />
                ))}
            </div>
        </div>
    );
};

export default ApplicantManager;