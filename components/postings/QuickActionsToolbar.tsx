import React, { useState, useRef, useEffect, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import type { Job, ApplicantStatus } from '../../types';
import { ChevronDownIcon, EnvelopeIcon, ExportIcon, SparklesIcon } from '../common/Icons';

interface QuickActionsToolbarProps {
    selectedCount: number;
    onClear: () => void;
    job: Job;
    selectedApplicantIds: string[];
    onSendEmail: () => void;
    onShareExport: () => void;
    onCompare: () => void;
    isComparing: boolean;
}

const QuickActionsToolbar: React.FC<QuickActionsToolbarProps> = ({ selectedCount, onClear, job, selectedApplicantIds, onSendEmail, onShareExport, onCompare, isComparing }) => {
    const { bulkUpdateApplicantStatus, bulkRejectApplicants } = useContext(DataContext);
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const moveRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moveRef.current && !moveRef.current.contains(event.target as Node)) {
                setIsMoveOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (selectedCount === 0) {
        return null;
    }

    const handleMove = (newStatus: ApplicantStatus) => {
        bulkUpdateApplicantStatus(job.id, selectedApplicantIds, newStatus);
        onClear();
        setIsMoveOpen(false);
    };

    const handleReject = () => {
        if (window.confirm(`Are you sure you want to reject ${selectedCount} candidate(s)? AI-powered feedback will be made available to them.`)) {
            bulkRejectApplicants(job.id, selectedApplicantIds);
            onClear();
        }
    };

    const availableStages = ['Applied', 'Shortlisted', ...job.interviewRounds.map(r => r.name), 'Hired'];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4">
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-800 text-white rounded-lg shadow-2xl border border-slate-700">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{selectedCount} selected</span>
                    <button onClick={onClear} className="text-xs text-slate-400 hover:underline">&times; Clear</button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCompare}
                        disabled={selectedCount < 2 || selectedCount > 4 || isComparing}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
                        title="Select 2-4 candidates to compare"
                    >
                        {isComparing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                        Compare with AI
                    </button>
                    <button onClick={onSendEmail} className="px-3 py-1.5 text-sm font-semibold bg-slate-700 rounded-md hover:bg-slate-600 transition" title="Send Email">
                        <EnvelopeIcon className="w-4 h-4" />
                    </button>
                    <button onClick={onShareExport} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-slate-700 rounded-md hover:bg-slate-600 transition" title="Share or Export">
                        <ExportIcon />
                    </button>
                    <div className="relative" ref={moveRef}>
                        <button onClick={() => setIsMoveOpen(p => !p)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold bg-slate-700 rounded-md hover:bg-slate-600 transition">
                            Move to <ChevronDownIcon className="w-4 h-4" />
                        </button>
                        {isMoveOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-700 rounded-md shadow-lg border border-slate-600 z-10 py-1 max-h-48 overflow-y-auto">
                                {availableStages.map(stage => (
                                    <button key={stage} onClick={() => handleMove(stage)} className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600">
                                        {stage}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleReject} className="px-3 py-1.5 text-sm font-semibold bg-red-600 rounded-md hover:bg-red-700 transition">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickActionsToolbar;