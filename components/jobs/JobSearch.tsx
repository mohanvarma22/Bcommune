import React, { useState, useEffect } from 'react';

interface JobSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (query: string) => void;
}

const AISearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const JobSearch: React.FC<JobSearchProps> = ({ isOpen, onClose, onSearch }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsLoading(true);
            onSearch(query);
        }
    };
    
    if (!isOpen) return null;

    return (
        <>
            {/* Clickaway overlay */}
            <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
            
            <div 
              className="absolute top-full mt-2 w-full left-0 z-50"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                    <div className="p-4">
                         <form onSubmit={handleSubmit} className="flex gap-3">
                             <div className="relative flex-grow">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <AISearchIcon />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search with AI..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:ring-1 focus:ring-violet-500 focus:outline-none transition text-white placeholder-gray-400"
                                    disabled={isLoading}
                                    autoFocus
                                />
                             </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center px-5 py-2 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                disabled={isLoading || !query.trim()}
                            >
                               Search
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-2 px-1">Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded">Esc</kbd> to close.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobSearch;