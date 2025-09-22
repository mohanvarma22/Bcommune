import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './Icons';

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: string) => {
        const newSelected = selectedOptions.includes(option)
            ? selectedOptions.filter(o => o !== option)
            : [...selectedOptions, option];
        onChange(newSelected);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const displayLabel = selectedOptions.length > 1 
        ? `${selectedOptions.length} selected` 
        : selectedOptions.length === 1
        ? selectedOptions[0]
        : label;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between py-2 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-800 dark:text-slate-200"
            >
                <span className="truncate">{displayLabel}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionClick(option)}
                                className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500 dark:border-slate-500 dark:bg-slate-700 dark:checked:bg-blue-600"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
