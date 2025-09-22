import React from 'react';
import Card from '../common/Card';

const MOCK_AUDIENCE_SKILLS = [
    { skill: 'React', views: 280 },
    { skill: 'TypeScript', views: 250 },
    { skill: 'Node.js', views: 210 },
    { skill: 'Python', views: 180 },
    { skill: 'UI/UX Design', views: 150 },
    { skill: 'Product Management', views: 120 },
    { skill: 'Go (Golang)', views: 90 },
];

const AudienceSkills: React.FC = () => {
    const maxViews = Math.max(...MOCK_AUDIENCE_SKILLS.map(s => s.views), 0);

    return (
        <Card>
            <div className="p-5 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Audience Skills</h3>
                <p className="text-sm text-slate-500">Top skills of people viewing your content.</p>
            </div>
            <div className="p-5 space-y-4">
                {MOCK_AUDIENCE_SKILLS.map(({ skill, views }) => (
                    <div key={skill}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-slate-700">{skill}</p>
                            <p className="text-sm text-slate-500">{views.toLocaleString()}</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(views / maxViews) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AudienceSkills;