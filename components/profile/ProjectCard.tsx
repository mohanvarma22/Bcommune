import React from 'react';
import type { Project } from '../../types';
import Card from '../common/Card';
import { ArrowUpRightIcon } from '../common/Icons';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="h-full overflow-hidden hover:border-blue-500/50 transition-colors duration-300">
                {project.imageUrl ? (
                    <div className="aspect-video overflow-hidden">
                         <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                ) : (
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        <p className="text-slate-500">No Image</p>
                    </div>
                )}
                <div className="p-4">
                    <h4 className="font-bold text-slate-800 truncate">{project.name}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                </div>
            </Card>
        </a>
    );
};

export default ProjectCard;