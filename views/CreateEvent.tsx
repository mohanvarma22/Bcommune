import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import type { Event, Speaker, AgendaItem, JobSlot } from '../types';

const eventTypes: { name: Event['type']; description: string }[] = [
    { name: 'Meetup', description: 'A casual, in-person gathering.' },
    { name: 'Conference', description: 'A formal, structured event.' },
    { name: 'Webinar', description: 'A virtual, online presentation.' },
    { name: 'Walk-in Interview', description: 'An open hiring event.' },
];

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const { addEvent } = useContext(DataContext);
    const [eventType, setEventType] = useState<Event['type']>('Meetup');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Form state for all possible fields
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [speakersText, setSpeakersText] = useState('');
    const [agendaText, setAgendaText] = useState('');
    const [totalSlots, setTotalSlots] = useState('');
    const [address, setAddress] = useState('');
    const [directionsUrl, setDirectionsUrl] = useState('');
    const [jobSlots, setJobSlots] = useState<JobSlot[]>([{ title: '', description: '', skills: [] }]);

    const handleJobSlotChange = (index: number, field: keyof Omit<JobSlot, 'skills'>, value: string) => {
        const newSlots = [...jobSlots];
        newSlots[index][field] = value;
        setJobSlots(newSlots);
    };
    
    const handleJobSlotSkillsChange = (index: number, value: string) => {
        const newSlots = [...jobSlots];
        newSlots[index].skills = value.split(',').map(s => s.trim());
        setJobSlots(newSlots);
    };

    const addJobSlot = () => {
        setJobSlots([...jobSlots, { title: '', description: '', skills: [] }]);
    };
    
    const removeJobSlot = (index: number) => {
        if (jobSlots.length > 1) {
            setJobSlots(jobSlots.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !description) {
            alert('Please fill out Title, Date, and Description.');
            return;
        }

        const speakers: Speaker[] = speakersText.split('\n')
            .map(line => line.trim()).filter(Boolean)
            .map(line => ({ name: line.split('-')[0]?.trim() || '', title: line.split('-')[1]?.trim() || '' }));
        
        const agenda: AgendaItem[] = agendaText.split('\n')
            .map(line => line.trim()).filter(Boolean)
            .map(line => ({ time: line.split('-')[0]?.trim() || '', topic: line.split('-')[1]?.trim() || '' }));

        const newEvent: Omit<Event, 'id' | 'authorId' | 'rsvps' | 'interestedAttendees'> = {
            title,
            date,
            description,
            type: eventType,
            location: eventType === 'Webinar' ? location || 'Virtual' : location,
            time: time || undefined,
            coverImageUrl: coverImageUrl || undefined,
            speakers: (eventType === 'Meetup' || eventType === 'Conference') && speakers.length > 0 ? speakers : undefined,
            agenda: (eventType === 'Meetup' || eventType === 'Conference') && agenda.length > 0 ? agenda : undefined,
            totalSlots: (eventType === 'Meetup' || eventType === 'Conference') && totalSlots ? parseInt(totalSlots, 10) : undefined,
            address: (eventType === 'Meetup' || eventType === 'Conference' || eventType === 'Walk-in Interview') ? address : undefined,
            directionsUrl: (eventType === 'Meetup' || eventType === 'Conference' || eventType === 'Walk-in Interview') ? directionsUrl : undefined,
            jobSlots: eventType === 'Walk-in Interview' ? jobSlots.filter(s => s.title) : undefined,
            status: 'Upcoming',
        };
        addEvent(newEvent);
        navigate('/events');
    };
    
    const inputStyle = "w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 mb-1";
    const textareaStyle = `${inputStyle} min-h-[100px]`;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Create a New Event</h1>
            <Card>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className={labelStyle}>What type of event are you creating?</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {eventTypes.map(({ name, description }) => (
                                <button
                                    type="button"
                                    key={name}
                                    onClick={() => setEventType(name)}
                                    className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${eventType === name ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white hover:bg-slate-50 border-slate-200'}`}
                                >
                                    <h4 className="font-semibold text-slate-800">{name}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-200" />
                    
                    <h3 className="text-xl font-semibold text-slate-800">Event Details</h3>

                    <div>
                        <label htmlFor="title" className={labelStyle}>Event Title *</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="date" className={labelStyle}>Date *</label>
                            <input type="text" id="date" value={date} onChange={e => setDate(e.target.value)} required placeholder="e.g., July 20" className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="time" className={labelStyle}>Time</label>
                            <input type="text" id="time" value={time} onChange={e => setTime(e.target.value)} placeholder={eventType === 'Walk-in Interview' ? "e.g., 9:00 AM - 3:00 PM" : "e.g., 4:00 PM PST"} className={inputStyle} />
                        </div>
                    </div>
                    
                    {eventType === 'Webinar' ? (
                        <div>
                            <label htmlFor="location" className={labelStyle}>Virtual Link</label>
                            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., https://zoom.us/j/12345" className={inputStyle} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className={labelStyle}>Location Summary</label>
                                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., San Francisco, CA" className={inputStyle} />
                            </div>
                             <div>
                                <label htmlFor="address" className={labelStyle}>Street Address</label>
                                <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g., 701 Brazos St, Austin, TX 78701" className={inputStyle} />
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className={labelStyle}>Event Description *</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={5} className={textareaStyle}></textarea>
                    </div>
                    
                     {eventType === 'Walk-in Interview' && (
                         <div>
                            <label className={labelStyle}>Roles Available</label>
                            <div className="space-y-4 p-4 border border-slate-300 rounded-md bg-slate-50">
                                {jobSlots.map((slot, index) => (
                                    <div key={index} className="space-y-2 relative pr-8">
                                        <button type="button" onClick={() => removeJobSlot(index)} className="absolute top-0 right-0 h-6 w-6 text-red-500 hover:bg-red-100 rounded-full font-bold">&times;</button>
                                        <input type="text" placeholder={`Role Title ${index + 1}`} value={slot.title} onChange={e => handleJobSlotChange(index, 'title', e.target.value)} className={inputStyle} />
                                        <textarea placeholder="Short description..." value={slot.description} onChange={e => handleJobSlotChange(index, 'description', e.target.value)} rows={2} className={`${inputStyle} text-sm`} />
                                        <input type="text" placeholder="Required skills (comma-separated)" value={slot.skills.join(', ')} onChange={e => handleJobSlotSkillsChange(index, e.target.value)} className={`${inputStyle} text-sm`} />
                                    </div>
                                ))}
                                <button type="button" onClick={addJobSlot} className="w-full text-sm font-semibold py-1.5 border-2 border-dashed border-slate-400 text-slate-600 rounded-md hover:bg-slate-200 transition">
                                    + Add Role
                                </button>
                            </div>
                        </div>
                     )}

                    {(eventType === 'Meetup' || eventType === 'Conference') && (
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                                {showAdvanced ? 'Hide' : 'Show'} Advanced Details (Speakers, Agenda, etc.)
                            </button>
                            {showAdvanced && (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                                    <div>
                                        <label htmlFor="speakers" className={labelStyle}>Speakers (Name - Title, one per line)</label>
                                        <textarea id="speakers" value={speakersText} onChange={e => setSpeakersText(e.target.value)} rows={3} className={textareaStyle}></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="agenda" className={labelStyle}>Agenda (Time - Topic, one per line)</label>
                                        <textarea id="agenda" value={agendaText} onChange={e => setAgendaText(e.target.value)} rows={4} className={textareaStyle}></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="totalSlots" className={labelStyle}>Total Slots (Optional, leave blank for unlimited)</label>
                                        <input type="number" id="totalSlots" value={totalSlots} onChange={e => setTotalSlots(e.target.value)} placeholder="e.g., 50" className={inputStyle} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-4">
                         <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Create Event</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateEvent;