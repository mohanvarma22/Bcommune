import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import type { Story } from '../types';

const storyCategories: Story['category'][] = ['Founder Journey', 'Tech Deep Dive', 'Growth Hacking', 'Design Thinking', 'Opinion'];

const CreateStory: React.FC = () => {
    const navigate = useNavigate();
    const { addStory } = useContext(DataContext);
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState<Story['category']>('Founder Journey');
    const [tags, setTags] = useState('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !excerpt || !content) {
            alert('Please fill out all required fields.');
            return;
        }
        const newStory = {
            title,
            excerpt,
            content,
            imageUrl: imageUrl || `https://picsum.photos/seed/${Date.now()}/800/400`,
            category,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            // FIX: Add missing 'status' property to satisfy the type for addStory.
            status: 'Published' as const,
        };
        addStory(newStory);
        navigate('/feed');
    };

    const inputStyle = "w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Share Your Story</h1>
            <Card>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label htmlFor="title" className={labelStyle}>Title *</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="category" className={labelStyle}>Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} className={inputStyle}>
                                {storyCategories.map(cat => <option key={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tags" className={labelStyle}>Tags (comma-separated)</label>
                            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., Startups, AI, Vision" className={inputStyle} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className={labelStyle}>Header Image URL (Optional)</label>
                        <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" className={inputStyle} />
                    </div>
                     <div>
                        <label htmlFor="excerpt" className={labelStyle}>Excerpt / Subtitle *</label>
                        <textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} required rows={2} className={inputStyle}></textarea>
                    </div>
                     <div>
                        <label htmlFor="content" className={labelStyle}>Full Story *</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={12} className={inputStyle}></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Publish Story</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateStory;
