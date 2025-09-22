import React, { useState, useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';

interface AddPhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddPhoneModal: React.FC<AddPhoneModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { updatePhoneNumber } = useContext(DataContext);
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (phone.trim().length < 10) {
            alert("Please enter a valid phone number.");
            return;
        }
        updatePhoneNumber(phone);
        onSuccess();
    };

    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <Card className="dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Add Phone Number
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            We'll send you a verification code to confirm your number.
                        </p>
                        <div className="mt-4">
                            <label htmlFor="phone" className={labelStyle}>Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                className={inputStyle}
                                placeholder="(555) 123-4567"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Send Code
                        </button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default AddPhoneModal;