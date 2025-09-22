import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import UserCard from '../components/connections/UserCard';
import Card from '../components/common/Card';
import { SearchIcon, LocationIcon, BuildingIcon, GraduationCapIcon, ChevronDownIcon } from '../components/common/Icons';

const FilterSelect: React.FC<{
    icon: React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    defaultOption: string;
}> = ({ icon, value, onChange, options, defaultOption }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
            {icon}
        </div>
        <select
            value={value}
            onChange={onChange}
            className="w-full appearance-none pl-10 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-800 dark:text-slate-200"
        >
            <option value="All">{defaultOption}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
            <ChevronDownIcon />
        </div>
    </div>
);


const Connections: React.FC = () => {
    const { users, currentUser } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<'discover' | 'network'>('discover');
    
    // State for all filters
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');
    const [companyFilter, setCompanyFilter] = useState('All');
    const [schoolFilter, setSchoolFilter] = useState('All');

    const handleResetFilters = () => {
        setSearchTerm('');
        setLocationFilter('All');
        setCompanyFilter('All');
        setSchoolFilter('All');
    };

    const { myConnections, shuffledDiscoverUsers, uniqueLocations, uniqueCompanies, uniqueSchools } = useMemo(() => {
        if (!currentUser) return { myConnections: [], shuffledDiscoverUsers: [], uniqueLocations: [], uniqueCompanies: [], uniqueSchools: [] };
        
        const myConnections = users.filter(u => currentUser.connections.includes(u.id));
        const discover = users.filter(u => u.id !== currentUser.id && !currentUser.connections.includes(u.id));
        
        // Fisher-Yates shuffle for dynamic discovery
        for (let i = discover.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [discover[i], discover[j]] = [discover[j], discover[i]];
        }
        
        // Extract unique options for filters
        const uniqueLocations = [...new Set(users.map(u => u.location).filter(Boolean))].sort();
        const uniqueCompanies = [...new Set(users.flatMap(u => u.experience.map(e => e.company)).filter(Boolean))].sort();
        const uniqueSchools = [...new Set(users.flatMap(u => u.education.map(e => e.institution)).filter(Boolean))].sort();

        return { myConnections, shuffledDiscoverUsers: discover, uniqueLocations, uniqueCompanies, uniqueSchools };
    }, [users, currentUser]);

    const filteredUsers = useMemo(() => {
        const listToFilter = activeTab === 'discover' ? shuffledDiscoverUsers : myConnections;
        
        return listToFilter.filter(user => {
            const searchTermMatch = !searchTerm || user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.title.toLowerCase().includes(searchTerm.toLowerCase());
            const locationMatch = locationFilter === 'All' || user.location === locationFilter;
            const companyMatch = companyFilter === 'All' || user.experience.some(exp => exp.company === companyFilter);
            const schoolMatch = schoolFilter === 'All' || user.education.some(edu => edu.institution === schoolFilter);
            
            return searchTermMatch && locationMatch && companyMatch && schoolMatch;
        });
    }, [activeTab, shuffledDiscoverUsers, myConnections, searchTerm, locationFilter, companyFilter, schoolFilter]);

    const TabButton: React.FC<{ tabName: 'discover' | 'network', label: string, count: number }> = ({ tabName, label, count }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full sm:w-auto ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'}`}
        >
            {label} <span className="text-xs bg-slate-200/50 px-1.5 py-0.5 rounded-full dark:bg-slate-600/50">{count}</span>
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">My Network</h1>
            
            <div className="p-2 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <TabButton tabName="discover" label="Discover" count={shuffledDiscoverUsers.length} />
                <TabButton tabName="network" label="My Network" count={myConnections.length} />
            </div>

            <Card className="p-4 mb-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    <div className="relative md:col-span-2 lg:col-span-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500"><SearchIcon /></div>
                        <input type="text" placeholder="Search by name or title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500" />
                    </div>
                    <FilterSelect icon={<LocationIcon className="w-5 h-5"/>} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} options={uniqueLocations} defaultOption="All Locations" />
                    <FilterSelect icon={<BuildingIcon />} value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} options={uniqueCompanies} defaultOption="All Companies" />
                    <FilterSelect icon={<GraduationCapIcon />} value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)} options={uniqueSchools} defaultOption="All Schools" />
                </div>
                 {(searchTerm || locationFilter !== 'All' || companyFilter !== 'All' || schoolFilter !== 'All') && (
                    <div className="mt-4 text-right">
                        <button onClick={handleResetFilters} className="text-sm font-semibold text-blue-600 hover:underline">Reset Filters</button>
                    </div>
                 )}
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-16">
                        <h3 className="text-xl font-semibold">No users found</h3>
                        <p>Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connections;