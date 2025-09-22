import React, { useState, useContext } from 'react';
import Modal from '../../common/Modal';
import Card from '../../common/Card';
import type { Experience } from '../../../types';
import { DataContext } from '../../../context/DataContext';

interface EditExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialExperiences: Experience[];
}

const EditExperienceModal: React.FC<EditExperienceModalProps> = ({ isOpen, onClose, initialExperiences }) => {
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
    
    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
        const newExperiences = [...experiences];
        newExperiences[index] = { ...newExperiences[index], [field]: value };
        setExperiences(newExperiences);
    };

    const addExperience = () => {
        setExperiences([...experiences, { role: '', company: '', period: '', description: '' }]);
    };

    const removeExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCurrentUserProfile({ experience: experiences });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="max-h-[80vh] flex flex-col dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Edit Experience
                        </h2>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg space-y-3 relative">
                                <button type="button" onClick={() => removeExperience(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold leading-none">&times;</button>
                                <div>
                                    <label className={labelStyle}>Role</label>
                                    <input type="text" value={exp.role} onChange={e => handleExperienceChange(index, 'role', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Company</label>
                                    <input type="text" value={exp.company} onChange={e => handleExperienceChange(index, 'company', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Period</label>
                                    <input type="text" value={exp.period} onChange={e => handleExperienceChange(index, 'period', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Description</label>
                                    <textarea value={exp.description} onChange={e => handleExperienceChange(index, 'description', e.target.value)} rows={3} className={inputStyle}></textarea>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addExperience} className="w-full py-2 text-sm font-semibold border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                            + Add Experience
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

export default EditExperienceModal;