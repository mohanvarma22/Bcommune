import React, { useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import { CheckIcon, LogoutIcon } from '../common/Icons';

interface ProfileSwitcherProps {
    onClose: () => void;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ onClose }) => {
    // FIX: Destructure missing properties from context.
    const { currentUser, companies, activeProfile, switchProfile } = useContext(DataContext);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!currentUser) return null;
    
    const managedCompanies = companies.filter(c => c.team.some(member => member.userId === currentUser.id));

    const handleSwitch = (type: 'user' | 'company', id: string) => {
        switchProfile(type, id);
        onClose();
        if (type === 'company') {
            navigate(`/company/${id}/dashboard`);
        } else {
            navigate('/feed');
        }
    };

    return (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-slate-200 z-50 dark:bg-slate-800 dark:border-slate-700">
            <div className="p-2">
                {/* Current User Profile */}
                <div className="flex items-center gap-3 p-2">
                    <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
                    <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-1">
                    <Link to={`/profile/${currentUser.id}`} onClick={onClose} className="flex-1 text-center px-2 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                        View Profile
                    </Link>
                    <button 
                        onClick={() => handleSwitch('user', currentUser.id)}
                        className="flex-1 px-2 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600"
                        disabled={activeProfile.type === 'user'}
                    >
                        {activeProfile.type === 'user' ? 'Active' : 'Select'}
                    </button>
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Managed Companies */}
            <div className="p-2">
                <p className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Switch Profile</p>
                <div className="max-h-40 overflow-y-auto space-y-1 mt-1">
                    {managedCompanies.map(company => (
                        <button key={company.id} onClick={() => handleSwitch('company', company.id)} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-left">
                            <Avatar src={company.logoUrl} alt={company.name} size="md" />
                            <div className="flex-1">
                                 <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{company.name}</p>
                            </div>
                            {activeProfile.type === 'company' && activeProfile.id === company.id && (
                                <CheckIcon />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />
            
            <div className="p-2">
                 <Link to="/create/company" onClick={onClose} className="block w-full text-center px-2 py-2 text-sm font-semibold text-blue-600 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    Create Company
                </Link>
            </div>
            
            <hr className="border-slate-200 dark:border-slate-700" />
            
            <div className="p-2">
                 <Link to="/login" onClick={onClose} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    <LogoutIcon />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default ProfileSwitcher;
