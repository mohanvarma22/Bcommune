import React from 'react';
import type { InterviewRound } from '../../types';

interface InterviewProcessSectionProps {
    rounds: InterviewRound[];
    titleClassName?: string;
}

const InterviewProcessSection: React.FC<InterviewProcessSectionProps> = ({ rounds, titleClassName = "text-md font-semibold text-slate-800 mb-2" }) => {
    if (!rounds || rounds.length === 0) return null;

    return (
        <div>
            <h4 className={titleClassName}>Interview Process</h4>
            <ol className="list-decimal list-inside space-y-3 mt-2">
                {rounds.map((round, index) => (
                    <li key={index} className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-700">{round.name}</span>
                        {round.description && <p className="text-xs pl-5 mt-0.5 text-slate-500">{round.description}</p>}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default InterviewProcessSection;
