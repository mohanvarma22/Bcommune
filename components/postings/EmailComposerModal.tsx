import React, { useState, useContext, useEffect } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import type { Job, User, EmailTemplate } from '../../types';
import { DataContext } from '../../context/DataContext';
import { MOCK_EMAIL_TEMPLATES } from '../../constants';
import { CloseIcon, SendIcon } from '../common/Icons';

interface EmailComposerModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipients: User[];
    job: Job;
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ isOpen, onClose, recipients, job }) => {
    const { sendBulkEmails, currentUser } = useContext(DataContext);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    
    useEffect(() => {
        if (selectedTemplate) {
            setSubject(selectedTemplate.subject);
            setBody(selectedTemplate.body);
        } else {
            setSubject('');
            setBody('');
        }
    }, [selectedTemplate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) {
            alert("Subject and body cannot be empty.");
            return;
        }
        sendBulkEmails(job.id, recipients.map(r => r.id), subject, body);
        onClose();
    };

    const recipientNames = recipients.map(r => r.name.split(' ')[0]).join(', ');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <Card className="max-h-[90vh] flex flex-col dark:bg-slate-800">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <h3 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">Compose Email</h3>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        <div className="flex items-center gap-2 text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">To:</span>
                            <span className="text-slate-800 dark:text-slate-200 truncate">{recipientNames}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-auto flex-shrink-0">({recipients.length} recipients)</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">From:</span>
                            <span className="text-slate-800 dark:text-slate-200">{currentUser?.email}</span>
                        </div>

                        <div>
                            <label htmlFor="template-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">Use a template</label>
                            <select 
                                id="template-select"
                                onChange={(e) => {
                                    const template = MOCK_EMAIL_TEMPLATES.find(t => t.name === e.target.value) || null;
                                    setSelectedTemplate(template);
                                }}
                                className="mt-1 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Custom Message</option>
                                {MOCK_EMAIL_TEMPLATES.map(template => (
                                    <option key={template.name} value={template.name}>{template.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                            <input 
                                type="text" 
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                placeholder="Email Subject"
                                className="mt-1 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                             <label htmlFor="body" className="text-sm font-medium text-slate-700 dark:text-slate-300">Body</label>
                             <textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                                rows={10}
                                className="mt-1 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                You can use placeholders: `{'applicantName'}`, `{'jobTitle'}`, `{'companyName'}`, `{'recruiterName'}`
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            This will send {recipients.length} separate, personalized emails.
                        </p>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                                Cancel
                            </button>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                <SendIcon />
                                Send
                            </button>
                        </div>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default EmailComposerModal;