import React, { useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';

const EngagedReadersSection: React.FC<{ userIds: string[] }> = ({ userIds }) => {
    const { users } = useContext(DataContext);
    const readers = users.filter(u => userIds.includes(u.id));

    return (
        <Card className="mt-8">
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Engaged Readers ({readers.length})</h3>
                <div className="space-y-4">
                    {readers.length > 0 ? readers.map(reader => (
                        <Link key={reader.id} to={`/profile/${reader.id}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
                            <Avatar src={reader.avatarUrl} alt={reader.name} size="md" />
                            <div>
                                <p className="font-semibold text-slate-800">{reader.name}</p>
                                <p className="text-sm text-slate-500">{reader.title}</p>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-slate-500">No readers have engaged yet.</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

const StoryDetail: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const { stories, users, currentUser } = useContext(DataContext);

    const story = stories.find(s => s.id === storyId);

    if (!story) {
        return <Navigate to="/feed" replace />;
    }

    const author = users.find(u => u.id === story.authorId);
    const isOwner = currentUser?.id === story.authorId;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    {story.category && <span className="font-semibold text-blue-600 tracking-wide">{story.category.toUpperCase()}</span>}
                    {story.readingTime && <span>&middot; {story.readingTime} MINUTE READ</span>}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{story.title}</h1>
                {author && (
                    <Link to={`/profile/${author.id}`} className="flex items-center gap-4 mt-6 group">
                        <Avatar src={author.avatarUrl} alt={author.name} size="lg" />
                        <div>
                            <p className="font-semibold text-lg text-slate-800 group-hover:underline">{author.name}</p>
                            <p className="text-md text-slate-500">{author.title}</p>
                        </div>
                    </Link>
                )}
            </div>

            <img src={story.imageUrl} alt={story.title} className="w-full h-auto max-h-96 object-cover rounded-xl mb-8" />
            
            <div className="prose prose-lg max-w-none text-slate-600">
                <p className="lead italic text-slate-500">{story.excerpt}</p>
                <hr className="border-slate-200 my-8" />
                <p style={{ whiteSpace: 'pre-wrap' }}>{story.content}</p>
            </div>

             {story.tags && story.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                    {story.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}


            {isOwner && <EngagedReadersSection userIds={story.engagements} />}
        </div>
    );
};

export default StoryDetail;