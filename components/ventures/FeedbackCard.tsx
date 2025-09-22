import React, { useContext } from 'react';
import type { Feedback } from '../../types';
import { DataContext } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';

interface FeedbackCardProps {
    feedback: Feedback;
    isOwnFeedback?: boolean;
}

const FeedbackPill: React.FC<{ type: 'Pros' | 'Cons' | 'Suggestion', content: string }> = ({ type, content }) => {
    if (!content) return null;
    
    const colorClasses = {
        Pros: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Cons: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        Suggestion: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    }[type];

    return (
        <div>
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${colorClasses}`}>{type}</span>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2">{content}</p>
        </div>
    );
};


const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, isOwnFeedback = false }) => {
    const { users } = useContext(DataContext);
    const author = users.find(u => u.id === feedback.authorId);
    
    if (!author) return null;

    return (
        <div className={`p-4 rounded-lg ${isOwnFeedback ? 'bg-blue-50 dark:bg-blue-900/50' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
            {!isOwnFeedback && (
                 <div className="flex items-center justify-between mb-3">
                    <Link to={`/profile/${author.id}`} className="flex items-center gap-2 group">
                        <Avatar src={author.avatarUrl} alt={author.name} size="sm" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:underline">{author.name}</span>
                    </Link>
                    <span className="text-xs text-slate-500">{feedback.timestamp}</span>
                </div>
            )}
            {isOwnFeedback && (
                 <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-3">Your Submitted Feedback</h4>
            )}
            <div className="space-y-3">
               <FeedbackPill type="Pros" content={feedback.pros} />
               <FeedbackPill type="Cons" content={feedback.cons} />
               <FeedbackPill type="Suggestion" content={feedback.suggestion} />
            </div>
        </div>
    );
};

export default FeedbackCard;
