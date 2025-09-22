import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../../types';
import { DataContext } from '../../context/DataContext';
import Avatar from './Avatar';

interface CommentSectionProps {
    itemId: string;
    itemType: 'job' | 'story' | 'signal';
    comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ itemId, itemType, comments }) => {
    const { users, currentUser, addComment } = useContext(DataContext);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(itemId, itemType, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="border-t border-slate-200 mt-6 pt-4 px-6 pb-2">
            <h4 className="text-md font-semibold text-slate-800 mb-4">Comments ({comments.length})</h4>
            <div className="space-y-4">
                {/* Add Comment Form */}
                {currentUser && (
                     <form onSubmit={handleSubmit} className="flex items-start gap-3">
                        <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
                        <div className="flex-1">
                             <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={2}
                                className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
                            />
                            <div className="flex justify-end mt-2">
                                <button type="submit" disabled={!newComment.trim()} className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed">
                                    Post
                                </button>
                            </div>
                        </div>
                    </form>
                )}
               
                {/* Existing Comments */}
                {comments.map(comment => {
                    const author = users.find(u => u.id === comment.authorId);
                    if (!author) return null;
                    return (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Link to={`/profile/${author.id}`}>
                                <Avatar src={author.avatarUrl} alt={author.name} size="md" />
                            </Link>
                            <div className="flex-1 bg-slate-100 rounded-lg p-3">
                                <div className="flex items-baseline gap-2">
                                    <Link to={`/profile/${author.id}`} className="font-semibold text-sm text-slate-800 hover:underline">
                                        {author.name}
                                    </Link>
                                    <span className="text-xs text-slate-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{comment.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommentSection;