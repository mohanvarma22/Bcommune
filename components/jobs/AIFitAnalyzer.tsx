import React, { useState, useContext } from 'react';
import type { Job, User, AIShortlistPrediction } from '../../types';
import { getShortlistProbability } from '../../services/geminiApplicationService';
import { AIIcon } from '../common/Icons';

interface AIFitAnalyzerProps {
    job: Job;
    user: User;
}

const AIFitAnalyzer: React.FC<AIFitAnalyzerProps> = ({ job, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [insight, setInsight] = useState<AIShortlistPrediction | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyzeFit = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        setError(null);
        try {
            const result = await getShortlistProbability(job, user);
            setInsight(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mt-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Insight</h4>
            {insight ? (
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Probability of Shortlist</p>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{insight.probability}%</p>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${insight.probability}%` }}></div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">{insight.reasoning}</p>
                </div>
            ) : error ? (
                <p className="text-xs text-red-500">{error}</p>
            ) : (
                <button
                    onClick={handleAnalyzeFit}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <AIIcon className="w-4 h-4" />
                            Analyze My Fit
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default AIFitAnalyzer;
