import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import type { Job } from '../types';
import JobDetailPane from '../components/opportunities/JobDetailPane';
import ContextPane from '../components/opportunities/ContextPane';
import Avatar from '../components/common/Avatar';
import FilterBar from '../components/opportunities/FilterBar';

const Opportunities: React.FC = () => {
    const { jobs, companies } = useContext(DataContext);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [contextView, setContextView] = useState<{ type: 'company' | 'user' | null; id: string | null }>({ type: null, id: null });

    // Filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilters, setLocationFilters] = useState<string[]>([]);
    const [companyFilters, setCompanyFilters] = useState<string[]>([]);
    const [typeFilters, setTypeFilters] = useState<string[]>([]);
    const [experienceFilters, setExperienceFilters] = useState<string[]>([]);
    const [skillFilters, setSkillFilters] = useState<string[]>([]);
    const [salaryFilters, setSalaryFilters] = useState<string[]>([]);


    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const company = companies.find(c => c.id === job.companyId);
            const lowerCaseTerm = searchTerm.toLowerCase();

            const searchTermMatch = !searchTerm ||
                job.title.toLowerCase().includes(lowerCaseTerm) ||
                (company && company.name.toLowerCase().includes(lowerCaseTerm)) ||
                job.skills.some(skill => skill.toLowerCase().includes(lowerCaseTerm));
            
            const locationMatch = locationFilters.length === 0 || locationFilters.includes(job.location);
            const companyMatch = companyFilters.length === 0 || (company && companyFilters.includes(company.name));
            const typeMatch = typeFilters.length === 0 || typeFilters.includes(job.type);
            const experienceMatch = experienceFilters.length === 0 || (job.experienceLevel && experienceFilters.includes(job.experienceLevel));
            const skillMatch = skillFilters.length === 0 || skillFilters.every(skill => job.skills.includes(skill));
            
            const salaryMatch = salaryFilters.length === 0 || salaryFilters.some(filterRange => {
                if (!job.salaryRange) return false;
                const [jobMin, jobMax] = job.salaryRange.replace(/k|\$/g, '').split(' - ').map(Number);

                if (filterRange === 'Under $80k') return jobMax <= 80;
                if (filterRange === '$80k - $120k') return jobMin <= 120 && jobMax >= 80;
                if (filterRange === '$120k - $180k') return jobMin <= 180 && jobMax >= 120;
                if (filterRange === '$180k+') return jobMin >= 180;
                return false;
            });


            return searchTermMatch && locationMatch && companyMatch && typeMatch && experienceMatch && skillMatch && salaryMatch;
        });
    }, [jobs, searchTerm, locationFilters, companyFilters, typeFilters, experienceFilters, skillFilters, salaryFilters, companies]);

    const handleSelectJob = (jobId: string) => {
        setSelectedJobId(jobId);
        setContextView({ type: null, id: null });
    };

    const handleViewCompany = (companyId: string) => {
        setContextView({ type: 'company', id: companyId });
    };

    const handleViewUser = (userId: string) => {
        setContextView({ type: 'user', id: userId });
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
            <FilterBar
                searchTerm={searchTerm} onSearchTermChange={setSearchTerm}
                locationFilters={locationFilters} onLocationChange={setLocationFilters}
                companyFilters={companyFilters} onCompanyChange={setCompanyFilters}
                typeFilters={typeFilters} onTypeChange={setTypeFilters}
                experienceFilters={experienceFilters} onExperienceChange={setExperienceFilters}
                skillFilters={skillFilters} onSkillChange={setSkillFilters}
                salaryFilters={salaryFilters} onSalaryChange={setSalaryFilters}
            />
            <div className="flex flex-1 overflow-hidden">
                {/* Column 1: Job List */}
                <div className="w-[380px] flex-shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <h2 className="text-md font-semibold text-slate-900 dark:text-slate-100">Results ({filteredJobs.length})</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredJobs.map(job => {
                            const company = companies.find(c => c.id === job.companyId);
                            return (
                                <button key={job.id} onClick={() => handleSelectJob(job.id)} className={`w-full text-left p-4 border-b border-l-4 dark:border-b-slate-700 ${selectedJobId === job.id ? 'border-l-blue-500 bg-slate-50 dark:bg-slate-800' : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-3">
                                        {company && <Avatar src={company.logoUrl} alt={company.name} size="md"/>}
                                        <div className="flex-1 overflow-hidden">
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{job.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{company?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{job.location}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Column 2: Detail Pane */}
                <div className="flex-1 overflow-y-auto">
                    {selectedJobId ? (
                        <JobDetailPane key={selectedJobId} jobId={selectedJobId} onViewCompany={handleViewCompany} onViewUser={handleViewUser} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 p-8 text-center">
                            <div>
                                <h2 className="text-2xl font-semibold">Welcome to the Explorer</h2>
                                <p>Select a job from the list to view its full details.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Column 3: Context Pane */}
                {contextView.type && (
                    <div className="w-[420px] flex-shrink-0 border-l border-slate-200 dark:border-slate-700 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                        <ContextPane view={contextView} onClose={() => setContextView({ type: null, id: null })} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Opportunities;