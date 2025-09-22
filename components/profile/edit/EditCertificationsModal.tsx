import React, { useState, useContext } from 'react';
import Modal from '../../common/Modal';
import Card from '../../common/Card';
import type { Certification } from '../../../types';
import { DataContext } from '../../../context/DataContext';

interface EditCertificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCertifications: Certification[];
}

const EditCertificationsModal: React.FC<EditCertificationsModalProps> = ({ isOpen, onClose, initialCertifications }) => {
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
    
    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
        const newCerts = [...certifications];
        newCerts[index] = { ...newCerts[index], [field]: value };
        setCertifications(newCerts);
    };

    const addCertification = () => {
        setCertifications([...certifications, { name: '', issuer: '', date: '' }]);
    };

    const removeCertification = (index: number) => {
        setCertifications(certifications.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCurrentUserProfile({ certifications });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="max-h-[80vh] flex flex-col dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Edit Certifications
                        </h2>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-6">
                        {certifications.map((cert, index) => (
                            <div key={index} className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg space-y-3 relative">
                                <button type="button" onClick={() => removeCertification(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold leading-none">&times;</button>
                                <div>
                                    <label className={labelStyle}>Certification Name</label>
                                    <input type="text" value={cert.name} onChange={e => handleCertificationChange(index, 'name', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Issuing Organization</label>
                                    <input type="text" value={cert.issuer} onChange={e => handleCertificationChange(index, 'issuer', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Date Issued</label>
                                    <input type="text" value={cert.date} onChange={e => handleCertificationChange(index, 'date', e.target.value)} className={inputStyle} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addCertification} className="w-full py-2 text-sm font-semibold border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                            + Add Certification
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

export default EditCertificationsModal;