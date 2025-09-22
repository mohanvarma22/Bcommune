import React from 'react';
import type { User } from '../../types';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { CloseIcon } from '../common/Icons';

import ProfileHeader from '../profile/ProfileHeader';
import FeaturedProject from '../profile/FeaturedProject';
import ProjectsSection from '../profile/ProjectsSection';
import ExperienceSection from '../profile/ExperienceSection';
import SkillsSection from '../profile/SkillsSection';
import EducationSection from '../profile/EducationSection';
import LanguagesSection from '../profile/LanguagesSection';
import CertificationsSection from '../profile/CertificationsSection';

interface ApplicantProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const ApplicantProfileModal: React.FC<ApplicantProfileModalProps> = ({ isOpen, onClose, user }) => {
    if (!user) return null;
    
    const featuredProject = user.portfolio.find(p => p.isFeatured);
    const otherProjects = user.portfolio.filter(p => !p.isFeatured);
    const hasProjects = user.portfolio.length > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
            <Card className="max-h-[90vh] flex flex-col dark:bg-slate-800">
                <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Applicant Digital Passport
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <ProfileHeader user={user} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
                        <div className="lg:col-span-2 space-y-8">
                             {hasProjects && (
                                <>
                                    {featuredProject && <FeaturedProject project={featuredProject} user={user} />}
                                    {otherProjects.length > 0 && <ProjectsSection projects={otherProjects} user={user} />}
                                </>
                            )}
                            <ExperienceSection experiences={user.experience} user={user} />
                        </div>
                        <aside className="lg:col-span-1 space-y-6 sticky top-6">
                            <SkillsSection skills={user.skills} user={user} />
                            <EducationSection education={user.education} user={user} />
                            <CertificationsSection certifications={user.certifications} user={user} />
                            <LanguagesSection languages={user.languages} user={user} />
                        </aside>
                    </div>
                </div>
            </Card>
        </Modal>
    );
};

export default ApplicantProfileModal;