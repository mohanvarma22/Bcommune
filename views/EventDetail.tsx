import React, { useContext, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import { CalendarIcon, LocationIcon, TicketIcon, ArrowUpRightIcon } from '../components/common/Icons';
import type { Speaker, AgendaItem } from '../types';
import EventPassModal from '../components/events/EventPassModal';
import JobSlotCard from '../components/events/JobSlotCard';
import AttendeeManagement from '../components/events/AttendeeManagement';

const SpeakerCard: React.FC<{ speaker: Speaker }> = ({ speaker }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
        <Avatar src={speaker.avatarUrl ?? 'https://picsum.photos/seed/speaker/200'} alt={speaker.name} size="lg" />
        <div>
            <p className="font-bold text-slate-900">{speaker.name}</p>
            <p className="text-sm text-slate-600">{speaker.title}</p>
        </div>
    </div>
);

const AgendaListItem: React.FC<{ item: AgendaItem }> = ({ item }) => (
    <div className="flex items-start gap-4">
        <p className="w-24 font-semibold text-blue-600">{item.time}</p>
        <p className="flex-1 text-slate-700">{item.topic}</p>
    </div>
);

const EventDetail: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { events, currentUser, rsvpToEvent } = useContext(DataContext);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'attendees'>('details');

    const event = events.find(e => e.id === eventId);

    if (!event) {
        return <Navigate to="/events" replace />;
    }

    const isOwner = currentUser?.id === event.authorId;
    const hasRsvpd = event.rsvps.includes(currentUser?.id || '');
    const slotsAvailable = event.totalSlots ? event.totalSlots - event.rsvps.length : Infinity;
    const isFull = slotsAvailable <= 0;

    const TabButton: React.FC<{ tabName: 'details' | 'attendees'; label: string; }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
        >
            {label}
        </button>
    );

    return (
        <>
            <div className="max-w-3xl mx-auto">
                {event.coverImageUrl && <img src={event.coverImageUrl} alt={event.title} className="w-full h-auto max-h-72 object-cover rounded-xl mb-8" />}
                
                <div className="mb-8">
                    <p className="font-semibold text-blue-600 tracking-wide">{event.type.toUpperCase()}</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mt-2">{event.title}</h1>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8 text-slate-600">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            <span className="font-medium">{event.date}{event.time && `, ${event.time}`}</span>
                        </div>
                        {event.location && (
                             <div className="flex items-center gap-2">
                                <LocationIcon className="w-5 h-5" />
                                <span className="font-medium">{event.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {isOwner && event.type === 'Walk-in Interview' && (
                     <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-lg mb-6">
                        <TabButton tabName="details" label="Event Details" />
                        <TabButton tabName="attendees" label={`Attendees (${event.interestedAttendees?.length || 0})`} />
                    </div>
                )}
                
                {activeTab === 'details' && (
                    <div className="space-y-8">
                        <Card>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">About this Event</h3>
                                <p className="text-slate-600 whitespace-pre-wrap">{event.description}</p>
                                {event.address && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-sm font-semibold text-slate-800">Venue Address</p>
                                        <p className="text-slate-600">{event.address}</p>
                                        {event.directionsUrl && (
                                            <a href={event.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:underline font-semibold">
                                                <span>Get Directions</span>
                                                <ArrowUpRightIcon />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {!isOwner && event.type !== 'Walk-in Interview' && (
                                 <div className="p-6 border-t border-slate-200">
                                    {event.totalSlots && (
                                        <div className="text-center mb-4">
                                            <p className="text-2xl font-bold text-slate-900">{slotsAvailable}</p>
                                            <p className="text-sm text-slate-500">Slots Remaining</p>
                                        </div>
                                    )}
                                    {hasRsvpd ? (
                                        <button 
                                            onClick={() => setIsPassModalOpen(true)}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                                        >
                                            <TicketIcon className="w-5 h-5" />
                                            <span>View Your Pass</span>
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="w-full px-6 py-3 bg-slate-300 text-slate-500 font-semibold rounded-md cursor-not-allowed">
                                            Event Full
                                        </button>
                                    ) : (
                                        <button onClick={() => rsvpToEvent(event.id)} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                                            RSVP Now
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                         {event.type === 'Walk-in Interview' && event.jobSlots && (
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Roles Available</h3>
                                    <div className="space-y-4">
                                        {event.jobSlots.map(slot => <JobSlotCard key={slot.title} eventId={event.id} jobSlot={slot} />)}
                                    </div>
                                </div>
                            </Card>
                        )}
                         {event.speakers && event.speakers.length > 0 && (
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Speakers</h3>
                                    <div className="space-y-4">
                                        {event.speakers.map((speaker, index) => <SpeakerCard key={index} speaker={speaker} />)}
                                    </div>
                                </div>
                            </Card>
                        )}
                        {event.agenda && event.agenda.length > 0 && (
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Agenda</h3>
                                    <div className="space-y-4">
                                        {event.agenda.map((item, index) => <AgendaListItem key={index} item={item} />)}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === 'attendees' && isOwner && event.type === 'Walk-in Interview' && (
                    <AttendeeManagement event={event} />
                )}
            </div>
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

export default EventDetail;