import React, { useContext } from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import Avatar from '../common/Avatar';
// FIX: BriefcaseIcon is now available from Icons.tsx
import { AnalyticsIcon, SettingsIcon, LogoutIcon, FeedIcon, PostingsIcon, VentureIcon, BriefcaseIcon, UsersIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import type { Company, User } from '../../types';

// Icons for Company Workspace
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 15.75V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);
const ContentIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
);
const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M15 19.128a9.37 9.37 0 0 1-1.46-3.07M15 19.128L13.6 18.236A9.368 9.368 0 0 1 3 15.74V4.221c0-1.044.85-1.996 1.864-1.996h13.032c1.014 0 1.864.952 1.864 1.996v11.518a9.368 9.368 0 0 1-5.4 1.486L15 19.128Z" />
    </svg>
);


const Sidebar: React.FC = () => {
  const { currentUser, companies, activeProfile } = useContext(DataContext);
  const { companyId } = useParams<{ companyId?: string }>();

  const navLinkClasses = `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200`;
  const activeClass = 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400';

  if (activeProfile.type === 'company') {
    const company = companies.find(c => c.id === activeProfile.id);
    if (!company) return null; // Or some fallback

    return (
        <aside className="fixed left-0 h-full w-64 bg-white border-r border-slate-200 flex-col p-4 text-slate-800 z-30 hidden md:flex dark:bg-slate-900 dark:border-slate-700">
             <Link to={`/company/${company.id}/dashboard`} className="flex flex-col items-center text-center p-4 mb-4 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <Avatar src={company.logoUrl} alt={company.name || 'Profile'} size="lg" />
                <p className="font-bold text-lg mt-3 text-slate-900 dark:text-slate-100">{company.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{company.tagline}</p>
            </Link>
            <nav className="flex-1 flex flex-col gap-2">
                <NavLink to={`/company/${company.id}/dashboard`} end className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <DashboardIcon /> <span>Dashboard</span> </NavLink>
                <NavLink to={`/company/${company.id}/jobs`} className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <PostingsIcon /> <span>Jobs</span> </NavLink>
                <NavLink to={`/company/${company.id}/content`} className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <ContentIcon /> <span>Content</span> </NavLink>
                <NavLink to={`/company/${company.id}/analytics`} className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <AnalyticsIcon /> <span>Analytics</span> </NavLink>
                <NavLink to={`/company/${company.id}/team`} className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <TeamIcon /> <span>Team</span> </NavLink>
            </nav>
            <div className="mt-auto">
                <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <SettingsIcon /> <span>Settings</span> </NavLink>
                <Link to="/login" className={navLinkClasses}> <LogoutIcon /> <span>Logout</span> </Link>
            </div>
        </aside>
    );
  }

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  return (
    <aside className="fixed left-0 h-full w-64 bg-white border-r border-slate-200 flex-col p-4 text-slate-800 z-30 hidden md:flex dark:bg-slate-900 dark:border-slate-700">
        <Link to={`/profile/${currentUser.id}`} className="flex flex-col items-center text-center p-4 mb-4 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <Avatar src={currentUser.avatarUrl} alt={currentUser.name || 'Profile'} size="lg" />
            <p className="font-bold text-lg mt-3 truncate text-slate-900 dark:text-slate-100">{currentUser.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{currentUser.title}</p>
        </Link>
        {/* User Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
            <NavLink to="/feed" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <FeedIcon /> <span>Feed</span> </NavLink>
            <NavLink to="/opportunities" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <BriefcaseIcon /> <span>Opportunities</span> </NavLink>
            <NavLink to="/ventures" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <VentureIcon /> <span>Ventures</span> </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <AnalyticsIcon /> <span>Analytics</span> </NavLink>
            <NavLink to="/my-activity" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <PostingsIcon /> <span>My Activity</span> </NavLink>
        </nav>
        <div className="mt-auto">
            <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive && activeClass}`}> <SettingsIcon /> <span>Settings</span> </NavLink>
            <Link to="/login" className={navLinkClasses}> <LogoutIcon /> <span>Logout</span> </Link>
        </div>
    </aside>
  );
};

export default Sidebar;