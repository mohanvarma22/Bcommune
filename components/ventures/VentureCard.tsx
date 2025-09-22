import React from 'react';
import { Link } from 'react-router-dom';
import type { Venture } from '../../types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

interface VentureCardProps {
    venture: Venture;
}

const VentureCard: React.FC<VentureCardProps> = ({ venture }) => {
    return (
        <Link to={`/ventures/${venture.id}`} className="block group">
            <Card className="h-full flex flex-col p-5 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Avatar src={venture.logoUrl} alt={venture.name} size="lg" />
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{venture.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{venture.tagline}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-2">Seeking</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {venture.seeking.slice(0, 4).map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default VentureCard;
