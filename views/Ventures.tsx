import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import VentureCard from '../components/ventures/VentureCard';
import IncubatorFeed from '../components/ventures/IncubatorFeed';
import { SearchIcon } from '../components/common/Icons';
import MultiSelectDropdown from '../components/common/MultiSelectDropdown';

const Ventures: React.FC = () => {
    const { ventures } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<'feed' | 'discover'>('feed');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilters, setIndustryFilters] = useState<string[]>([]);
    const [stageFilters, setStageFilters] = useState<string[]>([]);
    const [skillsFilters, setSkillsFilters] = useState<string[]>([]);

    const { uniqueIndustries, uniqueStages, uniqueSkills } = useMemo(() => {
        const industries = [...new Set(ventures.flatMap(v => v.market))].sort();
        const stages = [...new Set(ventures.map(v => v.stage))].sort();
        const skills = [...new Set(ventures.flatMap(v => v.seeking))].sort();
        return { uniqueIndustries: industries, uniqueStages: stages, uniqueSkills: skills };
    }, [ventures]);

    const filteredVentures = useMemo(() => {
        return ventures.filter(v => {
            const lowerCaseTerm = searchTerm.toLowerCase();
            const searchTermMatch = !searchTerm ||
                v.name.toLowerCase().includes(lowerCaseTerm) ||
                v.tagline.toLowerCase().includes(lowerCaseTerm);
            
            const industryMatch = industryFilters.length === 0 || v.market.some(m => industryFilters.includes(m));
            const stageMatch = stageFilters.length === 0 || stageFilters.includes(v.stage);
            const skillsMatch = skillsFilters.length === 0 || v.seeking.some(s => skillsFilters.includes(s));

            return searchTermMatch && industryMatch && stageMatch && skillsMatch;
        });
    }, [ventures, searchTerm, industryFilters, stageFilters, skillsFilters]);
    
    const handleResetFilters = () => {
        setSearchTerm('');
        setIndustryFilters([]);
        setStageFilters([]);
        setSkillsFilters([]);
    };
    
    const hasActiveFilters = searchTerm || industryFilters.length > 0 || stageFilters.length > 0 || skillsFilters.length > 0;

    const TabButton: React.FC<{ tabName: 'feed' | 'discover', label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex-1 ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Venture Incubator</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-1 mb-6">Shape the future by giving feedback, or discover your next mission.</p>

            <div className="p-1 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1 w-full max-w-sm">
                <TabButton tabName="feed" label="Incubator Feed" />
                <TabButton tabName="discover" label="Discover Ventures" />
            </div>
            
            {activeTab === 'feed' && <IncubatorFeed />}

            {activeTab === 'discover' && (
                <div>
                    <Card className="p-4 mb-6 dark:bg-slate-800 dark:border-slate-700">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500"><SearchIcon /></div>
                                <input 
                                    type="text" 
                                    placeholder="Search by name or tagline..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <MultiSelectDropdown 
                                    label="Industry"
                                    options={uniqueIndustries}
                                    selectedOptions={industryFilters}
                                    onChange={setIndustryFilters}
                                />
                                <MultiSelectDropdown 
                                    label="Stage"
                                    options={uniqueStages}
                                    selectedOptions={stageFilters}
                                    onChange={setStageFilters}
                                />
                                <MultiSelectDropdown 
                                    label="Skills Needed"
                                    options={uniqueSkills}
                                    selectedOptions={skillsFilters}
                                    onChange={setSkillsFilters}
                                />
                            </div>
                            {hasActiveFilters && (
                                <div className="flex justify-end">
                                    <button onClick={handleResetFilters} className="text-sm font-semibold text-blue-600 hover:underline">
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVentures.length > 0 ? (
                            filteredVentures.map(venture => (
                                <VentureCard key={venture.id} venture={venture} />
                            ))
                        ) : (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                                <h3 className="text-xl font-semibold text-slate-700">No Ventures Found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ventures;