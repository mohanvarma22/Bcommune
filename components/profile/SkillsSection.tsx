import React, { useState, useContext } from 'react';
import Card from '../common/Card';
import { EditIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import type { User } from '../../types';
import EditSkillsModal from './edit/EditSkillsModal';

interface SkillsSectionProps {
    skills: string[];
    user: User;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, user }) => {
    const { currentUser } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwner = currentUser?.id === user.id;

    return (
        <>
            <Card>
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Skills & Expertise</h3>
                    {isOwner && (
                        <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="p-5 flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                            {skill}
                        </span>
                    ))}
                </div>
            </Card>
            {isEditModalOpen && (
                <EditSkillsModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialSkills={skills}
                />
            )}
        </>
    );
};

export default SkillsSection;