import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../../types';
import { DataContext } from '../../context/DataContext';
import EventCard from '../events/EventCard';
import AttendeesModal from './AttendeesModal';
import { EllipsisVerticalIcon } from '../common/Icons';

interface EventPostingManagerProps {
    events: Event[];
}

const EventPostingManager: React.FC<EventPostingManagerProps> = ({ events }) => {
    const { updateEventStatus } = useContext(DataContext);
    const [attendeesModalEvent, setAttendeesModalEvent] = useState<Event | null>(null);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const handleToggleExpand = (eventId: string) => {
        setExpandedEventId(prevId => (prevId === eventId ? null : eventId));
    };
    
    if (events.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-slate-700">No Events Created</h3>
                <p className="text-slate-500 mt-2">Create an event to engage with the community.</p>
                <Link to="/create/event" className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                    Create an Event
                </Link>
            </div>
        );
    }

    const StatusButton: React.FC<{ event: Event, newStatus: Event['status'], label: string }> = ({ event, newStatus, label }) => (
        <button onClick={() => { updateEventStatus(event.id, newStatus); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            {label}
        </button>
    );

    return (
        <>
            <div className="space-y-6">
                {events.map(event => (
                    <div key={event.id}>
                        <EventCard
                            event={event}
                            isExpanded={expandedEventId === event.id}
                            onToggleExpand={() => handleToggleExpand(event.id)}
                        />
                        <div className="-mt-1 bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl p-3 flex justify-end items-center gap-2">
                            <button
                                onClick={() => setAttendeesModalEvent(event)}
                                className="px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                View Attendees ({event.rsvps.length})
                            </button>
                            <div className="relative" ref={openMenuId === event.id ? menuRef : null}>
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                                >
                                    <EllipsisVerticalIcon />
                                </button>
                                {openMenuId === event.id && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                                        <p className="px-4 py-2 text-xs text-slate-400">Set Status</p>
                                        {event.status !== 'Completed' && <StatusButton event={event} newStatus="Completed" label="Mark as Completed" />}
                                        {event.status !== 'Cancelled' && <StatusButton event={event} newStatus="Cancelled" label="Mark as Cancelled" />}
                                        {event.status !== 'Upcoming' && <StatusButton event={event} newStatus="Upcoming" label="Mark as Upcoming" />}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {attendeesModalEvent && (
                <AttendeesModal 
                    isOpen={!!attendeesModalEvent}
                    onClose={() => setAttendeesModalEvent(null)}
                    event={attendeesModalEvent}
                />
            )}
        </>
    );
};

export default EventPostingManager;