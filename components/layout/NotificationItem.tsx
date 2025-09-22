import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import type { Notification } from '../../types';
import Avatar from '../common/Avatar';

interface NotificationItemProps {
    notification: Notification;
    onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
    const { users, jobs, stories, ventures } = useContext(DataContext);
    const actor = users.find(u => u.id === notification.actorId);

    if (!actor) return null;

    let message = '';
    let link = '/feed';

    switch (notification.type) {
        case 'APPLICATION':
            const job = jobs.find(j => j.id === notification.targetId);
            message = `applied for your job: ${job?.title || 'a position'}`;
            link = `/my-activity/job/${notification.targetId}/applicants`;
            break;
        case 'COMMENT':
            const story = stories.find(s => s.id === notification.targetId);
            message = `commented on your story: "${story?.title || 'your post'}"`;
            link = `/stories/${notification.targetId}`;
            break;
        case 'INTEREST':
             const venture = ventures.find(v => v.id === notification.targetId);
             message = `is intrigued by your venture: ${venture?.name || 'your venture'}`;
             link = `/ventures/${notification.targetId}`;
             break;
        case 'MATCH':
             const matchedVenture = ventures.find(v => v.id === notification.targetId);
             message = `You have a new match for ${matchedVenture?.name || 'your venture'}!`;
             link = `/messages`;
             break;
        case 'RSVP':
            message = `RSVP'd to your event.`;
            link = `/events/${notification.targetId}`;
            break;
        case 'MESSAGE':
            message = `sent you a new message.`;
            link = `/messages/${notification.targetId}`;
            break;
        default:
            message = 'has a new update for you.';
    }

    return (
        <Link 
            to={link} 
            onClick={onClose}
            className="block p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                    <Avatar src={actor.avatarUrl} alt={actor.name} size="md" />
                    {!notification.isRead && (
                        <span className="absolute -top-0.5 -left-0.5 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-800" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{actor.name}</span> {message}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.timestamp}</p>
                </div>
            </div>
        </Link>
    );
};

export default NotificationItem;