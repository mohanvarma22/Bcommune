import React, { useState, useContext, useMemo } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import type { Job, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import { CloseIcon, GoogleIcon, MicrosoftIcon } from '../common/Icons';

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    applicant: User;
}

const allTimeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, job, applicant }) => {
    const { users, currentUser, scheduleInterview, companies } = useContext(DataContext);
    const applicantStatus = job.applicantDetails.find(ad => ad.userId === applicant.id)?.status;
    const company = companies.find(c => c.id === job.companyId);

    const [selectedDate, setSelectedDate] = useState<string>('July 25, 2024'); // Mocked
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [interviewers, setInterviewers] = useState<string[]>([currentUser?.id || '']);
    const [videoProvider, setVideoProvider] = useState<'google' | 'microsoft' | null>(null);
    const [suggestedSlots, setSuggestedSlots] = useState<string[]>([]);
    const [isFindingTime, setIsFindingTime] = useState(false);

    const availableInterviewers = useMemo(() => {
        return users.filter(u => u.id !== currentUser?.id && u.id !== applicant.id);
    }, [users, currentUser, applicant]);

    const handleInterviewerToggle = (userId: string) => {
        setInterviewers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleFindTime = () => {
        setIsFindingTime(true);
        // Simulate an API call to check calendars
        setTimeout(() => {
            const randomSlots = allTimeSlots.filter(() => Math.random() > 0.5).slice(0, 5);
            setSuggestedSlots(randomSlots);
            setIsFindingTime(false);
        }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time for the interview.");
            return;
        }
        
        const videoLink = videoProvider === 'google' 
            ? 'https://meet.google.com/xyz-abc-def'
            : videoProvider === 'microsoft'
            ? 'https://teams.microsoft.com/l/meetup-join/...'
            : undefined;

        scheduleInterview(job.id, applicant.id, {
            date: selectedDate,
            time: selectedTime,
            interviewers: interviewers,
            videoLink: videoLink,
        });

        alert(`Interview scheduled successfully with ${applicant.name}. They will receive a calendar invitation.`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <Card className="max-h-[90vh] flex flex-col dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <div>
                            <h3 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">Schedule Interview</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">For {applicant.name} - {applicantStatus}</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
                                <input type="text" readOnly value={`${applicantStatus}: ${applicant.name} for ${job.title}`} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interviewers</label>
                                <div className="p-2 border border-slate-300 dark:border-slate-600 rounded-md max-h-36 overflow-y-auto">
                                    {currentUser && <p className="px-2 py-1 text-sm font-semibold">{currentUser.name} (Organizer)</p>}
                                    {availableInterviewers.map(user => (
                                        <label key={user.id} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                                            <input type="checkbox" checked={interviewers.includes(user.id)} onChange={() => handleInterviewerToggle(user.id)} className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"/>
                                            <span className="text-sm">{user.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Conferencing</label>
                                <div className="flex gap-2">
                                    <button type="button" disabled={!company?.integrations?.google} onClick={() => setVideoProvider('google')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm transition ${videoProvider === 'google' ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/50' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 hover:bg-slate-50'} disabled:opacity-50`}>
                                        <GoogleIcon className="w-5 h-5" /> Google Meet
                                    </button>
                                     <button type="button" disabled={!company?.integrations?.microsoft} onClick={() => setVideoProvider('microsoft')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm transition ${videoProvider === 'microsoft' ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/50' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 hover:bg-slate-50'} disabled:opacity-50`}>
                                        <MicrosoftIcon className="w-5 h-5" /> Teams
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Find Time */}
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Find a Time</label>
                             <div className="p-3 border border-slate-300 dark:border-slate-600 rounded-md">
                                 <button
                                     type="button"
                                     onClick={handleFindTime}
                                     disabled={!company?.integrations?.google && !company?.integrations?.microsoft}
                                     className="w-full mb-3 px-3 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                    {isFindingTime ? 'Checking calendars...' : 'Suggest times'}
                                 </button>
                                 <p className="text-center font-semibold text-sm mb-2">{selectedDate}</p>
                                 <div className="grid grid-cols-3 gap-2">
                                     {allTimeSlots.map(time => {
                                         const isSuggested = suggestedSlots.includes(time);
                                         return (
                                            <button 
                                                type="button" 
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`px-2 py-1.5 text-xs rounded border transition ${
                                                    selectedTime === time 
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : isSuggested
                                                    ? 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200'
                                                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-500'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                         )
                                     })}
                                 </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Send Invitation
                        </button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default ScheduleInterviewModal;