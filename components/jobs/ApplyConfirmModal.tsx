import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';

interface ApplyConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobTitle: string;
    companyName: string;
}

const ApplyConfirmModal: React.FC<ApplyConfirmModalProps> = ({ isOpen, onClose, onConfirm, jobTitle, companyName }) => {
    const { currentUser } = useContext(DataContext);

    if (!currentUser) return null;
    
    const handleConfirm = () => {
        onConfirm();
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="p-6">
                <h2 id="modal-title" className="text-2xl font-bold text-slate-900">
                    Apply for {jobTitle}?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Your Digital Passport will be shared with {companyName} as your application. This is your chance to make a great first impression.
                </p>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">Quick Tip:</p>
                    <p className="text-xs text-blue-700 mt-1">Does your profile highlight why you're a great fit for this role? Consider a quick review before sending.</p>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-2 space-y-reverse sm:space-y-0">
                    <Link
                        to={`/profile/${currentUser.id}`}
                        onClick={onClose}
                        className="w-full sm:w-auto text-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Review & Edit Profile
                    </Link>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send Application
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default ApplyConfirmModal;