import React, { useState, useContext } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import { DataContext } from '../../context/DataContext';
import type { SignalType, PollOption } from '../../types';

interface CreateSignalModalProps {
    isOpen: boolean;
    onClose: () => void;
    ventureId: string;
}

const CreateSignalModal: React.FC<CreateSignalModalProps> = ({ isOpen, onClose, ventureId }) => {
    const { addSignal } = useContext(DataContext);
    const [type, setType] = useState<SignalType>('update');
    const [content, setContent] = useState('');
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const removeOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            alert("Please enter some content for your signal.");
            return;
        }

        let finalPollOptions: PollOption[] | undefined;
        if (type === 'poll') {
            const validOptions = pollOptions.map(opt => opt.trim()).filter(Boolean);
            if (validOptions.length < 2) {
                alert("Polls must have at least two non-empty options.");
                return;
            }
            finalPollOptions = validOptions.map(text => ({ text, votes: [] }));
        }

        addSignal(ventureId, {
            type,
            content,
            pollOptions: finalPollOptions,
        });
        onClose();
    };

    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
    
    const TabButton: React.FC<{ tabName: SignalType, label: string }> = ({ tabName, label }) => (
        <button type="button" onClick={() => setType(tabName)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors flex-1 ${type === tabName ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
            {label}
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Card className="dark:bg-slate-800">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Send a Signal</h2>
                        <p className="text-sm text-slate-500 mt-1">Engage with the community to get feedback and validation.</p>
                        
                        <div className="my-4 p-1 bg-slate-100 rounded-lg flex items-center gap-1">
                            <TabButton tabName="update" label="Update" />
                            <TabButton tabName="question" label="Question" />
                            <TabButton tabName="poll" label="Poll" />
                        </div>
                        
                        <div>
                            <label htmlFor="content" className={labelStyle}>
                                {type === 'update' && "What's your update?"}
                                {type === 'question' && "What question do you want to ask?"}
                                {type === 'poll' && "What's the topic of your poll?"}
                            </label>
                            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={4} className={inputStyle}></textarea>
                        </div>
                        
                        {type === 'poll' && (
                            <div className="mt-4 space-y-2">
                                <label className={labelStyle}>Poll Options</label>
                                {pollOptions.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" value={opt} onChange={e => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} className={inputStyle} />
                                        {pollOptions.length > 2 && <button type="button" onClick={() => removeOption(index)} className="w-6 h-6 bg-red-100 text-red-600 rounded-full font-bold">&times;</button>}
                                    </div>
                                ))}
                                {pollOptions.length < 5 && <button type="button" onClick={addOption} className="w-full text-sm py-1 mt-2 border-2 border-dashed rounded-md text-slate-500 hover:bg-slate-100 transition">+ Add Option</button>}
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Signal</button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
};

export default CreateSignalModal;
