import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import { MessagesIcon, NotificationIcon, SearchIcon, PlusIcon, AIIcon, NetworkIcon } from '../common/Icons';
import ProfileSwitcher from './ProfileSwitcher';
import type { Company, User } from '../../types';
import NotificationsDropdown from './NotificationsDropdown';


const CreateDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { activeProfile } = useContext(DataContext);

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
        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50 dark:bg-slate-800 dark:border-slate-700">
            <div className="py-1">
                <Link to="/create/company" onClick={onClose} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white dark:text-slate-300 dark:hover:bg-blue-600">Create a Company</Link>
                <Link to="/create/venture" onClick={onClose} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white dark:text-slate-300 dark:hover:bg-blue-600">Create a Venture</Link>
                {activeProfile.type === 'company' && (
                    <Link to="/create/job" onClick={onClose} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white dark:text-slate-300 dark:hover:bg-blue-600">Post a Job</Link>
                )}
                <Link to="/create/event" onClick={onClose} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white dark:text-slate-300 dark:hover:bg-blue-600">Create Event</Link>
                <Link to="/create/story" onClick={onClose} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-500 hover:text-white dark:text-slate-300 dark:hover:bg-blue-600">Share a Story</Link>
            </div>
        </div>
    );
};

interface HeaderProps {
    isAiMode: boolean;
    setIsAiMode: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const Header: React.FC<HeaderProps> = ({ isAiMode, setIsAiMode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { activeProfile, companies, currentUser, notifications, markNotificationsAsRead } = useContext(DataContext);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchTerm.trim();
    if (trimmedQuery) {
      navigate(`/feed?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate('/feed');
    }
  };

  const toggleAiMode = () => {
    setIsAiMode(prev => !prev);
    if (searchParams.get('q')) {
        navigate('/feed');
    }
  }
  
  const activeEntity = activeProfile.type === 'company' 
    ? companies.find(c => c.id === activeProfile.id)
    : currentUser;

  const homeLink = activeProfile.type === 'company' ? `/company/${activeProfile.id}/dashboard` : '/feed';
  
  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(prev => {
        if (!prev) { // If we are about to open it
            markNotificationsAsRead();
        }
        return !prev;
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-40 flex items-center justify-between px-6 dark:bg-slate-900/80 dark:border-slate-700">
        {/* Left Side: Logo */}
        <div className="flex-shrink-0">
             <Link to={homeLink} className="flex items-center gap-3">
                <span className="font-warnes text-2xl text-slate-900 tracking-wide hidden md:block dark:text-slate-100 font-bold">Bcommune</span>
            </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-4">
            {!isAiMode ? (
                <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for jobs or talent..."
                            className="w-full pl-10 pr-20 py-2 bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-800 placeholder-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-900"
                        />
                         <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                             <button
                                type="button"
                                onClick={toggleAiMode}
                                title="Toggle AI Search"
                                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-colors bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                            >
                                <AIIcon className="w-4 h-4" />
                                AI
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                 <button
                    onClick={toggleAiMode}
                    title="Exit AI Search"
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white"
                >
                    <AIIcon className="w-5 h-5" />
                    <span>Exit AI Mode</span>
                </button>
            )}
        </div>

        {/* Right Side: User Actions */}
        <div className="flex-shrink-0 flex justify-end items-center gap-2 sm:gap-4">
             <div className="relative">
                <button
                    onClick={() => setIsCreateOpen(prev => !prev)}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon />
                    <span className="hidden sm:inline">Create</span>
                </button>
                {isCreateOpen && <CreateDropdown onClose={() => setIsCreateOpen(false)} />}
            </div>
             <Link to="/connections" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <NetworkIcon />
            </Link>
             <Link to="/messages" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <MessagesIcon />
            </Link>
             <div className="relative">
                <button 
                    onClick={handleNotificationsToggle}
                    className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                    <NotificationIcon />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </button>
                {isNotificationsOpen && <NotificationsDropdown notifications={notifications} onClose={() => setIsNotificationsOpen(false)} />}
            </div>
            {activeEntity && (
                <div className="relative ml-2 hidden sm:block">
                    <button onClick={() => setIsProfileSwitcherOpen(prev => !prev)}>
                        <Avatar 
                            src={activeProfile.type === 'company' ? (activeEntity as Company).logoUrl : (activeEntity as User).avatarUrl} 
                            alt={activeEntity.name} 
                            size="md" 
                        />
                    </button>
                    {isProfileSwitcherOpen && <ProfileSwitcher onClose={() => setIsProfileSwitcherOpen(false)} />}
                </div>
            )}
        </div>
    </header>
  );
};

export default Header;