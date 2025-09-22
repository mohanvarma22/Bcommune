import React, { useState, useContext } from 'react';
import type { Education, User } from '../../types';
import Card from '../common/Card';
import { EducationIcon, EditIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import EditEducationModal from './edit/EditEducationModal';

interface EducationSectionProps {
    education: Education[];
    user: User;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, user }) => {
    const { currentUser } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwner = currentUser?.id === user.id;

    if (education.length === 0 && !isOwner) return null;

    return (
        <>
            <Card>
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Education</h3>
                    {isOwner && (
                        <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {education.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {education.map((edu, index) => (
                            <li key={index} className="p-4 flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1 text-slate-500 dark:text-slate-400">
                                    <EducationIcon />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{edu.institution}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{edu.degree}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{edu.period}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-4 text-sm text-center text-slate-500 dark:text-slate-400">Add your education history.</p>
                )}
            </Card>
            {isEditModalOpen && (
                <EditEducationModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialEducation={education}
                />
            )}
        </>
    );
};

export default EducationSection;