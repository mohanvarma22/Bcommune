import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import type { Event } from '../types';
import EventCard from '../components/events/EventCard';
import { LocationIcon, TicketIcon } from '../components/common/Icons';

type EventType = Event['type'];
const eventTypes: EventType[] = ['Webinar', 'Meetup', 'Conference', 'Walk-in Interview'];
type LocationFilter = 'All' | 'Virtual' | 'In-Person';

const EventsList: React.FC = () => {
    const { events } = useContext(DataContext);
    const [typeFilter, setTypeFilter] = useState<EventType | 'All'>('All');
    const [locationFilter, setLocationFilter] = useState<LocationFilter>('All');
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const handleToggleExpand = (itemId: string) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const typeMatch = typeFilter === 'All' || event.type === typeFilter;
            
            const isVirtual = event.location.toLowerCase().includes('virtual') || event.location.toLowerCase().includes('online');
            const locationMatch = locationFilter === 'All' ||
                (locationFilter === 'Virtual' && isVirtual) ||
                (locationFilter === 'In-Person' && !isVirtual);

            return typeMatch && locationMatch;
        });
    }, [events, typeFilter, locationFilter]);

    const FilterButton: React.FC<{ label: string; value: any; activeValue: any; onClick: (value: any) => void; }> = ({ label, value, activeValue, onClick }) => (
        <button
            onClick={() => onClick(value)}
            className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${activeValue === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-slate-900">Community Events</h1>
                <p className="text-lg text-slate-500 mt-2">Discover opportunities to learn, connect, and grow.</p>
            </div>

            <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                <div className="flex justify-center flex-wrap gap-2">
                    <FilterButton label="All Types" value="All" activeValue={typeFilter} onClick={setTypeFilter} />
                    {eventTypes.map(type => (
                        <FilterButton key={type} label={type === 'Walk-in Interview' ? 'Walk-in Interviews' : `${type}s`} value={type} activeValue={typeFilter} onClick={setTypeFilter} />
                    ))}
                </div>
                 <div className="flex justify-center flex-wrap gap-2">
                    <FilterButton label="All Locations" value="All" activeValue={locationFilter} onClick={setLocationFilter} />
                    <FilterButton label="Virtual" value="Virtual" activeValue={locationFilter} onClick={setLocationFilter} />
                    <FilterButton label="In-Person" value="In-Person" activeValue={locationFilter} onClick={setLocationFilter} />
                </div>
            </div>

            <div className="space-y-6">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            isExpanded={expandedItemId === event.id}
                            onToggleExpand={() => handleToggleExpand(event.id)}
                        />
                    ))
                ) : (
                    <p className="text-center text-slate-500 py-12">No upcoming events match your filters.</p>
                )}
            </div>
        </div>
    );
};

export default EventsList;