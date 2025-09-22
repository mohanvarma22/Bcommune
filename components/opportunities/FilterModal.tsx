import React, { useMemo, useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { DataContext } from '../../context/DataContext';
import type { Job } from '../../types';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeFilters: string[];
    onTypeChange: (filters: string[]) => void;
    experienceFilters: string[];
    onExperienceChange: (filters: string[]) => void;
    skillFilters: string[];
    onSkillChange: (filters: string[]) => void;
    salaryFilters: string[];
    onSalaryChange: (filters: string[]) => void;
}

const salaryOptions = [
    'Under $80k',
    '$80k - $120k',
    '$120k - $180k',
    '$180k+',
];

const FilterModal: React.FC<FilterModalProps> = (props) => {
    const { jobs, companies } = useContext(DataContext);
    
    const { uniqueTypes, uniqueExperienceLevels, uniqueSkills } = useMemo(() => {
        const types = [...new Set(jobs.map(j => j.type))].sort();
        const experienceLevels = [...new Set(jobs.map(j => j.experienceLevel).filter(Boolean))].sort() as (Job['experienceLevel'])[];
        const skills = [...new Set(jobs.flatMap(j => j.skills))].sort();
        return {
            uniqueTypes: types,
            uniqueExperienceLevels: experienceLevels,
            uniqueSkills: skills,
        };
    }, [jobs]);
    
    const handleReset = () => {
        props.onTypeChange([]);
        props.onExperienceChange([]);
        props.onSkillChange([]);
        props.onSalaryChange([]);
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="3xl">
            <Card className="dark:bg-slate-800">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">More Filters</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <MultiSelectDropdown label="Job Type" options={uniqueTypes} selectedOptions={props.typeFilters} onChange={props.onTypeChange} />
                    <MultiSelectDropdown label="Experience Level" options={uniqueExperienceLevels} selectedOptions={props.experienceFilters} onChange={props.onExperienceChange} />
                    <div className="sm:col-span-2">
                        <MultiSelectDropdown label="Skills" options={uniqueSkills} selectedOptions={props.skillFilters} onChange={props.onSkillChange} />
                    </div>
                    <div className="sm:col-span-2">
                        <MultiSelectDropdown label="Salary Range" options={salaryOptions} selectedOptions={props.salaryFilters} onChange={props.onSalaryChange} />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                     <button onClick={handleReset} className="text-sm font-semibold text-blue-600 hover:underline">
                        Reset Filters
                    </button>
                    <button onClick={props.onClose} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                        Done
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default FilterModal;
