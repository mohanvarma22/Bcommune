import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import type { JobSlot } from '../../types';
import { CheckIcon } from '../common/Icons';

interface JobSlotCardProps {
    jobSlot: JobSlot;
    eventId: string;
}

const JobSlotCard: React.FC<JobSlotCardProps> = ({ jobSlot, eventId }) => {
    const { events, currentUser, expressInterestInWalkInRole } = useContext(DataContext);
    const event = events.find(e => e.id === eventId);
    
    const hasExpressedInterest = event?.interestedAttendees?.some(a => a.userId === currentUser?.id);
    const hasInterestInThisRole = event?.interestedAttendees?.some(a => a.userId === currentUser?.id && a.roleTitle === jobSlot.title);

    const handleInterest = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasExpressedInterest) {
            expressInterestInWalkInRole(eventId, jobSlot.title);
        }
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
                <h5 className="font-bold text-slate-900">{jobSlot.title}</h5>
                <p className="text-sm text-slate-600 mt-1">{jobSlot.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {jobSlot.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0">
                <button
                    onClick={handleInterest}
                    disabled={hasExpressedInterest}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                    {hasInterestInThisRole ? (
                        <>
                            <CheckIcon />
                            Interest Expressed
                        </>
                    ) : hasExpressedInterest ? (
                        'Applied for another role'
                    ) : (
                        "I'm Interested"
                    )}
                </button>
            </div>
        </div>
    );
};

export default JobSlotCard;
