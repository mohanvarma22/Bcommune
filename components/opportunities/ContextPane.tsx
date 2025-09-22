import React from 'react';
import CompanyProfile from '../../views/CompanyProfile';
import { XMarkIcon } from '../common/Icons';
import ProfilePane from './ProfilePane';

interface ContextPaneProps {
  view: { type: 'company' | 'user' | null; id: string | null };
  onClose: () => void;
}

const ContextPane: React.FC<ContextPaneProps> = ({ view, onClose }) => {
    return (
        <div className="relative h-full">
            <div className="sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 p-2 flex justify-end">
                 <button 
                    onClick={onClose} 
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    aria-label="Close context pane"
                >
                    <XMarkIcon />
                </button>
            </div>
            
            <div className="h-full">
                {view.type === 'company' && view.id && (
                    <CompanyProfile companyId={view.id} isPane={true} />
                )}
                {view.type === 'user' && view.id && (
                    <ProfilePane userId={view.id} />
                )}
            </div>
        </div>
    );
}

export default ContextPane;