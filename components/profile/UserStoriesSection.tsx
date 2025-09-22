import React from 'react';
import type { Story } from '../../types';
import ProfileStoryCard from './ProfileStoryCard';

interface UserStoriesSectionProps {
    stories: Story[];
}

const UserStoriesSection: React.FC<UserStoriesSectionProps> = ({ stories }) => {
    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Stories &amp; Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map((story) => (
                    <ProfileStoryCard key={story.id} story={story} />
                ))}
            </div>
        </div>
    );
};

export default UserStoriesSection;