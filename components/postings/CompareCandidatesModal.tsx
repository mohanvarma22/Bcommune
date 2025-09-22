import React from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import type { AIComparisonAnalysis, User } from '../../types';
import { CloseIcon, SparklesIcon } from '../common/Icons';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';

interface CompareCandidatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: AIComparisonAnalysis | null;
    candidates: User[];
    isLoading: boolean;
}

const CandidateColumn: React.FC<{ user: User; analysis: AIComparisonAnalysis['candidateBreakdowns'][0]; isRecommended: boolean }> = ({ user, analysis, isRecommended }) => {
    return (
        <div className={`p-4 rounded-lg flex-1 ${isRecommended ? 'bg-blue-50 dark:bg-blue-900/50 border-2 border-blue-500' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
            <Link to={`/profile/${user.id}`} target="_blank" className="flex items-center gap-3 group">
                <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:underline">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.title}</p>
                </div>
            </Link>
             <div className="mt-4">
                <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">Strengths</h4>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
             <div className="mt-3">
                <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Weaknesses</h4>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                     {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
            </div>
        </div>
    );
};


const CompareCandidatesModal: React.FC<CompareCandidatesModalProps> = ({ isOpen, onClose, analysis, candidates, isLoading }) => {
    const recommendedUser = analysis ? candidates.find(c => c.id === analysis.recommendation.userId) : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
            <Card className="max-h-[90vh] flex flex-col dark:bg-slate-800">
                <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Candidate Comparison</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-96">
                            <SparklesIcon className="w-12 h-12 text-blue-500 animate-pulse" />
                            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Comparing candidates...</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Gemini is analyzing their profiles to find the best fit.</p>
                        </div>
                    )}
                    {analysis && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">AI Executive Summary</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{analysis.summary}"</p>
                            </div>
                             {recommendedUser && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-800">
                                    <h4 className="font-semibold text-green-800 dark:text-green-300">AI Recommendation: {recommendedUser.name}</h4>
                                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                        <span className="font-semibold">Reasoning:</span> {analysis.recommendation.reasoning}
                                    </p>
                                </div>
                            )}
                            <div className="flex flex-col md:flex-row items-start gap-4">
                                {candidates.map(candidate => {
                                    const breakdown = analysis.candidateBreakdowns.find(b => b.userId === candidate.id);
                                    if (!breakdown) return null;
                                    return <CandidateColumn key={candidate.id} user={candidate} analysis={breakdown} isRecommended={candidate.id === analysis.recommendation.userId} />
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </Modal>
    );
};

export default CompareCandidatesModal;