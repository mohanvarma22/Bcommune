import React, { useState, useMemo, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import type { Job } from '../../types';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { SearchIcon } from '../common/Icons';
import FilterModal from './FilterModal';

interface FilterBarProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    locationFilters: string[];
    onLocationChange: (filters: string[]) => void;
    companyFilters: string[];
    onCompanyChange: (filters: string[]) => void;
    typeFilters: string[];
    onTypeChange: (filters: string[]) => void;
    experienceFilters: string[];
    onExperienceChange: (filters: string[]) => void;
    skillFilters: string[];
    onSkillChange: (filters: string[]) => void;
    salaryFilters: string[];
    onSalaryChange: (filters: string[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
    const { jobs, companies } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { 
        uniqueLocations, 
        uniqueCompanies, 
    } = useMemo(() => {
        const locations = [...new Set(jobs.map(j => j.location))].sort();
        const companiesMap = new Map(companies.map(c => [c.id, c.name]));
        const companyNames = [...new Set(jobs.map(j => companiesMap.get(j.companyId)).filter(Boolean) as string[])].sort();
        return {
            uniqueLocations: locations,
            uniqueCompanies: companyNames,
        };
    }, [jobs, companies]);

    const activeFilterCount = [
        props.typeFilters, 
        props.experienceFilters, 
        props.skillFilters, 
        props.salaryFilters
    ].reduce((acc, curr) => acc + curr.length, 0);

    return (
        <>
            <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500"><SearchIcon /></div>
                        <input 
                            type="text" 
                            placeholder="Search by title, company, or skill..." 
                            value={props.searchTerm} 
                            onChange={(e) => props.onSearchTermChange(e.target.value)} 
                            className="w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-800 dark:text-slate-200"
                        />
                    </div>
                    <div className="hidden lg:block w-48">
                        <MultiSelectDropdown label="Location" options={uniqueLocations} selectedOptions={props.locationFilters} onChange={props.onLocationChange} />
                    </div>
                     <div className="hidden lg:block w-48">
                        <MultiSelectDropdown label="Company" options={uniqueCompanies} selectedOptions={props.companyFilters} onChange={props.onCompanyChange} />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="relative px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        More Filters
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            <FilterModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                {...props} 
            />
        </>
    );
};

export default FilterBar;
