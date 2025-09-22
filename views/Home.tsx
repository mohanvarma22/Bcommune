import React, { useMemo, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/jobs/JobCard';
import StoryCard from '../components/stories/StoryCard';
import { MOCK_SPOTLIGHT_STARTUP, MOCK_TRENDING_SKILLS } from '../constants';
import type { Job, Story } from '../types';
import StartupSpotlight from '../components/home/StartupSpotlight';
import TrendingSkills from '../components/home/TrendingSkills';
import UpcomingEvents from '../components/home/UpcomingEvents';
import { DataContext } from '../context/DataContext';
import CreatePostWidget from '../components/common/CreatePostWidget';

type FeedItem = (Job & { itemType: 'job' }) | (Story & { itemType: 'story' });

const Home: React.FC = () => {
    const [searchParams] = useSearchParams();
    // FIX: Destructure companies from DataContext.
    const { jobs, stories, events, companies } = useContext(DataContext);
    const query = searchParams.get('q');
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const handleToggleExpand = (itemId: string) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };
    
    const mixedFeed = useMemo(() => {
        const jobsWithType: FeedItem[] = jobs.map(j => ({ ...j, itemType: 'job' }));
        const storiesWithType: FeedItem[] = stories.map(s => ({ ...s, itemType: 'story' }));
        
        const feed: FeedItem[] = [];
        let jobIndex = 0;
        let storyIndex = 0;
        const totalLength = jobsWithType.length + storiesWithType.length;

        for (let i = 0; i < totalLength; i++) {
             // Add a story every 3 items, if stories are available
            if (i > 0 && i % 4 === 0 && storyIndex < storiesWithType.length) {
                feed.push(storiesWithType[storyIndex++]);
            } else if (jobIndex < jobsWithType.length) {
                feed.push(jobsWithType[jobIndex++]);
            } else if (storyIndex < storiesWithType.length) {
                // Add remaining stories if jobs run out
                feed.push(storiesWithType[storyIndex++]);
            }
        }
        return feed.reverse(); // Show newest items first
    }, [jobs, stories]);

    const searchResults = useMemo(() => {
        if (!query) {
            return null;
        }
        const lowerCaseQuery = query.toLowerCase();
        return jobs.filter(job => {
            // FIX: Find the company by ID to search by its name.
            const company = companies.find(c => c.id === job.companyId);
            return (
                job.title.toLowerCase().includes(lowerCaseQuery) ||
                (company && company.name.toLowerCase().includes(lowerCaseQuery)) ||
                job.description.toLowerCase().includes(lowerCaseQuery) ||
                job.skills.some(skill => skill.toLowerCase().includes(lowerCaseQuery))
            )
        });
    }, [query, jobs, companies]);

    const renderFeedContent = () => {
        if (query) { 
            return searchResults && searchResults.length > 0 ? (
                <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 dark:text-slate-100">Search Results for "{query}"</h2>
                    <div className="space-y-6">
                        {searchResults.map(job => {
                            const uniqueId = `job-${job.id}`;
                            return <JobCard key={uniqueId} job={job} isExpanded={expandedItemId === uniqueId} onToggleExpand={() => handleToggleExpand(uniqueId)} />;
                        })}
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No jobs found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search query.</p>
                </div>
            );
        }
        
        return (
            <>
                <CreatePostWidget />
                {mixedFeed.map(item => {
                    const uniqueId = `${item.itemType}-${item.id}`;
                    return item.itemType === 'job'
                        ? <JobCard key={uniqueId} job={item} isExpanded={expandedItemId === uniqueId} onToggleExpand={() => handleToggleExpand(uniqueId)} />
                        : <StoryCard key={uniqueId} story={item} isExpanded={expandedItemId === uniqueId} onToggleExpand={() => handleToggleExpand(uniqueId)} />
                })}
            </>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                     {!query && (
                        <StartupSpotlight startup={MOCK_SPOTLIGHT_STARTUP} />
                    )}
                    {renderFeedContent()}
                </div>
                
                <aside className="lg:col-span-1 space-y-6 hidden lg:block sticky top-24">
                    <TrendingSkills skills={MOCK_TRENDING_SKILLS} />
                    <UpcomingEvents events={events.slice(0,3)} />
                </aside>
            </div>
        </div>
    );
};

export default Home;