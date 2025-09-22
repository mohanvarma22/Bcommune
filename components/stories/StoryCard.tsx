import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Story, User } from '../../types';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import { LikeIcon, CommentIcon, ShareIcon } from '../common/Icons';
import { DataContext } from '../../context/DataContext';
import ShareDropdown from '../common/ShareDropdown';
import ShareViaMessageModal from '../common/ShareViaMessageModal';
import CommentSection from '../common/CommentSection';

interface StoryCardProps {
  story: Story;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors duration-200">
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const StoryCard: React.FC<StoryCardProps> = ({ story, isExpanded, onToggleExpand }) => {
  const { users, likeItem } = useContext(DataContext);
  const author = users.find(u => u.id === story.authorId);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
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

  if (!author) {
    return null;
  }

  return (
    <>
        <Card className="overflow-hidden hover:border-blue-500/50 transition-colors duration-300 flex flex-col">
            {/* Author Header */}
            <div className="p-4 flex items-center gap-3">
                <Link to={`/profile/${author.id}`}>
                    <Avatar src={author.avatarUrl} alt={author.name} size="md" />
                </Link>
                <div>
                    <Link to={`/profile/${author.id}`} className="hover:underline">
                        <p className="font-semibold text-slate-800">{author.name}</p>
                    </Link>
                    <p className="text-sm text-slate-500">{author.title}</p>
                </div>
            </div>
            
            {/* Image */}
            <div className="cursor-pointer bg-slate-200" onClick={onToggleExpand}>
                <img src={story.imageUrl} alt={story.title} className="w-full h-auto object-cover" />
            </div>

            {/* Actions & Content */}
            <div className="p-4">
                 <div className="flex items-center gap-4">
                    <ActionButton icon={<LikeIcon />} label={story.likes.toLocaleString()} onClick={(e) => { e.stopPropagation(); likeItem(story.id, 'story')}} />
                    <ActionButton icon={<CommentIcon />} label={story.comments.length.toLocaleString()} onClick={(e) => { e.stopPropagation(); if(!isExpanded) onToggleExpand(); setShowComments(p => !p); }} />
                    <div className="relative" ref={shareButtonRef}>
                        <ActionButton icon={<ShareIcon />} label={story.shares.toLocaleString()} onClick={(e) => { e.stopPropagation(); setIsShareOpen(prev => !prev)}} />
                        {isShareOpen && (
                            <ShareDropdown 
                                itemType="story"
                                itemId={story.id}
                                onClose={() => setIsShareOpen(false)} 
                                onShareViaMessage={handleShareViaMessage}
                                buttonRef={shareButtonRef}
                            />
                        )}
                    </div>
                </div>

                {/* Likes count */}
                <p className="font-semibold text-sm mt-3 text-slate-800">{story.likes.toLocaleString()} likes</p>

                {/* Caption */}
                <div className="mt-2 text-sm text-slate-700 cursor-pointer" onClick={onToggleExpand}>
                    <p className={isExpanded ? '' : 'line-clamp-2'}>
                        <Link to={`/profile/${author.id}`} onClick={e => e.stopPropagation()} className="font-semibold text-slate-900 hover:underline">{author.name}</Link>
                        <span className="font-bold"> {story.title}</span>
                        <span className="ml-2">{isExpanded ? story.content : story.excerpt}</span>
                    </p>
                    {!isExpanded && (story.content.length > 150) && ( // Simple check for expandability
                        <button onClick={onToggleExpand} className="text-slate-500 text-sm font-medium">more</button>
                    )}
                </div>

                {/* View comments link */}
                {story.comments.length > 0 && (
                     <button onClick={(e) => { e.stopPropagation(); if(!isExpanded) onToggleExpand(); setShowComments(p => !p); }} className="text-sm text-slate-500 mt-2">
                        View all {story.comments.length} comments
                    </button>
                )}
            </div>

            {isExpanded && showComments && (
                <div onClick={e => e.stopPropagation()}>
                    <CommentSection itemId={story.id} itemType="story" comments={story.comments} />
                </div>
            )}
        </Card>
        {isShareModalOpen && (
            <ShareViaMessageModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                itemType="story"
                itemId={story.id}
                itemTitle={story.title}
            />
        )}
    </>
  );
};

export default StoryCard;