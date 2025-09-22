import React from 'react';
import type { User, Venture } from '../../types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { LocationIcon } from '../common/Icons';

interface TalentCardProps {
    user: User;
    venture: Venture;
}

const TalentCard: React.FC<TalentCardProps> = ({ user, venture }) => {
    const seekingSkills = (venture.preferences?.skills || venture.seeking).map(s => s.toLowerCase());
    
    const matchingSkills = user.skills.filter(s => seekingSkills.includes(s.toLowerCase()));
    const otherSkills = user.skills.filter(s => !seekingSkills.includes(s.toLowerCase()));

    const featuredProject = user.portfolio.find(p => p.isFeatured) || user.portfolio[0];
    const latestExperience = user.experience[0];

    return (
        <Card className="h-full flex flex-col p-5 overflow-y-auto dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">{user.name}</h3>
                    <p className="text-md text-blue-600 dark:text-blue-400">{user.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <LocationIcon className="w-4 h-4" />
                        <span>{user.location}</span>
                    </div>
                </div>
            </div>
            
            {/* Vision */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{user.vision}"</p>
            </div>

            {/* Skills */}
            <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-2">Skills</h4>
                <div className="flex flex-col gap-2">
                    {matchingSkills.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Matching Skills:</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {matchingSkills.map(skill => (
                                    <span key={skill} className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                     {otherSkills.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Other Key Skills:</p>
                             <div className="flex flex-wrap gap-1.5 mt-1">
                                {otherSkills.slice(0, 8).map(skill => (
                                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
             {/* Snippets */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                {latestExperience && (
                     <div>
                        <h4 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-1">Recent Experience</h4>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{latestExperience.role} at {latestExperience.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{latestExperience.description}</p>
                    </div>
                )}
                 {featuredProject && (
                     <div>
                        <h4 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-1">Featured Project</h4>
                         <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{featuredProject.name}</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{featuredProject.description}</p>
                    </div>
                )}
            </div>

        </Card>
    );
};

export default TalentCard;
