import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import { LogoIcon } from '../components/common/Icons';
import type { User, Experience } from '../types';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { updateCurrentUserProfile } = useContext(DataContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        location: '',
        skills: '',
        role: '',
        company: '',
        period: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        const experience: Experience[] = formData.role ? [{
            role: formData.role,
            company: formData.company,
            period: formData.period,
            description: formData.description,
        }] : [];
        
        const updatedData: Partial<User> = {
            name: formData.name,
            title: formData.title,
            location: formData.location,
            skills: skillsArray,
            experience: experience,
        };
        
        updateCurrentUserProfile(updatedData);
        navigate('/feed');
    };

    const inputStyle = "w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-lg">
                <div className="flex justify-center mb-4">
                    <LogoIcon />
                </div>
                <Card>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-1 text-slate-900">Welcome to Bcommune!</h2>
                        <p className="text-center text-slate-500 mb-6">Let's set up your digital passport.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {step === 1 && (
                                <>
                                    <h3 className="font-semibold text-lg">Step 1: The Basics</h3>
                                    <div>
                                        <label htmlFor="name" className={labelStyle}>Full Name</label>
                                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
                                    </div>
                                    <div>
                                        <label htmlFor="title" className={labelStyle}>Your Title</label>
                                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputStyle} placeholder="e.g., Software Engineer"/>
                                    </div>
                                    <div>
                                        <label htmlFor="location" className={labelStyle}>Location</label>
                                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className={inputStyle} placeholder="e.g., San Francisco, CA"/>
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                     <h3 className="font-semibold text-lg">Step 2: Your Skills</h3>
                                    <div>
                                        <label htmlFor="skills" className={labelStyle}>Core Skills (comma-separated)</label>
                                        <input type="text" name="skills" id="skills" value={formData.skills} onChange={handleChange} required className={inputStyle} placeholder="e.g., React, TypeScript, Node.js"/>
                                    </div>
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <h3 className="font-semibold text-lg">Step 3: Latest Experience</h3>
                                    <div>
                                        <label htmlFor="role" className={labelStyle}>Job Title</label>
                                        <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} required className={inputStyle} />
                                    </div>
                                     <div>
                                        <label htmlFor="company" className={labelStyle}>Company</label>
                                        <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} required className={inputStyle} />
                                    </div>
                                     <div>
                                        <label htmlFor="period" className={labelStyle}>Dates</label>
                                        <input type="text" name="period" id="period" value={formData.period} onChange={handleChange} required className={inputStyle} placeholder="e.g., 2022 - Present"/>
                                    </div>
                                     <div>
                                        <label htmlFor="description" className={labelStyle}>Brief Description</label>
                                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyle}></textarea>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between items-center pt-4">
                                {step > 1 ? (
                                    <button type="button" onClick={handleBack} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Back</button>
                                ) : <div></div>}
                                {step < 3 ? (
                                    <button type="button" onClick={handleNext} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Next</button>
                                ) : (
                                    <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Finish & Enter</button>
                                )}
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;