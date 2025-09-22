import React, { useState, useContext } from 'react';
import Modal from '../../common/Modal';
import Card from '../../common/Card';
import { DataContext } from '../../../context/DataContext';

interface EditSkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSkills: string[];
}

const EditSkillsModal: React.FC<EditSkillsModalProps> = ({ isOpen, onClose, initialSkills }) => {
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [skills, setSkills] = useState(initialSkills.join(', '));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        updateCurrentUserProfile({ skills: skillsArray });
        onClose();
    };

    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Edit Skills
                        </h2>
                        <div className="mt-4">
                            <label htmlFor="skills" className={labelStyle}>
                                Skills (comma-separated)
                            </label>
                            <textarea
                                id="skills"
                                value={skills}
                                onChange={e => setSkills(e.target.value)}
                                rows={5}
                                className={inputStyle}
                                placeholder="React, TypeScript, Node.js..."
                            />
                        </div>
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

export default EditSkillsModal;