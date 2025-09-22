import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import type { Company } from '../types';

const CreateCompany: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Destructure addCompany from context.
    const { addCompany } = useContext(DataContext);
    
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        logoUrl: '',
        website: '',
        location: '',
        industry: '',
        size: '1-10 employees',
        about: '',
        vision: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, tagline, about, vision } = formData;
        if (!name || !tagline || !about || !vision) {
            alert('Please fill out all required fields.');
            return;
        }

        addCompany(formData);
        // After creating, we can switch to the new company profile and navigate home
        // For now, let's navigate to the feed. The switching logic will be handled in DataContext.
        navigate('/feed');
    };
    
    const inputStyle = "w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
    const textareaStyle = `${inputStyle} min-h-[100px]`;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Create a Company Profile</h1>
            <Card>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <h2 className="text-xl font-semibold border-b border-slate-200 pb-2">Company Basics</h2>
                    <div>
                        <label htmlFor="name" className={labelStyle}>Company Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="tagline" className={labelStyle}>Tagline *</label>
                        <input type="text" id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} required className={inputStyle} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="logoUrl" className={labelStyle}>Logo URL</label>
                            <input type="text" id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className={inputStyle} placeholder="https://"/>
                        </div>
                        <div>
                            <label htmlFor="website" className={labelStyle}>Website</label>
                            <input type="text" id="website" name="website" value={formData.website} onChange={handleChange} className={inputStyle} placeholder="https://"/>
                        </div>
                        <div>
                            <label htmlFor="location" className={labelStyle}>Location</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={inputStyle}/>
                        </div>
                        <div>
                            <label htmlFor="industry" className={labelStyle}>Industry</label>
                            <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleChange} className={inputStyle}/>
                        </div>
                         <div>
                            <label htmlFor="size" className={labelStyle}>Company Size</label>
                            <select id="size" name="size" value={formData.size} onChange={handleChange} className={inputStyle}>
                                <option>1-10 employees</option>
                                <option>11-50 employees</option>
                                <option>51-200 employees</option>
                                <option>201-500 employees</option>
                                <option>501+ employees</option>
                            </select>
                        </div>
                     </div>

                    <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 pt-4">Company Story</h2>
                     <div>
                        <label htmlFor="about" className={labelStyle}>About the Company *</label>
                        <textarea id="about" name="about" value={formData.about} onChange={handleChange} required rows={4} className={textareaStyle}></textarea>
                    </div>
                     <div>
                        <label htmlFor="vision" className={labelStyle}>Company Vision *</label>
                        <textarea id="vision" name="vision" value={formData.vision} onChange={handleChange} required rows={3} className={textareaStyle}></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Create Company</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateCompany;
