import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Signal, Venture, Feedback } from '../../types';
import { DataContext } from '../../context/DataContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { PollIcon, QuestionIcon, SignalIcon, LikeIcon, CommentIcon } from '../common/Icons';
import CommentSection from '../common/CommentSection';
import FeedbackForm from './FeedbackForm';
import FeedbackCard from './FeedbackCard';

interface SignalCardProps {
    signal: Signal;
    venture: Venture;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void, active?: boolean }> = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className={`flex items-center gap-2 transition-colors duration-200 ${active ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const PollSection: React.FC<{ signal: Signal }> = ({ signal }) => {
    const { voteOnSignalPoll, currentUser } = useContext(DataContext);
    const totalVotes = signal.pollOptions?.reduce((sum, opt) => sum + opt.votes.length, 0) || 0;
    const userVoteIndex = signal.pollOptions?.findIndex(opt => opt.votes.includes(currentUser?.id || '')) ?? -1;
    
    return (
        <div className="mt-4 space-y-2">
            {signal.pollOptions?.map((option, index) => {
                const voteCount = option.votes.length;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isVoted = userVoteIndex === index;

                return (
                    <button 
                        key={index} 
                        onClick={(e) => { e.stopPropagation(); voteOnSignalPoll(signal.id, index); }}
                        className={`w-full text-left p-2 border-2 rounded-lg transition ${isVoted ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-center text-sm font-semibold mb-1">
                            <span className="text-slate-800 dark:text-slate-200">{option.text}</span>
                            <span className="text-slate-600 dark:text-slate-400">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};


const SignalCard: React.FC<SignalCardProps> = ({ signal, venture, isExpanded, onToggleExpand }) => {
    const { users, currentUser, likeSignal } = useContext(DataContext);
    const [showCommentsOrFeedback, setShowCommentsOrFeedback] = useState(false);
    const author = users.find(u => u.id === signal.authorId);
    
    useEffect(() => {
        if (!isExpanded) {
            setShowCommentsOrFeedback(false);
        }
    }, [isExpanded]);

    const isLiked = currentUser ? signal.likes.includes(currentUser.id) : false;
    const isOwner = currentUser?.id === signal.authorId;
    const userFeedback = signal.type === 'question' && currentUser ? signal.feedback?.find(f => f.authorId === currentUser.id) : undefined;

    const SignalHeaderIcon = {
        poll: <PollIcon />,
        question: <QuestionIcon />,
        update: <SignalIcon />,
    }[signal.type];

    const SignalHeaderText = {
        poll: 'asked a question',
        question: 'is looking for feedback',
        update: 'posted an update',
    }[signal.type];

    const renderExpandedContent = () => {
        if (!showCommentsOrFeedback) return null;

        if (signal.type === 'question') {
            if (isOwner) {
                return (
                    <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 px-5 pb-2 space-y-4">
                        <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100">Feedback Received ({signal.feedback?.length || 0})</h4>
                        {(signal.feedback && signal.feedback.length > 0) ? (
                             signal.feedback.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)
                        ) : (
                            <p className="text-sm text-center text-slate-500 py-4">No feedback received yet.</p>
                        )}
                    </div>
                );
            }
            if (userFeedback) {
                return (
                     <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 px-5 pb-2">
                        <FeedbackCard feedback={userFeedback} isOwnFeedback={true} />
                     </div>
                );
            }
            return <FeedbackForm signalId={signal.id} onFeedbackSubmitted={() => setShowCommentsOrFeedback(false)} />;
        }
        
        // Fallback for 'poll' and 'update'
        return <CommentSection itemId={signal.id} itemType="signal" comments={signal.comments} />;
    };

    return (
        <Card>
            <div className="p-5 cursor-pointer" onClick={onToggleExpand}>
                <div className="flex items-center gap-3">
                    <Link to={`/ventures/${venture.id}`} onClick={e => e.stopPropagation()}>
                        <Avatar src={venture.logoUrl} alt={venture.name} size="md" />
                    </Link>
                    <div>
                        <Link to={`/ventures/${venture.id}`} className="font-bold text-slate-800 dark:text-slate-200 hover:underline" onClick={e => e.stopPropagation()}>
                            {venture.name}
                        </Link>
                        {author && (
                             <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                {SignalHeaderIcon}
                                <span>{SignalHeaderText} &middot; {signal.timestamp}</span>
                            </p>
                        )}
                    </div>
                </div>

                <p className="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{signal.content}</p>
                
                {signal.type === 'poll' && <PollSection signal={signal} />}
            </div>

            {isExpanded && (
                <div onClick={(e) => e.stopPropagation()}>
                    {renderExpandedContent()}
                </div>
            )}

            <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-3 flex items-center justify-between">
                <ActionButton 
                    icon={<LikeIcon />} 
                    label={signal.likes.length.toLocaleString()} 
                    active={isLiked}
                    onClick={(e) => { e.stopPropagation(); likeSignal(signal.id); }} 
                />
                 {signal.type === 'question' ? (
                    <ActionButton 
                        icon={<CommentIcon />} 
                        label={`Feedback (${signal.feedback?.length || 0})`}
                        onClick={(e) => { e.stopPropagation(); if(isExpanded) setShowCommentsOrFeedback(p => !p); else onToggleExpand(); }} 
                    />
                ) : (
                    <ActionButton 
                        icon={<CommentIcon />} 
                        label={signal.comments.length.toLocaleString()} 
                        onClick={(e) => { e.stopPropagation(); if(isExpanded) setShowCommentsOrFeedback(p => !p); else onToggleExpand(); }} 
                    />
                )}
            </div>
        </Card>
    );
};

export default SignalCard;
