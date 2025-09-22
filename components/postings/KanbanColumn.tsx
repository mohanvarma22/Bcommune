import React, { useState, useRef, useEffect } from 'react';
import type { ApplicantDetails, Job, ApplicantStatus, User } from '../../types';
import { SortIcon, FilterIcon } from '../common/Icons';
import KanbanApplicantCard from './KanbanApplicantCard';
import ColumnFilterPopover from './ColumnFilterPopover';

interface KanbanColumnProps {
    status: ApplicantStatus;
    applicants: ApplicantDetails[];
    job: Job;
    onDrop: (applicantId: string, newStatus: ApplicantStatus) => void;
    isSelected: (applicantId: string) => boolean;
    onSelectionChange: (applicantId: string) => void;
    onSort: (status: string) => void;
    onSelectAll: (applicantIds: string[]) => void;
    allSelected: boolean;
    onShowContact: (e: React.MouseEvent, applicantId: string) => void;
    onSchedule: (applicantId: string) => void;
    onShowAnalysisPane: (analysis: any) => void;
    filters: any;
    setFilters: (filters: any) => void;
    highlightUnreviewed: boolean;
    onViewProfile: (applicant: User) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = (props) => {
    const { 
        status, applicants, job, onDrop, isSelected, onSelectionChange, onSort, 
        onSelectAll, allSelected, onShowContact, onSchedule, onShowAnalysisPane,
        filters, setFilters, highlightUnreviewed, onViewProfile,
    } = props;
    const [isDragOver, setIsDragOver] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const applicantId = e.dataTransfer.getData("applicantId");
        if (applicantId) {
            onDrop(applicantId, status);
        }
        setIsDragOver(false);
    };
    
    const averageFitScore = React.useMemo(() => {
        if (applicants.length === 0) return 0;
        const candidatesWithScores = applicants.filter(a => a.aiAssistantAnalysis?.fitScore);
        if (candidatesWithScores.length === 0) return 0;
        const totalScore = candidatesWithScores.reduce((sum, app) => sum + (app.aiAssistantAnalysis?.fitScore || 0), 0);
        return Math.round(totalScore / candidatesWithScores.length);
    }, [applicants]);
    
    const activeFilterCount = (filters?.skills?.length || 0) + (filters?.minScore ? 1 : 0);

    return (
        <div className="flex-shrink-0 w-72 h-full flex flex-col bg-slate-200/50 dark:bg-slate-800 rounded-xl">
            <div className="flex-shrink-0 flex justify-between items-center px-3 pt-3 pb-2 border-b-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => onSelectAll(applicants.map(a => a.userId))}
                        className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                        title={`Select all in ${status}`}
                        disabled={applicants.length === 0}
                    />
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{status} ({applicants.length})</h3>
                        {averageFitScore > 0 && <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Avg. Fit: {averageFitScore}%</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="relative">
                        <button ref={filterButtonRef} onClick={() => setIsFilterOpen(p => !p)} title="Filter column" className={`relative p-1 rounded ${isFilterOpen ? 'bg-blue-100 dark:bg-blue-900/50' : ''} text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700`}>
                            <FilterIcon />
                            {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-white text-[8px]">{activeFilterCount}</span>}
                        </button>
                         {isFilterOpen && (
                            <ColumnFilterPopover 
                                isOpen={isFilterOpen} 
                                onClose={() => setIsFilterOpen(false)} 
                                buttonRef={filterButtonRef}
                                jobSkills={job.skills}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                    </div>
                    <button onClick={() => onSort(status)} title="Sort by AI Score" className="p-1 rounded text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <SortIcon />
                    </button>
                </div>
            </div>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 p-2 space-y-3 rounded-b-xl transition-colors overflow-y-auto ${isDragOver ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}
            >
                {applicants.map(app => (
                    <KanbanApplicantCard 
                        key={app.userId} 
                        applicantDetail={app} 
                        job={job}
                        isSelected={isSelected(app.userId)}
                        onSelectionChange={onSelectionChange}
                        onShowContact={onShowContact}
                        onSchedule={onSchedule}
                        onShowAnalysisPane={onShowAnalysisPane}
                        highlightUnreviewed={highlightUnreviewed}
                        onViewProfile={onViewProfile}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanColumn;