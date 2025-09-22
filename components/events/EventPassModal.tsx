import React, { useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';
import type { Event } from '../../types';
import { CalendarIcon, LocationIcon, LogoIcon } from '../common/Icons';

interface EventPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
}

const QRCode: React.FC = () => (
    <svg width="100" height="100" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="rounded-md">
        <rect x="0" y="0" width="120" height="120" fill="white" />
        <rect x="10" y="10" width="30" height="30" fill="black" />
        <rect x="50" y="10" width="10" height="10" fill="black" />
        <rect x="80" y="10" width="30" height="30" fill="black" />
        <rect x="10" y="50" width="10" height="10" fill="black" />
        <rect x="10" y="80" width="30" height="30" fill="black" />
        <rect x="80" y="80" width="30" height="30" fill="black" />
        <rect x="50" y="50" width="30" height="30" fill="black" />
        <rect x="60" y="30" width="10" height="10" fill="black" />
        <rect x="30" y="60" width="10" height="10" fill="black" />
        <rect x="90" y="50" width="10" height="10" fill="black" />
        <rect x="30" y="30" width="10" height="10" fill="black" />
         <rect x="70" y="70" width="10" height="10" fill="black" />
    </svg>
);


const EventPassModal: React.FC<EventPassModalProps> = ({ isOpen, onClose, event }) => {
    const { currentUser } = useContext(DataContext);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-sm mx-auto">
                <div className="p-6 bg-slate-800 text-white">
                    <div className="flex justify-between items-center">
                        <LogoIcon />
                        <span className="text-xs font-bold tracking-wider uppercase">Event Pass</span>
                    </div>
                     <h2 id="modal-title" className="text-2xl font-bold mt-4 leading-tight">
                        {event.title}
                    </h2>
                </div>
                 <div className="p-6">
                    <div className="flex items-center gap-4">
                        <QRCode />
                        <div className="space-y-2 text-sm">
                             <div className="flex items-start gap-2">
                                <CalendarIcon className="w-4 h-4 mt-0.5 text-slate-400" />
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">{event.date}</p>
                                    <p className="text-slate-500">{event.time}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <LocationIcon className="w-4 h-4 mt-0.5 text-slate-400" />
                                 <div className="flex-1">
                                     <p className="font-semibold text-slate-800">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-400">Attendee</p>
                        <p className="text-lg font-semibold text-slate-900">{currentUser?.name}</p>
                    </div>
                </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">
                        Close
                    </button>
                    <button type="button" onClick={() => alert('Download functionality not implemented.')} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Download
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EventPassModal;