import React from 'react';
import Card from '../common/Card';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import type { Job, ApplicantStatus } from '../../types';

interface TalentPoolFilterSidebarProps {
    companyJobs: Job[];
    jobFilters: string[];
    onJobChange: (filters: string[]) => void;
    skillFilters: string[];
    onSkillChange: (filters: string[]) => void;
    statusFilters: ApplicantStatus[];
    onStatusChange: (filters: ApplicantStatus[]) => void;
    uniqueSkills: string[];
    uniqueStatuses: ApplicantStatus[];
}

const TalentPoolFilterSidebar: React.FC<TalentPoolFilterSidebarProps> = ({
    companyJobs,
    jobFilters, onJobChange,
    skillFilters, onSkillChange,
    statusFilters, onStatusChange,
    uniqueSkills, uniqueStatuses,
}) => {
    
    const jobOptions = companyJobs.map(job => ({ label: job.title, value: job.id }));

    const handleReset = () => {
        onJobChange([]);
        onSkillChange([]);
        onStatusChange([]);
    };
    
    const hasActiveFilters = jobFilters.length > 0 || skillFilters.length > 0 || statusFilters.length > 0;

    return (
        <Card className="p-4 space-y-4">
            <h3 className="font-bold text-lg">Filter Talent Pool</h3>
            
            <MultiSelectDropdown
                label="Job Applied For"
                options={jobOptions.map(j => j.label)} // Pass labels to component
                selectedOptions={jobFilters.map(id => jobOptions.find(j => j.value === id)?.label || '')}
                onChange={(selectedLabels) => {
                    const selectedIds = selectedLabels.map(label => jobOptions.find(j => j.label === label)?.value || '');
                    onJobChange(selectedIds);
                }}
            />
            
            <MultiSelectDropdown
                label="Skills"
                options={uniqueSkills}
                selectedOptions={skillFilters}
                onChange={onSkillChange}
            />
            
            <MultiSelectDropdown
                label="Application Status"
                options={uniqueStatuses}
                selectedOptions={statusFilters}
                onChange={(selected) => onStatusChange(selected as ApplicantStatus[])}
            />
            
            {hasActiveFilters && (
                <button onClick={handleReset} className="w-full text-sm font-semibold text-blue-600 hover:underline">
                    Reset All Filters
                </button>
            )}
        </Card>
    );
};

export default TalentPoolFilterSidebar;