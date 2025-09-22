import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';

interface FeedbackFormProps {
    signalId: string;
    onFeedbackSubmitted: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ signalId, onFeedbackSubmitted }) => {
    const { addFeedback } = useContext(DataContext);
    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');
    const [suggestion, setSuggestion] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pros.trim() || cons.trim() || suggestion.trim()) {
            addFeedback(signalId, { pros, cons, suggestion });
            onFeedbackSubmitted();
        } else {
            alert("Please fill out at least one field to submit feedback.");
        }
    };

    const labelStyle = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1";
    const textareaStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none transition";

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 px-5 pb-2">
            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-4">Give Constructive Feedback</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="pros" className={labelStyle}>What do you like? (Pros)</label>
                    <textarea id="pros" value={pros} onChange={e => setPros(e.target.value)} rows={2} className={textareaStyle}></textarea>
                </div>
                <div>
                    <label htmlFor="cons" className={labelStyle}>What could be improved? (Cons)</label>
                    <textarea id="cons" value={cons} onChange={e => setCons(e.target.value)} rows={2} className={textareaStyle}></textarea>
                </div>
                <div>
                    <label htmlFor="suggestion" className={labelStyle}>Any specific suggestions?</label>
                    <textarea id="suggestion" value={suggestion} onChange={e => setSuggestion(e.target.value)} rows={2} className={textareaStyle}></textarea>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
