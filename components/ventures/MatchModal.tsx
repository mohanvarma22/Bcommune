import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import type { Venture, User } from '../../types';
import Avatar from '../common/Avatar';
import { HeartIcon } from '../common/Icons';

interface MatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    venture: Venture;
    matchedUser: User;
}

const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, venture, matchedUser }) => {
    const navigate = useNavigate();

    const handleStartConversation = () => {
        onClose();
        navigate('/messages', { state: { preselectedUserId: matchedUser.id } });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden text-center p-8 relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 relative z-10">It's a Match!</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 relative z-10">
                    You and {matchedUser.name} are both interested in collaborating on {venture.name}!
                </p>

                <div className="flex justify-center items-center gap-4 my-8 relative">
                    <Avatar src={venture.logoUrl} alt={venture.name} size="lg" />
                    <HeartIcon className="w-10 h-10 text-blue-500" />
                    <Avatar src={matchedUser.avatarUrl} alt={matchedUser.name} size="lg" />
                </div>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleStartConversation}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform hover:scale-105"
                    >
                        Start a Conversation
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full px-6 py-2 text-sm text-slate-600 dark:text-slate-300 font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                        Keep Discovering
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default MatchModal;
