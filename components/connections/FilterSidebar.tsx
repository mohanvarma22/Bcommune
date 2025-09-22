import React from 'react';
import Card from '../common/Card';

const FilterSidebar: React.FC = () => {
    return (
        <Card className="p-4">
            <h3 className="font-bold text-lg">Filters</h3>
            <p className="text-sm text-slate-500 mt-2">Filter options will be available here.</p>
        </Card>
    );
};

export default FilterSidebar;
