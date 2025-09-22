import React, { useState, useContext } from 'react';
import type { Project, User } from '../../types';
import Card from '../common/Card';
import { ArrowUpRightIcon, EditIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import EditProjectsModal from './edit/EditProjectsModal';

interface FeaturedProjectProps {
    project: Project;
    user: User;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, user }) => {
    const { currentUser } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwner = currentUser?.id === user.id;

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Featured Project</h3>
                    {isOwner && (
                        <button onClick={() => setIsEditModalOpen(true)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                            <EditIcon />
                        </button>
                    )}
                </div>
                <Card className="overflow-hidden group">
                    {project.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                            <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </div>
                    )}
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-bold text-blue-600">{project.name}</h4>
                                <p className="text-md text-slate-600 mt-2">{project.description}</p>
                            </div>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                                <ArrowUpRightIcon />
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
            {isEditModalOpen && (
                <EditProjectsModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialProjects={user.portfolio}
                />
            )}
        </>
    );
};

export default FeaturedProject;