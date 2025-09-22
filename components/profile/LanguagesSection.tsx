import React, { useState, useContext } from 'react';
import type { Language, User } from '../../types';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';
import { EditIcon } from '../common/Icons';
import EditLanguagesModal from './edit/EditLanguagesModal';


interface LanguagesSectionProps {
    languages: Language[];
    user: User;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages, user }) => {
    const { currentUser } = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwner = currentUser?.id === user.id;

    if (languages.length === 0 && !isOwner) return null;

    return (
        <>
            <Card>
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Languages</h3>
                     {isOwner && (
                        <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                 {languages.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {languages.map((lang, index) => (
                            <li key={index} className="p-4 flex justify-between items-center">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{lang.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{lang.proficiency}</p>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="p-4 text-sm text-center text-slate-500 dark:text-slate-400">Add your languages.</p>
                 )}
            </Card>
            {isEditModalOpen && (
                <EditLanguagesModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialLanguages={languages}
                />
            )}
        </>
    );
};

export default LanguagesSection;