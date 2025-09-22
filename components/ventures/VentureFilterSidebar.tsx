import React from 'react';
import Card from '../common/Card';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { SearchIcon } from '../common/Icons';

interface VentureFilterSidebarProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    industryFilters: string[];
    onIndustryChange: (filters: string[]) => void;
    stageFilters: string[];
    onStageChange: (filters: string[]) => void;
    skillsFilters: string[];
    onSkillsChange: (filters: string[]) => void;
    uniqueIndustries: string[];
    uniqueStages: string[];
    uniqueSkills: string[];
}

const VentureFilterSidebar: React.FC<VentureFilterSidebarProps> = ({
    searchTerm, onSearchTermChange,
    industryFilters, onIndustryChange,
    stageFilters, onStageChange,
    skillsFilters, onSkillsChange,
    uniqueIndustries, uniqueStages, uniqueSkills,
}) => {

    const handleReset = () => {
        onSearchTermChange('');
        onIndustryChange([]);
        onStageChange([]);
        onSkillsChange([]);
    };

    const hasActiveFilters = searchTerm || industryFilters.length > 0 || stageFilters.length > 0 || skillsFilters.length > 0;

    return (
        <Card className="p-4 space-y-4">
            <h3 className="font-bold text-lg">Filters</h3>
             <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><SearchIcon /></div>
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchTerm} 
                    onChange={(e) => onSearchTermChange(e.target.value)} 
                    className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
            <MultiSelectDropdown
                label="Industry / Market"
                options={uniqueIndustries}
                selectedOptions={industryFilters}
                onChange={onIndustryChange}
            />
             <MultiSelectDropdown
                label="Stage"
                options={uniqueStages}
                selectedOptions={stageFilters}
                onChange={onStageChange}
            />
             <MultiSelectDropdown
                label="Skills Needed"
                options={uniqueSkills}
                selectedOptions={skillsFilters}
                onChange={onSkillsChange}
            />
             {hasActiveFilters && (
                <button onClick={handleReset} className="w-full text-sm font-semibold text-blue-600 hover:underline">
                    Reset All Filters
                </button>
            )}
        </Card>
    );
};

export default VentureFilterSidebar;