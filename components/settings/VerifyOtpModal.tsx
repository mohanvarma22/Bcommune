import React, { useState, useEffect, useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';

interface VerifyOtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactType: 'email' | 'phone' | null;
}

const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({ isOpen, onClose, contactType }) => {
    const { currentUser, verifyContact } = useContext(DataContext);
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Simulate sending an OTP
            setTimeout(() => {
                alert('InnovateLink verification code: 123456');
            }, 500);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactType || otp.length !== 6) {
            alert("Please enter a valid 6-digit code.");
            return;
        }
        
        const success = verifyContact(contactType, otp);
        if (success) {
            alert(`${contactType === 'email' ? 'Email' : 'Phone number'} verified successfully!`);
            onClose();
        } else {
            alert("Invalid verification code. Please try again.");
        }
        setOtp('');
    };

    const contactValue = contactType === 'email' ? currentUser?.email : currentUser?.phone;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <Card className="dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 text-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Verify Your {contactType === 'email' ? 'Email' : 'Phone'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Enter the 6-digit code we sent to <br />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{contactValue}</span>
                        </p>
                        <div className="mt-6">
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                                maxLength={6}
                                className="w-48 text-center text-2xl tracking-[0.5em] font-mono bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Verify
                        </button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default VerifyOtpModal;