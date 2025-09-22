import React from 'react';

interface ToggleSwitchProps {
    isEnabled: boolean;
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 ${
                isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

export default ToggleSwitch;