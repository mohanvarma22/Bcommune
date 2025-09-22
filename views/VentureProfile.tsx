import React, { useContext, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import { CheckIcon, FirstBelieverIcon, SignalIcon, DesktopComputerIcon, DocumentTextIcon } from '../components/common/Icons';
import SignalCard from '../components/ventures/SignalCard';
import CreateSignalModal from '../components/ventures/CreateSignalModal';

const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h3>
        <div className="mt-2 text-slate-700 dark:text-slate-300 prose prose-sm max-w-none">{children}</div>
    </div>
);

const VentureProfile: React.FC = () => {
    const { ventureId } = useParams<{ ventureId: string }>();
    const { ventures, users, currentUser, userExpressesInterestInVenture, signals, addFirstBeliever } = useContext(DataContext);
    const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
    const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);

    const venture = ventures.find(v => v.id === ventureId);
    
    const [selectedImage, setSelectedImage] = useState(venture?.imageUrls?.[0] || null);

    const handleToggleExpand = (signalId: string) => {
        setExpandedSignalId(prev => (prev === signalId ? null : signalId));
    };
    
    if (!venture || !currentUser) {
        return <Navigate to="/ventures" replace />;
    }
    
    const owner = users.find(u => u.id === venture.ownerId);
    const isOwner = currentUser.id === owner?.id;
    const hasExpressedInterest = venture.interestedUsers.includes(currentUser.id);
    const isFirstBeliever = venture.firstBelievers.includes(currentUser.id);

    const ventureSignals = signals.filter(s => s.ventureId === venture.id);

    const handleInterest = () => {
        if (!isOwner && !hasExpressedInterest) {
            userExpressesInterestInVenture(venture.id, currentUser.id);
        }
    };

    const handleBecomeFirstBeliever = () => {
        if (!isOwner && !isFirstBeliever) {
            addFirstBeliever(venture.id);
        }
    };
    
    return (
        <>
            <div className="max-w-4xl mx-auto">
                {venture.imageUrls && venture.imageUrls.length > 0 && (
                    <div className="mb-8">
                        <Card className="p-2 dark:bg-slate-900">
                            <img src={selectedImage || venture.imageUrls[0]} alt={`${venture.name} showcase`} className="w-full h-auto max-h-[500px] object-contain rounded-lg"/>
                        </Card>
                        {venture.imageUrls.length > 1 && (
                            <div className="mt-2 flex gap-2 justify-center p-2 overflow-x-auto">
                                {venture.imageUrls.map((url, index) => (
                                    <button key={index} onClick={() => setSelectedImage(url)} className="flex-shrink-0">
                                        <img src={url} alt={`Thumbnail ${index + 1}`} className={`w-20 h-20 object-cover rounded-md border-2 transition-all ${selectedImage === url ? 'border-blue-500 scale-105' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <Card className="overflow-hidden">
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <Avatar src={venture.logoUrl} alt={venture.name} size="xl" />
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{venture.name}</h1>
                                <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">{venture.tagline}</p>
                                {owner && (
                                    <div className="mt-4">
                                        <Link to={`/profile/${owner.id}`} className="inline-flex items-center gap-2 group">
                                            <Avatar src={owner.avatarUrl} alt={owner.name} size="sm" />
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:underline">Founded by {owner.name}</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            {!isOwner && (
                                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={handleBecomeFirstBeliever}
                                        disabled={isFirstBeliever}
                                        className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-transparent border-2 border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <FirstBelieverIcon />
                                        {isFirstBeliever ? "You're a First Believer" : "Become a First Believer"}
                                    </button>
                                    <button
                                        onClick={handleInterest}
                                        disabled={hasExpressedInterest}
                                        className="w-full sm:w-auto flex-shrink-0 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {hasExpressedInterest ? <><CheckIcon /> Interest Expressed</> : "I'm Intrigued"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        <DetailSection title="The Problem"><p>{venture.problem}</p></DetailSection>
                        <DetailSection title="Our Solution"><p>{venture.solution}</p></DetailSection>
                        <div className="md:col-span-2">
                            <DetailSection title="Grand Vision"><p>{venture.vision}</p></DetailSection>
                        </div>
                        
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Venture Details</h4>
                            <div className="text-sm space-y-2">
                            <p><strong className="text-slate-600 dark:text-slate-400">Stage:</strong> {venture.stage}</p>
                            <p><strong className="text-slate-600 dark:text-slate-400">Market:</strong> {venture.market.join(', ')}</p>
                            <p><strong className="text-slate-600 dark:text-slate-400">First Believers:</strong> {venture.firstBelievers.length}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Seeking Talent</h4>
                            <div className="flex flex-wrap gap-2">
                                {venture.seeking.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                         <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg col-span-1 md:col-span-2">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Links</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {venture.prototypeLink && (
                                    <a href={venture.prototypeLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-slate-800 rounded-md hover:bg-slate-100 transition border border-slate-300">
                                        <DesktopComputerIcon /> View Prototype
                                    </a>
                                )}
                                {venture.ideaLink && (
                                     <a href={venture.ideaLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-slate-800 rounded-md hover:bg-slate-100 transition border border-slate-300">
                                        <DocumentTextIcon /> View Idea/Deck
                                    </a>
                                )}
                                {!venture.prototypeLink && !venture.ideaLink && (
                                    <p className="text-sm text-slate-500">No links provided yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </Card>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Signals & Updates</h2>
                        {isOwner && (
                            <button onClick={() => setIsSignalModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                <SignalIcon /> Send a Signal
                            </button>
                        )}
                    </div>
                    <div className="space-y-6">
                        {ventureSignals.length > 0 ? (
                            ventureSignals.map(signal => 
                                <SignalCard 
                                    key={signal.id} 
                                    signal={signal} 
                                    venture={venture} 
                                    isExpanded={expandedSignalId === signal.id}
                                    onToggleExpand={() => handleToggleExpand(signal.id)}
                                />
                            )
                        ) : (
                            <Card className="p-8 text-center text-slate-500">
                                This venture hasn't sent any signals yet.
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {isSignalModalOpen && (
                <CreateSignalModal
                    isOpen={isSignalModalOpen}
                    onClose={() => setIsSignalModalOpen(false)}
                    ventureId={venture.id}
                />
            )}
        </>
    );
};

export default VentureProfile;