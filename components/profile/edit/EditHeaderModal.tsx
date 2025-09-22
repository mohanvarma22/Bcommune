import React, { useState, useContext } from 'react';
import Modal from '../../common/Modal';
import Card from '../../common/Card';
import type { User } from '../../../types';
import { DataContext } from '../../../context/DataContext';

interface EditHeaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

const EditHeaderModal: React.FC<EditHeaderModalProps> = ({ isOpen, onClose, user }) => {
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [name, setName] = useState(user.name);
    const [title, setTitle] = useState(user.title);
    const [location, setLocation] = useState(user.location);
    const [vision, setVision] = useState(user.vision || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCurrentUserProfile({ name, title, location, vision });
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
                            Edit Intro
                        </h2>
                        <div className="mt-4 space-y-4">
                             <div>
                                <label htmlFor="name" className={labelStyle}>Full Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="title" className={labelStyle}>Title</label>
                                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="location" className={labelStyle}>Location</label>
                                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="vision" className={labelStyle}>Vision / About Me</label>
                                <textarea id="vision" value={vision} onChange={e => setVision(e.target.value)} rows={4} className={inputStyle}></textarea>
                            </div>
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

export default EditHeaderModal;