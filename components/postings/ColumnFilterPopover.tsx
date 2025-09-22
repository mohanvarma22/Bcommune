import React, { useRef, useEffect, useState } from 'react';
import { CloseIcon } from '../common/Icons';
import MultiSelectDropdown from '../common/MultiSelectDropdown';

interface ColumnFilterPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
    jobSkills: string[];
    filters: { minScore?: number, skills?: string[] };
    setFilters: (filters: any) => void;
}

const scoreOptions = [
    { label: 'Any Score', value: 0 },
    { label: '70%+', value: 70 },
    { label: '80%+', value: 80 },
    { label: '90%+', value: 90 },
];

const ColumnFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ isOpen, onClose, buttonRef, jobSkills, filters, setFilters }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleMinScoreChange = (score: number) => {
        setFilters({ ...filters, minScore: score > 0 ? score : undefined });
    };

    const handleSkillsChange = (selectedSkills: string[]) => {
        setFilters({ ...filters, skills: selectedSkills.length > 0 ? selectedSkills : undefined });
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute top-full right-0 mt-2 z-20 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
        >
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h4 className="text-sm font-semibold">Filter Column</h4>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="p-3 space-y-4">
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Min. AI Fit Score</label>
                    <div className="mt-1 flex gap-1">
                        {scoreOptions.map(opt => (
                            <button 
                                key={opt.value}
                                onClick={() => handleMinScoreChange(opt.value)}
                                className={`flex-1 px-2 py-1 text-xs rounded-md border transition ${
                                    (filters?.minScore || 0) === opt.value
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-500'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Required Skills</label>
                    <div className="mt-1">
                         <MultiSelectDropdown 
                            label="Select skills..."
                            options={jobSkills}
                            selectedOptions={filters?.skills || []}
                            onChange={handleSkillsChange}
                        />
                    </div>
                </div>
            </div>
             <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-right">
                <button 
                    onClick={() => setFilters({})}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default ColumnFilterPopover;