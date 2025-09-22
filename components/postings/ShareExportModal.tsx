import React, { useContext, useState } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import type { Job, User } from '../../types';
import { DataContext } from '../../context/DataContext';
import { CloseIcon, ShareLinkIcon, FileSpreadsheetIcon, CopyIcon } from '../common/Icons';
import { getAIAssistantAnalysis } from '../../services/geminiApplicantService';

interface ShareExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedApplicants: User[];
    job: Job;
}

const OptionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    isRecommended?: boolean;
}> = ({ icon, title, description, onClick, isRecommended }) => (
    <button
        onClick={onClick}
        className={`relative w-full text-left p-4 border rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
            isRecommended
                ? 'bg-blue-50 border-blue-500 hover:border-blue-600 dark:bg-blue-900/50 dark:border-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'
        }`}
    >
        {isRecommended && (
            <div className="absolute -top-3 right-3 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                Recommended
            </div>
        )}
        <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${isRecommended ? 'bg-blue-100 text-blue-600 dark:bg-blue-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            </div>
        </div>
    </button>
);

const ShareExportModal: React.FC<ShareExportModalProps> = ({ isOpen, onClose, selectedApplicants, job }) => {
    // FIX: Destructure companies to get company data for the AI analysis.
    const { createSharedDashboard, saveAIAssistantAnalyses, companies } = useContext(DataContext);
    const [sharedLink, setSharedLink] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);
    const [isAnalyzingForExport, setIsAnalyzingForExport] = useState(false);

    const handleShareDashboard = () => {
        const dashboard = createSharedDashboard(job.id, selectedApplicants.map(u => u.id));
        const url = `${window.location.origin}${window.location.pathname}#/share/${dashboard.id}`;
        setSharedLink(url);
    };

    const handleCopyLink = () => {
        if (!sharedLink) return;
        navigator.clipboard.writeText(sharedLink);
        setIsCopying(true);
        setTimeout(() => {
            setIsCopying(false);
            onClose();
        }, 2000);
    };

    const handleExport = async (type: 'quick' | 'full') => {
        if (type === 'quick') {
            const headers = "Name\tTitle\tEmail\tPhone\tProfile URL\n";
            const content = selectedApplicants.map(u => {
                const profileUrl = `${window.location.origin}${window.location.pathname}#/profile/${u.id}`;
                return `${u.name}\t${u.title}\t${u.email || ''}\t${u.phone || ''}\t${profileUrl}`;
            }).join('\n');
            navigator.clipboard.writeText(headers + content);
            alert(`${selectedApplicants.length} user(s) copied to clipboard.`);
            onClose();
            return;
        }

        const company = companies.find(c => c.id === job.companyId);
        if (!company) {
            alert("Could not find company data for this job.");
            return;
        }

        // Full AI Analysis Export
        setIsAnalyzingForExport(true);
        try {
            const analyses = await Promise.all(
                selectedApplicants.map(async (applicant) => {
                    const existingAnalysis = job.applicantDetails.find(ad => ad.userId === applicant.id)?.aiAssistantAnalysis;
                    if (existingAnalysis) return { ...existingAnalysis, userId: applicant.id };
                    // FIX: Pass the company object to getAIAssistantAnalysis.
                    return await getAIAssistantAnalysis(job, applicant, company);
                })
            );

            saveAIAssistantAnalyses(job.id, analyses);

            const headers = "Name,Title,Email,Phone,Profile URL,AI Fit Score,AI Summary,Skill Match,Validated Skills,Vision Snippet,Featured Project\n";
            const content = analyses.map(analysis => {
                const user = selectedApplicants.find(u => u.id === analysis.userId);
                if (!user) return '';

                const profileUrl = `${window.location.origin}${window.location.pathname}#/profile/${user.id}`;
                const skillMatch = `${analysis.skillValidation.filter(s => s.hasEvidence).length}/${analysis.skillValidation.length}`;
                const validatedSkills = analysis.skillValidation.filter(s => s.hasEvidence).map(s => s.skill).join('; ');
                const vision = user.vision?.substring(0, 150).replace(/"/g, '""') + '...' || '';
                const project = user.portfolio.find(p => p.isFeatured)?.name.replace(/"/g, '""') || user.portfolio[0]?.name.replace(/"/g, '""') || '';

                return `"${user.name}","${user.title}","${user.email || ''}","${user.phone || ''}","${profileUrl}","${analysis.fitScore}","${analysis.summary.replace(/"/g, '""')}","${skillMatch}","${validatedSkills}","${vision}","${project}"`;
            }).join('\n');

            const blob = new Blob([headers + content], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${job.title.replace(/\s+/g, '_')}_AI_Analysis.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onClose();

        } catch (error) {
            console.error("Failed to export AI analysis:", error);
            alert("An error occurred while exporting the AI analysis.");
        } finally {
            setIsAnalyzingForExport(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <Card className="dark:bg-slate-800">
                <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">Share & Export Candidates</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6">
                    {sharedLink ? (
                        <div className="text-center">
                            <h4 className="font-semibold text-lg">Live Dashboard Link Generated!</h4>
                            <p className="text-sm text-slate-500 mt-1">Anyone with this link can view a live, read-only dashboard of these candidates.</p>
                            <div className="mt-4 flex gap-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                                <input type="text" readOnly value={sharedLink} className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none"/>
                                <button onClick={handleCopyLink} className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-24">
                                    {isCopying ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <OptionCard
                                icon={<ShareLinkIcon />}
                                title="Share Live Dashboard (10x Better)"
                                description="Generate a secure, shareable link to a live webpage. No login required for viewers. Always up-to-date."
                                onClick={handleShareDashboard}
                                isRecommended
                            />
                            <OptionCard
                                icon={<FileSpreadsheetIcon />}
                                title="Export Full AI Analysis (.csv)"
                                description="Download a detailed spreadsheet with AI fit scores, summaries, and skill validation for offline review."
                                onClick={() => handleExport('full')}
                            />
                            <OptionCard
                                icon={<CopyIcon />}
                                title="Copy Quick Contact List"
                                description="Copy essential contact info (Name, Title, Email, Phone) to your clipboard, ready to paste into a spreadsheet."
                                onClick={() => handleExport('quick')}
                            />
                        </div>
                    )}
                    {(isAnalyzingForExport) && (
                        <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                            Running AI analysis and preparing your export...
                        </div>
                    )}
                </div>
            </Card>
        </Modal>
    );
};

export default ShareExportModal;