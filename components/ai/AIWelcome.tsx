import React from 'react';
import { AIIcon } from '../common/Icons';

const AIWelcome: React.FC = () => {
    return (
        <div className="text-center pt-16">
            <AIIcon className="w-16 h-16 text-blue-500 mx-auto" />
            <h1 className="text-3xl font-bold text-slate-900 mt-4">InnovateLink AI Assistant</h1>
            <p className="text-lg text-slate-500 mt-2">
                Ask me anything about jobs, talent, or events on the platform.
            </p>
            <div className="mt-8 text-left max-w-md mx-auto space-y-2">
                <p className="text-sm font-semibold text-slate-600">Try asking:</p>
                <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
                    <li>"Show me senior frontend developer jobs in New York"</li>
                    <li>"Are there any upcoming meetups in Austin?"</li>
                    <li>"Find me growth marketers with SEO skills"</li>
                </ul>
            </div>
        </div>
    );
};

export default AIWelcome;