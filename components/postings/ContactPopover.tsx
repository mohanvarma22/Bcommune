import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../../types';
import { CopyIcon, EnvelopeIcon, PhoneIcon } from '../common/Icons';

interface ContactPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    position: { top: number; left: number };
}

const ContactPopover: React.FC<ContactPopoverProps> = ({ isOpen, onClose, user, position }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [emailStatus, setEmailStatus] = useState<'Copy' | 'Copied!'>('Copy');
    const [phoneStatus, setPhoneStatus] = useState<'Copy' | 'Copied!'>('Copy');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !user) return null;

    const handleCopy = (text: string, type: 'email' | 'phone') => {
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setEmailStatus('Copied!');
            setTimeout(() => setEmailStatus('Copy'), 1500);
        } else {
            setPhoneStatus('Copied!');
            setTimeout(() => setPhoneStatus('Copy'), 1500);
        }
    };

    return (
        <div
            ref={popoverRef}
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
            className="absolute z-40 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4"
        >
            <h4 className="font-bold text-slate-900 dark:text-slate-100">{user.name}</h4>
            <div className="mt-3 space-y-2">
                {user.email && (
                    <div className="flex items-center gap-2 text-sm">
                        <EnvelopeIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 dark:text-slate-300 flex-1 truncate">{user.email}</span>
                        <button onClick={() => handleCopy(user.email!, 'email')} className="text-xs font-semibold text-blue-600 hover:underline">{emailStatus}</button>
                    </div>
                )}
                {user.phone && (
                     <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 dark:text-slate-300 flex-1 truncate">{user.phone}</span>
                        <button onClick={() => handleCopy(user.phone!, 'phone')} className="text-xs font-semibold text-blue-600 hover:underline">{phoneStatus}</button>
                    </div>
                )}
                 {!user.email && !user.phone && (
                    <p className="text-sm text-slate-500">No contact information available.</p>
                 )}
            </div>
        </div>
    );
};

export default ContactPopover;