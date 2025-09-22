import React, { useState, useContext, useEffect } from 'react';
import type { Job, User } from '../../types';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import { Link } from 'react-router-dom';
import { LikeIcon, CommentIcon, ShareIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import ShareDropdown from '../common/ShareDropdown';
import ShareViaMessageModal from '../common/ShareViaMessageModal';
import CommentSection from '../common/CommentSection';
import ApplyConfirmModal from './ApplyConfirmModal';
import InterviewProcessSection from './InterviewProcessSection';
import AIFitAnalyzer from './AIFitAnalyzer';

interface JobCardProps {
  job: Job;
  isExpanded: boolean;
  onToggleExpand: () => void;
  children?: React.ReactNode;
}

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors duration-200">
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const DetailSection: React.FC<{title: string, items: string[], className?: string}> = ({title, items, className = ''}) => {
    if (!items || items.length === 0) return null;
    return (
        <div className={className}>
            <h4 className="text-md font-semibold text-slate-800 mb-2">{title}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );
};


const JobCard: React.FC<JobCardProps> = ({ job, isExpanded, onToggleExpand, children }) => {
  // FIX: Destructure companies from DataContext.
  const { users, companies, likeItem, currentUser, applyForJob } = useContext(DataContext);
  // FIX: Find the company using the job's companyId.
  const company = companies.find(c => c.id === job.companyId);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const shareButtonRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isExpanded) {
        setShowComments(false);
    }
  }, [isExpanded]);

  const handleShareViaMessage = () => {
    setIsShareOpen(false);
    setIsShareModalOpen(true);
  };

  const hasApplied = currentUser ? job.applicantDetails.some(ad => ad.userId === currentUser.id) : false;
  const isOwner = currentUser?.id === job.posterId;
  if (!company || !currentUser) return null; // Or a loading/error state

  return (
    <>
        <Card className="hover:border-blue-500/50 transition-colors duration-300">
            <div className="p-6 cursor-pointer" onClick={onToggleExpand}>
                <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                        {job.title}
                    </h3>
                    <p className="text-md font-medium text-slate-800">{company.name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        {job.location} &middot; {job.type}
                        {job.experienceLevel && ` ・ ${job.experienceLevel}`}
                        {job.salaryRange && ` ・ ${job.salaryRange}`}
                    </p>
                </div>
                {company && (
                    <Link to={`/company/${company.id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Avatar src={company.logoUrl} alt={company.name} size="md" />
                    </Link>
                )}
                </div>
                
                {isExpanded ? (
                    <div onClick={(e) => e.stopPropagation()}>
                        <div className="mt-4 space-y-4">
                            {company.vision && <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-md border border-slate-200 italic">"{company.vision}"</p>}
                             <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {job.description}
                            </p>
                            <DetailSection title="Responsibilities" items={job.responsibilities ?? []} />
                            <DetailSection title="Qualifications" items={job.qualifications ?? []} />
                            <DetailSection title="Benefits & Perks" items={job.benefits ?? []} />
                            <InterviewProcessSection rounds={job.interviewRounds ?? []} />
                        </div>
                       
                        <div className="mt-4 flex flex-wrap gap-2">
                            {job.skills.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {skill}
                                </span>
                            ))}
                        </div>
                        {!isOwner && (
                            <div className="mt-6 text-center">
                                <AIFitAnalyzer job={job} user={currentUser} />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsApplyModalOpen(true); }}
                                    disabled={hasApplied}
                                    className="w-full sm:w-auto px-6 py-2.5 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                                >
                                    {hasApplied ? 'Applied' : 'Apply Now'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                        {job.description}
                    </p>
                )}

                {isExpanded && showComments && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <CommentSection itemId={job.id} itemType="job" comments={job.comments} />
                    </div>
                )}
            </div>
            <div className="border-t border-slate-200 px-6 py-3 flex items-center justify-between">
                <ActionButton icon={<LikeIcon />} label={job.likes.toLocaleString()} onClick={(e) => { e.stopPropagation(); likeItem(job.id, 'job'); }} />
                <ActionButton icon={<CommentIcon />} label={job.comments.length.toLocaleString()} onClick={(e) => { e.stopPropagation(); if(isExpanded) setShowComments(prev => !prev); else onToggleExpand(); }} />
                <div className="relative" ref={shareButtonRef}>
                    <ActionButton icon={<ShareIcon />} label="Share" onClick={(e) => { e.stopPropagation(); setIsShareOpen(prev => !prev); }} />
                    {isShareOpen && (
                        <ShareDropdown 
                            itemType="job"
                            itemId={job.id}
                            onClose={() => setIsShareOpen(false)} 
                            onShareViaMessage={handleShareViaMessage}
                            buttonRef={shareButtonRef}
                        />
                    )}
                </div>
            </div>
            {children}
        </Card>
        {isShareModalOpen && (
            <ShareViaMessageModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                itemType="job"
                itemId={job.id}
                itemTitle={job.title}
            />
        )}
        {isApplyModalOpen && (
            <ApplyConfirmModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                onConfirm={() => applyForJob(job.id)}
                jobTitle={job.title}
                companyName={company.name}
            />
        )}
    </>
  );
};

export default JobCard;