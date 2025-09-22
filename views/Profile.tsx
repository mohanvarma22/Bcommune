import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

import ProfileHeader from '../components/profile/ProfileHeader';
import FeaturedProject from '../components/profile/FeaturedProject';
import ProjectsSection from '../components/profile/ProjectsSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import SkillsSection from '../components/profile/SkillsSection';
import EducationSection from '../components/profile/EducationSection';
import LanguagesSection from '../components/profile/LanguagesSection';
import CertificationsSection from '../components/profile/CertificationsSection';
import UserStoriesSection from '../components/profile/UserStoriesSection';
import MyVenturesTab from '../components/profile/MyVenturesTab';

type ProfileTab = 'overview' | 'ventures';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { users, stories, currentUser, ventures } = useContext(DataContext);
  
  const user = users.find(u => u.id === userId);
  const isOwner = currentUser?.id === user?.id;
  
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  useEffect(() => {
    if (location.state?.openVenturesTab && isOwner) {
      setActiveTab('ventures');
    }
  }, [location.state, isOwner]);

  const { featuredProject, otherProjects } = useMemo(() => {
    const featured = user?.portfolio.find(p => p.isFeatured);
    const others = user?.portfolio.filter(p => !p.isFeatured) || [];
    return { featuredProject: featured, otherProjects: others };
  }, [user]);

  const userStories = useMemo(() => {
    if (!user) return [];
    return stories.filter(s => s.authorId === user.id);
  }, [stories, user]);
  
  const userVentures = useMemo(() => {
    if (!user) return [];
    return ventures.filter(v => v.ownerId === user.id);
  }, [ventures, user]);

  const hasProjects = user?.portfolio.length ?? 0 > 0;

  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  const TabButton: React.FC<{ tabName: ProfileTab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <ProfileHeader user={user} />

      {isOwner && (
        <div className="my-6 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 w-full max-w-xs">
          <TabButton tabName="overview" label="Overview" />
          <TabButton tabName="ventures" label="My Ventures" />
        </div>
      )}

      {(!isOwner || activeTab === 'overview') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
          <div className="lg:col-span-2 space-y-8">
            {hasProjects ? (
              <>
                {featuredProject && <FeaturedProject project={featuredProject} user={user} />}
                {otherProjects.length > 0 && <ProjectsSection projects={otherProjects} user={user} />}
              </>
            ) : (
              userStories.length > 0 && <UserStoriesSection stories={userStories} />
            )}
            <ExperienceSection experiences={user.experience} user={user} />
          </div>
          
          <aside className="lg:col-span-1 space-y-6 sticky top-24">
            <SkillsSection skills={user.skills} user={user} />
            <EducationSection education={user.education} user={user} />
            <CertificationsSection certifications={user.certifications} user={user} />
            <LanguagesSection languages={user.languages} user={user} />
          </aside>
        </div>
      )}

      {isOwner && activeTab === 'ventures' && (
        <div className="mt-8">
          <MyVenturesTab ventures={userVentures} />
        </div>
      )}
    </div>
  );
};

export default Profile;