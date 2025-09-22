import React, { useRef, useEffect } from 'react';
import type { AIChatMessage } from '../types';
import AIMessage from '../components/ai/AIMessage';
import AIWelcome from '../components/ai/AIWelcome';

interface AIChatViewProps {
    messages: AIChatMessage[];
    isLoading: boolean;
    onSendMessage: (prompt: string) => void;
}

const AIChatView: React.FC<AIChatViewProps> = ({ messages, isLoading, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const prompt = formData.get('prompt') as string;

        if (!prompt.trim()) return;
        
        onSendMessage(prompt);
        e.currentTarget.reset();
    };
    
    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
                {messages.length === 0 && !isLoading && <AIWelcome />}
                {messages.map((msg, index) => (
                    <AIMessage key={index} sender={msg.sender} content={msg.content} />
                ))}
                 {isLoading && <AIMessage sender="ai" content={<div className="typing-indicator"><span></span><span></span><span></span></div>} />}
                <div ref={messagesEndRef} />
            </div>

            <div className="pt-4 mt-auto">
                 <form ref={formRef} onSubmit={handleSubmit} className="relative">
                    <textarea
                        name="prompt"
                        placeholder="Ask me to find remote jobs, events in Austin, or developers with React skills..."
                        disabled={isLoading}
                        rows={1}
                        className="w-full pl-4 pr-28 py-3 bg-white border border-slate-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-100"
                         onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                formRef.current?.requestSubmit();
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-slate-400"
                    >
                        Send
                    </button>
                </form>
            </div>
             <style>{`
                .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 12px 0; }
                .typing-indicator span { width: 8px; height: 8px; background-color: #94a3b8; border-radius: 50%; animation: bounce 1.2s infinite ease-in-out; }
                .typing-indicator span:nth-of-type(2) { animation-delay: -0.2s; }
                .typing-indicator span:nth-of-type(3) { animation-delay: -0.4s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
            `}</style>
        </div>
    );
};

export default AIChatView;