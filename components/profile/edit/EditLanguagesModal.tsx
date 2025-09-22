import React, { useState, useContext } from 'react';
import Modal from '../../common/Modal';
import Card from '../../common/Card';
import type { Language } from '../../../types';
import { DataContext } from '../../../context/DataContext';

interface EditLanguagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialLanguages: Language[];
}

const proficiencyLevels: Language['proficiency'][] = ['Native', 'Fluent', 'Conversational', 'Basic'];

const EditLanguagesModal: React.FC<EditLanguagesModalProps> = ({ isOpen, onClose, initialLanguages }) => {
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [languages, setLanguages] = useState<Language[]>(initialLanguages);
    
    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
        const newLangs = [...languages];
        newLangs[index] = { ...newLangs[index], [field]: value as Language['proficiency'] };
        setLanguages(newLangs);
    };

    const addLanguage = () => {
        setLanguages([...languages, { name: '', proficiency: 'Conversational' }]);
    };

    const removeLanguage = (index: number) => {
        setLanguages(languages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCurrentUserProfile({ languages });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="max-h-[80vh] flex flex-col dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Edit Languages
                        </h2>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-6">
                        {languages.map((lang, index) => (
                            <div key={index} className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg space-y-3 relative">
                                <button type="button" onClick={() => removeLanguage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold leading-none">&times;</button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelStyle}>Language</label>
                                        <input type="text" value={lang.name} onChange={e => handleLanguageChange(index, 'name', e.target.value)} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Proficiency</label>
                                        <select value={lang.proficiency} onChange={e => handleLanguageChange(index, 'proficiency', e.target.value)} className={inputStyle}>
                                            {proficiencyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addLanguage} className="w-full py-2 text-sm font-semibold border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                            + Add Language
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Save
                        </button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default EditLanguagesModal;