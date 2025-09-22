import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../../types';
import Card from '../common/Card';
import { CalendarIcon } from '../common/Icons';

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <Card>
        <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
            <p className="text-sm text-slate-500">Connect with the community.</p>
        </div>
        <ul className="divide-y divide-slate-200">
            {events.map(event => (
                 <li key={event.id}>
                    <Link to={`/events/${event.id}`} className="block p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex-shrink-0 bg-slate-100 p-2 rounded-lg">
                            <CalendarIcon />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{event.title}</p>
                            <p className="text-sm text-slate-500">{event.date} &middot; <span className="text-blue-600">{event.type}</span></p>
                        </div>
                    </Link>
                 </li>
            ))}
        </ul>
        <div className="p-4 text-center border-t border-slate-200">
            <Link to="/events" className="text-sm font-semibold text-blue-600 hover:underline">View all events</Link>
        </div>
    </Card>
  );
};

export default UpcomingEvents;