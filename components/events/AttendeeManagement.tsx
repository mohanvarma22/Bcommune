import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import type { Event, InterestedAttendee, User } from '../../types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

interface AttendeeManagementProps {
    event: Event;
}

const AttendeeCard: React.FC<{ attendee: InterestedAttendee; eventId: string }> = ({ attendee, eventId }) => {
    const { users, markWalkInAttendee, addNoteToWalkInAttendee } = useContext(DataContext);
    const user = users.find(u => u.id === attendee.userId);
    const [notes, setNotes] = useState(attendee.notes || '');

    if (!user) return null;

    const handleNotesBlur = () => {
        if (notes !== attendee.notes) {
            addNoteToWalkInAttendee(eventId, user.id, notes);
        }
    };

    return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
                <Link to={`/profile/${user.id}`} target="_blank" className="flex items-center gap-3 group">
                    <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                    <div>
                        <p className="font-semibold text-slate-800 text-sm group-hover:underline">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.title}</p>
                    </div>
                </Link>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={attendee.attended}
                        onChange={(e) => markWalkInAttendee(eventId, user.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                    />
                    Attended
                </label>
            </div>
            <div>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    placeholder="Add private notes..."
                    rows={2}
                    className="w-full text-xs bg-slate-100 border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
        </div>
    );
};


const AttendeeManagement: React.FC<AttendeeManagementProps> = ({ event }) => {
    const attendeesByRole = useMemo(() => {
        const groups: Record<string, InterestedAttendee[]> = {};
        if (!event.interestedAttendees) return groups;

        for (const attendee of event.interestedAttendees) {
            if (!groups[attendee.roleTitle]) {
                groups[attendee.roleTitle] = [];
            }
            groups[attendee.roleTitle].push(attendee);
        }
        return groups;
    }, [event.interestedAttendees]);

    if (!event.interestedAttendees || event.interestedAttendees.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-slate-500">No one has expressed interest yet.</p>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            {Object.entries(attendeesByRole).map(([roleTitle, attendees]) => (
                <Card key={roleTitle}>
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <h3 className="font-bold text-slate-900">{roleTitle}</h3>
                        <p className="text-sm text-slate-500">{attendees.length} interested candidate{attendees.length !== 1 && 's'}</p>
                    </div>
                    <div className="p-4 space-y-3 bg-slate-100">
                        {attendees.map(attendee => (
                           <AttendeeCard key={attendee.userId} attendee={attendee} eventId={event.id} />
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default AttendeeManagement;
