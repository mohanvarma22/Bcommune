import React from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import type { AIAssistantAnalysis, User } from '../../types';
import { CloseIcon, CheckCircleIcon, InfoIcon, EnvelopeIcon, PhoneIcon } from '../common/Icons';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';

interface AICoPilotPaneProps {
    isOpen: boolean;
    onClose: () => void;
    analysisData: (AIAssistantAnalysis & { userId: string }) | null;
    user?: User | null;
}

const ContactInfo: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div>
            <h4 className="font-semibold text-md text-slate-800 dark:text-slate-200 mb-2">Contact Information</h4>
            <div className="space-y-2">
                {user.email && (
                    <div className="flex items-center gap-2 text-sm">
                        <EnvelopeIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <a href={`mailto:${user.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{user.email}</a>
                    </div>
                )}
                {user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <a href={`tel:${user.phone}`} className="text-slate-700 dark:text-slate-300 hover:underline">{user.phone}</a>
                    </div>
                )}
            </div>
        </div>
    );
};


const AICoPilotPane: React.FC<AICoPilotPaneProps> = ({ isOpen, onClose, analysisData, user }) => {
    
    const renderContent = () => {
        if (!analysisData || !user) {
            return (
                <div className="text-center p-10">
                    <p className="text-slate-500 dark:text-slate-400">No analysis to display. Select a candidate with an analysis to view details.</p>
                </div>
            );
        }

        return (
            <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                        <div>
                            <button onClick={() => window.open(`/#/profile/${user.id}`, '_blank')} className="font-bold text-xl text-blue-600 dark:text-blue-400 hover:underline text-left">{user.name}</button>
                            <p className="text-md text-slate-600 dark:text-slate-400">{user.title}</p>
                        </div>
                    </div>
                    <ContactInfo user={user} />
                </div>


                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-300">Fit Score</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{analysisData.fitScore}%</p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${analysisData.fitScore}%` }}></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic">"{analysisData.summary}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <h4 className="font-semibold text-md text-green-600 dark:text-green-400 mb-2">Strengths</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            {analysisData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md text-yellow-600 dark:text-yellow-400 mb-2">Weaknesses / Areas to Probe</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            {analysisData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-md text-slate-800 dark:text-slate-200 mb-2">Skill Validation</h4>
                        <ul className="space-y-2">
                            {analysisData.skillValidation.map(skill => (
                                <li key={skill.skill} className="text-sm">
                                    <div className="flex items-center gap-2 font-medium">
                                        {skill.hasEvidence ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <InfoIcon className="w-5 h-5 text-yellow-500" />}
                                        <span className="text-slate-800 dark:text-slate-300">{skill.skill}</span>
                                    </div>
                                    <p className="pl-7 text-xs text-slate-500 dark:text-slate-400 italic">Evidence: {skill.evidence}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-md text-slate-800 dark:text-slate-200 mb-2">Suggested Interview Questions</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            {analysisData.interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                     <div>
                        <h4 className="font-semibold text-md text-slate-800 dark:text-slate-200 mb-2">Project Deep Dive</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{analysisData.projectDeepDive}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-md text-slate-800 dark:text-slate-200 mb-2">Culture Alignment</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{analysisData.cultureAlignment}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <Card className="max-h-[90vh] flex flex-col dark:bg-slate-800">
                <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Co-Pilot Deep Dive</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </Card>
        </Modal>
    );
};

export default AICoPilotPane;