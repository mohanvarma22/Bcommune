import React, { useState, useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';
import type { Venture, VenturePreferences } from '../../types';

interface TalentPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    venture: Venture;
}

const TalentPreferencesModal: React.FC<TalentPreferencesModalProps> = ({ isOpen, onClose, venture }) => {
    const { updateVenturePreferences } = useContext(DataContext);
    const [skills, setSkills] = useState((venture.preferences?.skills || venture.seeking).join(', '));
    const [location, setLocation] = useState(venture.preferences?.location || 'All');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPreferences: VenturePreferences = {
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            location,
        };
        updateVenturePreferences(venture.id, newPreferences);
        onClose();
    };

    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <Card className="dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Talent Preferences</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Refine the profiles you see in your Talent Radar.</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="skills" className={labelStyle}>Skills / Roles (comma-separated)</label>
                                <textarea
                                    id="skills"
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    rows={3}
                                    className={inputStyle}
                                    placeholder="React, Growth Marketer, Figma..."
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className={labelStyle}>Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className={inputStyle}
                                    placeholder="e.g., Remote, New York, or All"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Save Preferences
                        </button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default TalentPreferencesModal;
