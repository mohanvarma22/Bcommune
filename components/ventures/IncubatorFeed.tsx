import React, { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import SignalCard from './SignalCard';

const IncubatorFeed: React.FC = () => {
    const { signals, ventures } = useContext(DataContext);
    const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);

    const handleToggleExpand = (signalId: string) => {
        setExpandedSignalId(prev => (prev === signalId ? null : signalId));
    };
    
    // In a real app, this would be sorted by a real timestamp
    const sortedSignals = [...signals].reverse();

    return (
        <div className="space-y-6">
            {sortedSignals.map(signal => {
                const venture = ventures.find(v => v.id === signal.ventureId);
                if (!venture) return null;
                return (
                    <SignalCard 
                        key={signal.id} 
                        signal={signal} 
                        venture={venture}
                        isExpanded={expandedSignalId === signal.id}
                        onToggleExpand={() => handleToggleExpand(signal.id)}
                    />
                )
            })}
        </div>
    );
};

export default IncubatorFeed;