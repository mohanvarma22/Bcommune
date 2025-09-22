import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Notification } from '../../types';
import NotificationItem from './NotificationItem';
import { SettingsIcon } from '../common/Icons';

interface NotificationsDropdownProps {
    notifications: Notification[];
    onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ notifications, onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 dark:bg-slate-800 dark:border-slate-700 flex flex-col max-h-[80vh]">
            <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Notifications</h3>
                <Link to="/settings" onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <SettingsIcon />
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
                    ))
                ) : (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-12 px-4">You're all caught up!</p>
                )}
            </div>
            <div className="flex-shrink-0 p-2 text-center border-t border-slate-200 dark:border-slate-700">
                <Link to="#" onClick={onClose} className="text-sm font-semibold text-blue-600 hover:underline">
                    View All Notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationsDropdown;