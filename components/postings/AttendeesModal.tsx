import React, { useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import type { Event, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';

interface AttendeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
}

const AttendeesModal: React.FC<AttendeesModalProps> = ({ isOpen, onClose, event }) => {
    const { users } = useContext(DataContext);
    const attendees = users.filter(u => event.rsvps.includes(u.id));

    const handleDownload = () => {
        const headers = "Name,Title,ProfileURL\n";
        const csvContent = attendees.map(a => {
            const profileUrl = `${window.location.origin}${window.location.pathname}#/profile/${a.id}`;
            return `"${a.name}","${a.title}","${profileUrl}"`;
        }).join('\n');

        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_attendees.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        alert("Attendee list download started.");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="max-h-[80vh] flex flex-col dark:bg-slate-800">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Attendees ({attendees.length})
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{event.title}</p>
                </div>

                <div className="p-2 overflow-y-auto space-y-1 flex-1">
                    {attendees.length > 0 ? (
                        attendees.map(user => (
                            <Link 
                                to={`/profile/${user.id}`} 
                                key={user.id} 
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                onClick={onClose}
                            >
                                <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.title}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="p-8 text-center text-slate-500 dark:text-slate-400">No one has RSVP'd yet.</p>
                    )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                        Close
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDownload}
                        disabled={attendees.length === 0}
                        className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-slate-400"
                    >
                        Download CSV
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default AttendeesModal;