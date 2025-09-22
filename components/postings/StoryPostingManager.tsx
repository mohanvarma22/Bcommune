import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Story } from '../../types';
import { DataContext } from '../../context/DataContext';
import StoryCard from '../stories/StoryCard';
import { EllipsisVerticalIcon } from '../common/Icons';

interface StoryPostingManagerProps {
    stories: Story[];
}

const StoryPostingManager: React.FC<StoryPostingManagerProps> = ({ stories }) => {
    const { updateStoryStatus, deleteStory } = useContext(DataContext);
    const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const handleToggleExpand = (storyId: string) => {
        setExpandedStoryId(prevId => (prevId === storyId ? null : storyId));
    };

    const handleDelete = (storyId: string) => {
        if (window.confirm("Are you sure you want to permanently delete this story? This action cannot be undone.")) {
            deleteStory(storyId);
        }
        setOpenMenuId(null);
    }

    if (stories.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-slate-700">No Stories Published</h3>
                <p className="text-slate-500 mt-2">Share your journey or insights with the community.</p>
                <Link to="/create/story" className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                    Share a Story
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {stories.map(story => {
                const isArchived = story.status === 'Archived';
                return (
                    <div key={story.id} className={isArchived ? 'opacity-60' : ''}>
                        <StoryCard
                            story={story}
                            isExpanded={expandedStoryId === story.id}
                            onToggleExpand={() => handleToggleExpand(story.id)}
                        />
                         <div className="-mt-1 bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl p-3 flex justify-between items-center">
                             {isArchived && <span className="text-sm font-semibold text-slate-500">Archived</span>}
                             {!isArchived && <div></div>}
                            <div className="relative" ref={openMenuId === story.id ? menuRef : null}>
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === story.id ? null : story.id)}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                                >
                                    <EllipsisVerticalIcon />
                                </button>
                                {openMenuId === story.id && (
                                    <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                                        <button onClick={() => { alert('Edit not implemented'); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                                        <button 
                                            onClick={() => { updateStoryStatus(story.id, isArchived ? 'Published' : 'Archived'); setOpenMenuId(null); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            {isArchived ? 'Unarchive' : 'Archive'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story.id)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StoryPostingManager;