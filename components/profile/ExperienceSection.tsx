import React, { useState, useContext } from 'react';
import type { Experience, User } from '../../types';
import Card from '../common/Card';
import { EditIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import EditExperienceModal from './edit/EditExperienceModal';

interface ExperienceSectionProps {
    experiences: Experience[];
    user: User;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, user }) => {
    const { currentUser } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwner = currentUser?.id === user.id;

    return (
        <>
            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Experience</h3>
                        {isOwner && (
                            <button onClick={() => setIsEditModalOpen(true)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                                <EditIcon />
                            </button>
                        )}
                    </div>
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3">
                        <ul className="space-y-10">
                            {experiences.map((exp, index) => (
                                <li key={index} className="relative pl-10">
                                    <div className="absolute -left-[7px] top-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                                    <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{exp.role}</h4>
                                    <p className="text-md text-slate-700 dark:text-slate-300">{exp.company}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{exp.period}</p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{exp.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>
            {isEditModalOpen && (
                <EditExperienceModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialExperiences={experiences}
                />
            )}
        </>
    );
};

export default ExperienceSection;