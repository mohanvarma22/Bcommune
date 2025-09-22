import React, { useContext, useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import ApplicantManager from '../components/postings/ApplicantManager';
import type { User, Job, AIAssistantAnalysis, ApplicantDetails, ApplicantStatus, AIComparisonAnalysis } from '../types';
import QuickActionsToolbar from '../components/postings/QuickActionsToolbar';
import AICoPilotPane from '../components/postings/AICoPilotPane';
import ContactPopover from '../components/postings/ContactPopover';
import ScheduleInterviewModal from '../components/postings/ScheduleInterviewModal';
import EmailComposerModal from '../components/postings/EmailComposerModal';
import ShareExportModal from '../components/postings/ShareExportModal';
import ToggleSwitch from '../components/common/ToggleSwitch';
import ApplicantProfileModal from '../components/postings/ApplicantProfileModal';
import CompareCandidatesModal from '../components/postings/CompareCandidatesModal';
import JobSnapshot from '../components/postings/JobSnapshot';

type ColumnFilters = Record<string, {
    minScore?: number;
    skills?: string[];
}>;

const JobApplicants: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { jobs, users, currentUser, companies, getAIComparisonAnalysis } = useContext(DataContext);

    const [selectedApplicantIds, setSelectedApplicantIds] = useState<Set<string>>(new Set());
    const [sortedColumns, setSortedColumns] = useState<Record<string, 'asc' | 'desc' | null>>({});
    const [contactPopover, setContactPopover] = useState<{ visible: boolean; applicantId: string | null; position: { top: number; left: number } }>({
        visible: false,
        applicantId: null,
        position: { top: 0, left: 0 },
    });
    const [schedulingApplicantId, setSchedulingApplicantId] = useState<string | null>(null);
    const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
    const [isShareExportModalOpen, setIsShareExportModalOpen] = useState(false);
    
    // Proactive Hub State
    const [isPaneOpen, setIsPaneOpen] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState<(AIAssistantAnalysis & { userId: string }) | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
    const [highlightUnreviewed, setHighlightUnreviewed] = useState(true);
    
    // New State for Profile & Comparison Modals
    const [viewingApplicant, setViewingApplicant] = useState<User | null>(null);
    const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
    const [comparisonAnalysis, setComparisonAnalysis] = useState<AIComparisonAnalysis | null>(null);
    const [isComparing, setIsComparing] = useState(false);

    const job = jobs.find(j => j.id === jobId);
    const company = companies.find(c => c.id === job?.companyId);

    const applicants = useMemo(() => {
        if (!job) return [];
        return job.applicantDetails.map(ad => {
            const user = users.find(u => u.id === ad.userId);
            return { ...ad, user };
        }).filter(ad => ad.user);
    }, [job, users]);

    if (!job || !company || !currentUser?.companyIds?.includes(company.id)) {
        return <Navigate to="/my-activity" replace />;
    }

    const handleSingleSelection = (applicantId: string) => {
        setSelectedApplicantIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(applicantId)) {
                newSet.delete(applicantId);
            } else {
                newSet.add(applicantId);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (applicantIdsInColumn: string[]) => {
        const allSelected = applicantIdsInColumn.every(id => selectedApplicantIds.has(id));
        setSelectedApplicantIds(prev => {
            const newSet = new Set(prev);
            if (allSelected) {
                applicantIdsInColumn.forEach(id => newSet.delete(id));
            } else {
                applicantIdsInColumn.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    };
    
    const handleShowAnalysisPane = (analysis: AIAssistantAnalysis & { userId: string }) => {
        setSelectedAnalysis(analysis);
        setIsPaneOpen(true);
    };

    const handleShowContactPopover = (e: React.MouseEvent, applicantId: string) => {
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setContactPopover({
            visible: true,
            applicantId,
            position: { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX - 100 },
        });
    };
    
    const handleSortColumn = (status: string) => {
        setSortedColumns(prev => {
            const currentOrder = prev[status];
            const newOrder = currentOrder === 'desc' ? 'asc' : 'desc';
            return { ...prev, [status]: newOrder };
        });
    };
    
    const getSelectedUsers = (): User[] => {
        return users.filter(u => selectedApplicantIds.has(u.id));
    };

    const handleCompare = async () => {
        const selectedUsers = getSelectedUsers();
        if (selectedUsers.length < 2 || selectedUsers.length > 4) return;
        setIsComparing(true);
        setIsComparisonModalOpen(true);
        try {
            const analysis = await getAIComparisonAnalysis(job, selectedUsers);
            setComparisonAnalysis(analysis);
        } catch (error) {
            console.error("Failed to get AI comparison:", error);
            alert("An error occurred while comparing candidates.");
            setIsComparisonModalOpen(false);
        } finally {
            setIsComparing(false);
        }
    };
    
    const schedulingApplicant = users.find(u => u.id === schedulingApplicantId);
    const selectedUsersForEmail = getSelectedUsers();

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900">
            <div className="flex-shrink-0 p-4 sm:p-6 lg:p-8">
                <Link to={`/company/${company.id}/jobs`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
                    &larr; Back to Company Jobs
                </Link>
                <div className="md:flex md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">{company.name} - Applicants ({applicants.length})</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Highlight Unreviewed</label>
                        <ToggleSwitch isEnabled={highlightUnreviewed} onToggle={() => setHighlightUnreviewed(p => !p)} />
                    </div>
                </div>
                <JobSnapshot job={job} />
            </div>

            <main className="flex-1 overflow-x-auto overscroll-behavior-x-contain">
                 <ApplicantManager 
                    job={job}
                    selectedApplicantIds={selectedApplicantIds}
                    onSelectionChange={handleSingleSelection}
                    onSortColumn={handleSortColumn}
                    sortedColumns={sortedColumns}
                    onSelectAll={handleSelectAll}
                    onShowContactPopover={handleShowContactPopover}
                    onSchedule={setSchedulingApplicantId}
                    onShowAnalysisPane={handleShowAnalysisPane}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    highlightUnreviewed={highlightUnreviewed}
                    onViewProfile={(user) => setViewingApplicant(user)}
                />
            </main>
            
            <ContactPopover 
                isOpen={contactPopover.visible}
                onClose={() => setContactPopover({ ...contactPopover, visible: false })}
                user={users.find(u => u.id === contactPopover.applicantId) || null}
                position={contactPopover.position}
            />

            {schedulingApplicant && (
                <ScheduleInterviewModal
                    isOpen={!!schedulingApplicantId}
                    onClose={() => setSchedulingApplicantId(null)}
                    job={job}
                    applicant={schedulingApplicant}
                />
            )}

            <AICoPilotPane 
                isOpen={isPaneOpen}
                onClose={() => setIsPaneOpen(false)}
                analysisData={selectedAnalysis}
                user={users.find(u => u.id === selectedAnalysis?.userId)}
            />
            
            <ApplicantProfileModal
                isOpen={!!viewingApplicant}
                onClose={() => setViewingApplicant(null)}
                user={viewingApplicant}
            />

            <CompareCandidatesModal
                isOpen={isComparisonModalOpen}
                onClose={() => setIsComparisonModalOpen(false)}
                analysis={comparisonAnalysis}
                candidates={getSelectedUsers()}
                isLoading={isComparing}
            />
            
             <QuickActionsToolbar 
                selectedCount={selectedApplicantIds.size}
                onClear={() => setSelectedApplicantIds(new Set())}
                job={job}
                selectedApplicantIds={Array.from(selectedApplicantIds)}
                onSendEmail={() => setIsEmailComposerOpen(true)}
                onShareExport={() => setIsShareExportModalOpen(true)}
                onCompare={handleCompare}
                isComparing={isComparing}
            />

            {isEmailComposerOpen && (
                <EmailComposerModal
                    isOpen={isEmailComposerOpen}
                    onClose={() => setIsEmailComposerOpen(false)}
                    recipients={selectedUsersForEmail}
                    job={job}
                />
            )}

            {isShareExportModalOpen && (
                <ShareExportModal
                    isOpen={isShareExportModalOpen}
                    onClose={() => setIsShareExportModalOpen(false)}
                    selectedApplicants={getSelectedUsers()}
                    job={job}
                />
            )}
        </div>
    );
};

export default JobApplicants;
