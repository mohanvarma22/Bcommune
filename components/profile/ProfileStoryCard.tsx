import React from 'react';
import { Link } from 'react-router-dom';
import type { Story } from '../../types';
import Card from '../common/Card';

interface ProfileStoryCardProps {
    story: Story;
}

const ProfileStoryCard: React.FC<ProfileStoryCardProps> = ({ story }) => {
    return (
        <Link to={`/stories/${story.id}`} className="block group">
            <Card className="h-full overflow-hidden hover:border-blue-500/50 transition-colors duration-300">
                <div className="aspect-video overflow-hidden">
                    <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                    <h4 className="font-bold text-slate-800 truncate">{story.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{story.excerpt}</p>
                </div>
            </Card>
        </Link>
    );
};

export default ProfileStoryCard;