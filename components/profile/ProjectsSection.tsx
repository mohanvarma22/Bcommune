import React, { useState, useContext } from 'react';
import type { Project, User } from '../../types';
import ProjectCard from './ProjectCard';
import { DataContext } from '../../context/DataContext';
import { EditIcon } from '../common/Icons';
import EditProjectsModal from './edit/EditProjectsModal';

interface ProjectsSectionProps {
    projects: Project[];
    user: User;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, user }) => {
    const { currentUser } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwner = currentUser?.id === user.id;

    return (
        <>
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Other Projects</h3>
                     {isOwner && !user.portfolio.some(p => p.isFeatured) && (
                        <button onClick={() => setIsEditModalOpen(true)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                            <EditIcon />
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
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

export default ProjectsSection;