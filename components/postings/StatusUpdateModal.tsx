import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Job, User, ApplicantStatus } from '../../types';
import { DataContext } from '../../context/DataContext';
import { MESSAGE_TEMPLATES } from '../../constants';
import Modal from '../common/Modal';
import Card from '../common/Card';

interface StatusUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    applicant: User;
    newStatus: ApplicantStatus;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ isOpen, onClose, job, applicant, newStatus }) => {
    // FIX: Destructure companies from context.
    const { updateApplicantStatus, findOrCreateConversation, sendMessage, companies } = useContext(DataContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const template = MESSAGE_TEMPLATES[newStatus];

    useEffect(() => {
        // FIX: Find the company by ID to get its name for the template.
        const company = companies.find(c => c.id === job.companyId);
        if (template && company) {
            setMessage(template.body(applicant.name.split(' ')[0], job.title, company.name));
        }
    }, [template, applicant.name, job.title, job.companyId, companies]);

    const handleSendAndUpdate = () => {
        if (!message.trim()) {
            alert("Message cannot be empty.");
            return;
        }
        const conversation = findOrCreateConversation(applicant.id);
        sendMessage(conversation.id, message);
        updateApplicantStatus(job.id, applicant.id, newStatus);
        onClose();
        navigate(`/messages/${conversation.id}`, { state: { preselectedUserId: applicant.id } });
    };

    const handleUpdateOnly = () => {
        updateApplicantStatus(job.id, applicant.id, newStatus);
        onClose();
    };

    if (!template) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="p-6">
                <h2 id="modal-title" className="text-2xl font-bold text-slate-900">
                    Notify {applicant.name}?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    You're updating the status to <span className="font-semibold text-blue-600">{newStatus}</span>.
                    You can send a notification message below.
                </p>

                <div className="mt-4">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        className="mt-1 w-full bg-slate-100 border border-slate-300 rounded-md p-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-2 space-y-reverse sm:space-y-0">
                    <button
                        type="button"
                        onClick={handleUpdateOnly}
                        className="w-full sm:w-auto justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Update Status Only
                    </button>
                    <button
                        type="button"
                        onClick={handleSendAndUpdate}
                        className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send Message & Update Status
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default StatusUpdateModal;
