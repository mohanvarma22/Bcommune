
import React from 'react';
import type { Startup } from '../../types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

interface StartupSpotlightProps {
  startup: Startup;
}

const StartupSpotlight: React.FC<StartupSpotlightProps> = ({ startup }) => {
  return (
    <Card className="p-6 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar src={startup.logoUrl} alt={`${startup.name} logo`} size="lg" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Startup Spotlight</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{startup.name}</h2>
          <p className="text-lg text-slate-700">{startup.tagline}</p>
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-600 italic">"{startup.vision}"</p>
          </div>
        </div>
      </div>
       <div className="mt-6 flex justify-end">
            <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                View Opportunities
            </button>
        </div>
    </Card>
  );
};

export default StartupSpotlight;