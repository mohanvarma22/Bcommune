
import React from 'react';
import Card from '../common/Card';

interface TrendingSkillsProps {
  skills: string[];
}

const TrendingSkills: React.FC<TrendingSkillsProps> = ({ skills }) => {
  return (
    <Card>
      <div className="p-5 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Trending Skills</h3>
        <p className="text-sm text-slate-500">What the ecosystem is building with.</p>
      </div>
      <div className="p-5 flex flex-wrap gap-2">
        {skills.map(skill => (
            <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
              {skill}
            </span>
          ))}
      </div>
    </Card>
  );
};

export default TrendingSkills;