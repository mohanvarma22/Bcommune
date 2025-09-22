import React, { useState, useContext } from 'react';
import type { Event } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { CalendarIcon, LocationIcon, TicketIcon, UsersIcon } from '../common/Icons';
import EventPassModal from './EventPassModal';
import JobSlotCard from './JobSlotCard';

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const SpeakerCard: React.FC<{ name: string, title: string, avatarUrl?: string }> = ({ name, title, avatarUrl }) => (
    <div className="flex items-center gap-3">
        <Avatar src={avatarUrl ?? 'https://picsum.photos/seed/speaker/200'} alt={name} size="md" />
        <div>
            <p className="font-semibold text-slate-800 text-sm">{name}</p>
            <p className="text-xs text-slate-500">{title}</p>
        </div>
    </div>
);

const AgendaListItem: React.FC<{ time: string, topic: string }> = ({ time, topic }) => (
    <div className="flex items-start gap-3">
        <p className="w-20 text-sm font-semibold text-blue-600">{time}</p>
        <p className="flex-1 text-sm text-slate-700">{topic}</p>
    </div>
);


const EventCard: React.FC<EventCardProps> = ({ event, isExpanded, onToggleExpand }) => {
    const { currentUser, rsvpToEvent } = useContext(DataContext);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    
    const isOwner = currentUser?.id === event.authorId;
    const hasRsvpd = event.rsvps.includes(currentUser?.id || '');
    const isFull = event.totalSlots ? event.rsvps.length >= event.totalSlots : false;
    const progress = event.totalSlots ? (event.rsvps.length / event.totalSlots) * 100 : 0;

    return (
    <>
        <Card className="hover:border-blue-500/50 transition-colors duration-300 flex flex-col">
             {event.coverImageUrl && (
                <img src={event.coverImageUrl} alt={event.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-6 cursor-pointer" onClick={onToggleExpand}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                           <span className="font-semibold text-blue-600">{event.type.toUpperCase()}</span>
                           <span>&middot; {event.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            {event.title}
                        </h3>
                         <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                             {event.time && <div className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" /><span>{event.time}</span></div>}
                             {event.location && <div className="flex items-center gap-1.5"><LocationIcon className="w-4 h-4" /><span>{event.location}</span></div>}
                         </div>
                    </div>
                     <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <UsersIcon />
                        <span>{event.rsvps.length}</span>
                    </div>
                </div>
            </div>
            
            {isExpanded ? (
                <div onClick={(e) => e.stopPropagation()} className="px-6 pb-6 space-y-6">
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{event.description}</p>
                    
                    {event.type === 'Walk-in Interview' && event.jobSlots && (
                        <div>
                            <h4 className="text-md font-semibold text-slate-800 mb-3">Roles Available</h4>
                            <div className="space-y-3">
                                {event.jobSlots.map(slot => <JobSlotCard key={slot.title} eventId={event.id} jobSlot={slot} />)}
                            </div>
                        </div>
                    )}

                    {event.address && (
                        <div>
                            <h4 className="text-md font-semibold text-slate-800 mb-3">Location Details</h4>
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                                <LocationIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{event.address}</p>
                                    {event.directionsUrl && (
                                        <a href={event.directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold">
                                            Get Directions &rarr;
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {event.speakers && event.speakers.length > 0 && (
                            <div>
                            <h4 className="text-md font-semibold text-slate-800 mb-3">Speakers</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {event.speakers.map((speaker, index) => <SpeakerCard key={index} {...speaker} />)}
                            </div>
                        </div>
                    )}

                    {event.agenda && event.agenda.length > 0 && (
                        <div>
                            <h4 className="text-md font-semibold text-slate-800 mb-3">Agenda</h4>
                            <div className="space-y-3">
                                {event.agenda.map((item, index) => <AgendaListItem key={index} {...item} />)}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="px-6 pb-6">
                     <p className="text-sm text-slate-600 line-clamp-2">
                        {event.description}
                    </p>
                </div>
            )}
            
            <div className="border-t border-slate-200 px-6 py-4 mt-auto">
                {event.totalSlots && (
                    <div className="mb-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-semibold text-slate-700">Slots Filled</span>
                            <span className="text-slate-500">{event.rsvps.length} / {event.totalSlots}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
                
                {!isOwner && event.type !== 'Walk-in Interview' && (
                    hasRsvpd ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsPassModalOpen(true); }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition"
                        >
                            <TicketIcon className="w-5 h-5" />
                            <span>View Your Pass</span>
                        </button>
                    ) : isFull ? (
                         <button disabled className="w-full px-4 py-2 bg-slate-300 text-slate-500 font-semibold rounded-md cursor-not-allowed">
                           Event Full
                        </button>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); rsvpToEvent(event.id); }}
                            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                        >
                           RSVP Now
                        </button>
                    )
                )}
                 {!isOwner && event.type === 'Walk-in Interview' && (
                    <button onClick={onToggleExpand} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                        View Roles & Express Interest
                    </button>
                )}
            </div>
        </Card>

        {isPassModalOpen && (
            <EventPassModal
                isOpen={isPassModalOpen}
                onClose={() => setIsPassModalOpen(false)}
                event={event}
            />
        )}
    </>
    );
};

export default EventCard;