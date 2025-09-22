import React, { useEffect, useRef, useState } from 'react';
import { MessagesIcon, CopyIcon } from './Icons';

interface ShareDropdownProps {
    itemType: 'job' | 'story';
    itemId: string;
    onClose: () => void;
    onShareViaMessage: () => void;
    buttonRef: React.RefObject<HTMLDivElement>;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({ itemType, itemId, onClose, onShareViaMessage, buttonRef }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [copyStatus, setCopyStatus] = useState<'Copy Link' | 'Copied!'>('Copy Link');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, buttonRef]);

    const handleCopyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#/${itemType}s/${itemId}`;
        navigator.clipboard.writeText(url);
        setCopyStatus('Copied!');
        setTimeout(() => {
            setCopyStatus('Copy Link');
            onClose();
        }, 1500);
    };

    return (
        <div 
            ref={dropdownRef}
            className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-20"
        >
            <div className="py-1">
                <button 
                    onClick={onShareViaMessage}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white"
                >
                    <MessagesIcon className="w-4 h-4" />
                    <span>Share via Message</span>
                </button>
                 <button 
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white"
                >
                    <CopyIcon />
                    <span>{copyStatus}</span>
                </button>
            </div>
        </div>
    );
};

export default ShareDropdown;