import React, { useState, useContext } from 'react';
import Modal from '../../common/Modal';
import Card from '../../common/Card';
import type { Project } from '../../../types';
import { DataContext } from '../../../context/DataContext';
import { StarIcon } from '../../common/Icons';

interface EditProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialProjects: Project[];
}

const EditProjectsModal: React.FC<EditProjectsModalProps> = ({ isOpen, onClose, initialProjects }) => {
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    
    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    const handleProjectChange = (index: number, field: keyof Project, value: string | boolean) => {
        const newProjects = [...projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        setProjects(newProjects);
    };

    const handleSetFeatured = (selectedIndex: number) => {
        const newProjects = projects.map((proj, index) => ({
            ...proj,
            isFeatured: index === selectedIndex
        }));
        setProjects(newProjects);
    };

    const addProject = () => {
        setProjects([...projects, { name: '', description: '', url: '', imageUrl: '', isFeatured: false }]);
    };

    const removeProject = (index: number) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCurrentUserProfile({ portfolio: projects });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="max-h-[80vh] flex flex-col dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Edit Projects
                        </h2>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-6">
                        {projects.map((proj, index) => (
                            <div key={index} className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg space-y-3 relative">
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                     <button type="button" onClick={() => handleSetFeatured(index)} title="Feature this project">
                                        <StarIcon solid={proj.isFeatured} className={`w-6 h-6 transition-colors ${proj.isFeatured ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`} />
                                    </button>
                                    <button type="button" onClick={() => removeProject(index)} className="w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold leading-none">&times;</button>
                                </div>
                                <div>
                                    <label className={labelStyle}>Project Name</label>
                                    <input type="text" value={proj.name} onChange={e => handleProjectChange(index, 'name', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Description</label>
                                    <textarea value={proj.description} onChange={e => handleProjectChange(index, 'description', e.target.value)} rows={3} className={inputStyle}></textarea>
                                </div>
                                 <div>
                                    <label className={labelStyle}>Project URL</label>
                                    <input type="text" value={proj.url} onChange={e => handleProjectChange(index, 'url', e.target.value)} className={inputStyle} />
                                </div>
                                 <div>
                                    <label className={labelStyle}>Image URL</label>
                                    <input type="text" value={proj.imageUrl} onChange={e => handleProjectChange(index, 'imageUrl', e.target.value)} className={inputStyle} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addProject} className="w-full py-2 text-sm font-semibold border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                            + Add Project
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

export default EditProjectsModal;