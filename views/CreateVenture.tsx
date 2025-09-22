import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import type { Venture } from '../types';
import { MOCK_CURRENT_USER_ID } from '../constants';

const CreateVenture: React.FC = () => {
    const navigate = useNavigate();
    const { addVenture } = useContext(DataContext);
    
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [vision, setVision] = useState('');
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    const [market, setMarket] = useState('');
    const [stage, setStage] = useState<Venture['stage']>('Idea');
    const [seeking, setSeeking] = useState('');
    const [prototypeLink, setPrototypeLink] = useState('');
    const [ideaLink, setIdeaLink] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>(['']);

    const handleImageUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrlInput = () => {
        if (imageUrls.length < 5) {
            setImageUrls([...imageUrls, '']);
        }
    };

    const removeImageUrlInput = (index: number) => {
        if (imageUrls.length > 1) {
            setImageUrls(imageUrls.filter((_, i) => i !== index));
        } else {
            setImageUrls(['']);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !tagline || !vision || !problem || !solution) {
            alert('Please fill out all required fields.');
            return;
        }

        const newVenture = {
            name,
            tagline,
            logoUrl,
            vision,
            problem,
            solution,
            market: market.split(',').map(s => s.trim()).filter(Boolean),
            stage,
            seeking: seeking.split(',').map(s => s.trim()).filter(Boolean),
            prototypeLink,
            ideaLink,
            imageUrls: imageUrls.map(url => url.trim()).filter(Boolean),
        };
        addVenture(newVenture);
        navigate(`/profile/${MOCK_CURRENT_USER_ID}`, { state: { openVenturesTab: true } });
    };
    
    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
    const textareaStyle = `${inputStyle} min-h-[100px]`;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Create a Venture Profile</h1>
            <Card>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <h2 className="text-xl font-semibold border-b border-slate-200 pb-2">The Basics</h2>
                    <div>
                        <label htmlFor="name" className={labelStyle}>Venture Name *</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={inputStyle} placeholder="e.g., Project Phoenix"/>
                    </div>
                    <div>
                        <label htmlFor="tagline" className={labelStyle}>Tagline / One-Liner *</label>
                        <input type="text" id="tagline" value={tagline} onChange={e => setTagline(e.target.value)} required className={inputStyle} placeholder="e.g., AI-powered code generation"/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="logoUrl" className={labelStyle}>Logo URL (Optional)</label>
                            <input type="text" id="logoUrl" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className={inputStyle} placeholder="https://example.com/logo.png"/>
                        </div>
                        <div>
                            <label htmlFor="stage" className={labelStyle}>Current Stage</label>
                            <select id="stage" value={stage} onChange={e => setStage(e.target.value as any)} className={inputStyle}>
                                <option>Idea</option>
                                <option>Prototype</option>
                                <option>Early Traction</option>
                            </select>
                        </div>
                     </div>

                    <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 pt-4">The Vision</h2>
                     <div>
                        <label htmlFor="problem" className={labelStyle}>The Problem You're Solving *</label>
                        <textarea id="problem" value={problem} onChange={e => setProblem(e.target.value)} required rows={3} className={textareaStyle}></textarea>
                    </div>
                     <div>
                        <label htmlFor="solution" className={labelStyle}>Your Solution *</label>
                        <textarea id="solution" value={solution} onChange={e => setSolution(e.target.value)} required rows={3} className={textareaStyle}></textarea>
                    </div>
                     <div>
                        <label htmlFor="vision" className={labelStyle}>Your Grand Vision *</label>
                        <textarea id="vision" value={vision} onChange={e => setVision(e.target.value)} required rows={4} className={textareaStyle}></textarea>
                    </div>

                    <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 pt-4">Showcase Your Venture</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="prototypeLink" className={labelStyle}>Prototype Link (Optional)</label>
                            <input type="text" id="prototypeLink" value={prototypeLink} onChange={e => setPrototypeLink(e.target.value)} className={inputStyle} placeholder="https://figma.com/..."/>
                        </div>
                        <div>
                            <label htmlFor="ideaLink" className={labelStyle}>Idea/Deck Link (Optional)</label>
                            <input type="text" id="ideaLink" value={ideaLink} onChange={e => setIdeaLink(e.target.value)} className={inputStyle} placeholder="https://docs.google.com/..."/>
                        </div>
                    </div>
                     <div>
                        <label className={labelStyle}>Image URLs (up to 5)</label>
                        <div className="space-y-2">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" value={url} onChange={e => handleImageUrlChange(index, e.target.value)} className={inputStyle} placeholder={`Image URL ${index + 1}`}/>
                                    <button type="button" onClick={() => removeImageUrlInput(index)} className="flex-shrink-0 h-9 w-9 bg-red-100 text-red-600 rounded-md font-bold text-lg hover:bg-red-200 transition">&times;</button>
                                </div>
                            ))}
                            {imageUrls.length < 5 && (
                                <button type="button" onClick={addImageUrlInput} className="w-full text-sm font-semibold py-1.5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                    + Add another image
                                </button>
                            )}
                        </div>
                    </div>
                     
                    <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 pt-4">The Ask</h2>
                    <div>
                        <label htmlFor="market" className={labelStyle}>Target Market (comma-separated)</label>
                        <input type="text" id="market" value={market} onChange={e => setMarket(e.target.value)} className={inputStyle} placeholder="Enterprise, DevTools, AI..."/>
                    </div>
                    <div>
                        <label htmlFor="seeking" className={labelStyle}>Seeking Talent / Skills (comma-separated)</label>
                        <input type="text" id="seeking" value={seeking} onChange={e => setSeeking(e.target.value)} className={inputStyle} placeholder="Growth Marketer, React Native..."/>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Create Venture</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateVenture;