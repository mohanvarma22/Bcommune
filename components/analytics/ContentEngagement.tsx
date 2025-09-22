import React from 'react';
import Card from '../common/Card';
import type { Story } from '../../types';
import { Link } from 'react-router-dom';

interface ContentEngagementProps {
    stories: Story[];
}

const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
};

const ContentEngagement: React.FC<ContentEngagementProps> = ({ stories }) => {
    return (
        <Card>
            <div className="p-5 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Content Engagement</h3>
                <p className="text-sm text-slate-500">Measure the impact of your stories.</p>
            </div>
            <div className="divide-y divide-slate-200">
                {stories.length > 0 ? stories.map(story => {
                    const views = simpleHash(story.id) % 2000 + 500;
                    const clicksToJobs = Math.floor(views * (simpleHash(story.title) % 10 + 2) / 100);

                    return (
                        <div key={story.id} className="p-5 grid grid-cols-3 gap-4 items-center">
                            <div className="col-span-2">
                                <Link to={`/stories/${story.id}`} className="font-semibold text-slate-800 hover:underline truncate block">
                                    {story.title}
                                </Link>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-slate-900">{views.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Views</p>
                            </div>
                        </div>
                    );
                }) : (
                     <p className="p-8 text-center text-slate-500">You haven't published any stories yet.</p>
                )}
            </div>
        </Card>
    );
};

export default ContentEngagement;