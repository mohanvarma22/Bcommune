import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Card from '../components/common/Card';
import type { Job, InterviewRound } from '../types';

const CreateJob: React.FC = () => {
    const navigate = useNavigate();
    const { addJob, activeProfile, companies } = useContext(DataContext);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState<Job['type']>('Full-time');
    const [experienceLevel, setExperienceLevel] = useState<Job['experienceLevel']>('Mid');
    const [salaryRange, setSalaryRange] = useState('');
    const [description, setDescription] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [benefits, setBenefits] = useState('');
    const [skills, setSkills] = useState('');
    const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([{ name: '', description: '' }]);

    const isCompanyProfileActive = activeProfile.type === 'company';
    const activeCompany = isCompanyProfileActive ? companies.find(c => c.id === activeProfile.id) : null;

    const handleRoundChange = (index: number, field: keyof InterviewRound, value: string) => {
        const newRounds = [...interviewRounds];
        newRounds[index] = { ...newRounds[index], [field]: value };
        setInterviewRounds(newRounds);
    };

    const addRound = () => {
        setInterviewRounds([...interviewRounds, { name: '', description: '' }]);
    };
    
    const removeRound = (index: number) => {
        setInterviewRounds(interviewRounds.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCompanyProfileActive || !activeCompany) {
            alert('You must be acting as a company to post a job.');
            return;
        }

        if (!title || !location || !description) {
            alert('Please fill out all required fields.');
            return;
        }

        const filteredRounds = interviewRounds.filter(r => r.name.trim() !== '');
        if (filteredRounds.length === 0) {
            alert('Please define at least one round for the interview process.');
            return;
        }

        const newJob = {
            title,
            companyId: activeCompany.id,
            location,
            type,
            experienceLevel,
            salaryRange,
            description,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            responsibilities: responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
            qualifications: qualifications.split('\n').map(s => s.trim()).filter(Boolean),
            benefits: benefits.split('\n').map(s => s.trim()).filter(Boolean),
            interviewRounds: filteredRounds,
            postedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            status: 'Open' as const,
        };
        addJob(newJob);
        navigate('/my-activity');
    };
    
    const inputStyle = "w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:cursor-not-allowed";
    const labelStyle = "block text-sm font-medium text-slate-700 mb-1";
    const textareaStyle = `${inputStyle} min-h-[100px]`;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Post a New Job</h1>
            <Card>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {!isCompanyProfileActive ? (
                        <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200">
                             <h3 className="text-xl font-semibold text-slate-800">Action Required</h3>
                            <p className="text-slate-600 mt-2">To post a job, you need to be acting on behalf of a company. Please switch to a company profile or create one first.</p>
                             <div className="mt-4">
                                <Link to="/create/company" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                                    Create a Company Page
                                </Link>
                             </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className={labelStyle}>Hiring Company</label>
                                <div className="p-3 bg-slate-100 border border-slate-300 rounded-md font-semibold text-slate-800">
                                    {activeCompany?.name}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="title" className={labelStyle}>Job Title *</label>
                                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} placeholder="e.g., Founding Frontend Engineer"/>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <div>
                                    <label htmlFor="location" className={labelStyle}>Location *</label>
                                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className={inputStyle} placeholder="e.g., Remote"/>
                                </div>
                                <div>
                                    <label htmlFor="type" className={labelStyle}>Employment Type</label>
                                    <select id="type" value={type} onChange={e => setType(e.target.value as any)} className={inputStyle}>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="experienceLevel" className={labelStyle}>Experience Level</label>
                                    <select id="experienceLevel" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value as any)} className={inputStyle}>
                                        <option>Entry</option>
                                        <option>Mid</option>
                                        <option>Senior</option>
                                        <option>Lead</option>
                                        <option>Principal</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="salaryRange" className={labelStyle}>Salary Range (Optional)</label>
                                    <input type="text" id="salaryRange" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} className={inputStyle} placeholder="e.g., $150k - $200k"/>
                                </div>
                             </div>
                             <div>
                                <label htmlFor="description" className={labelStyle}>Core Job Description *</label>
                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={textareaStyle}></textarea>
                            </div>
                             <div>
                                <label htmlFor="responsibilities" className={labelStyle}>Key Responsibilities (one per line)</label>
                                <textarea id="responsibilities" value={responsibilities} onChange={e => setResponsibilities(e.target.value)} className={textareaStyle}></textarea>
                            </div>
                             <div>
                                <label htmlFor="qualifications" className={labelStyle}>Qualifications (one per line)</label>
                                <textarea id="qualifications" value={qualifications} onChange={e => setQualifications(e.target.value)} className={textareaStyle}></textarea>
                            </div>
                             <div>
                                <label htmlFor="benefits" className={labelStyle}>Benefits & Perks (one per line)</label>
                                <textarea id="benefits" value={benefits} onChange={e => setBenefits(e.target.value)} className={textareaStyle}></textarea>
                            </div>
                            <div>
                                <label className={labelStyle}>Interview Process *</label>
                                <div className="space-y-4 p-4 border border-slate-300 rounded-md bg-slate-50">
                                    {interviewRounds.map((round, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder={`Round ${index + 1} Name (e.g., Technical Screening)`}
                                                    value={round.name}
                                                    onChange={(e) => handleRoundChange(index, 'name', e.target.value)}
                                                    className={inputStyle}
                                                />
                                                <textarea
                                                    placeholder="Brief description of this round (optional)"
                                                    value={round.description}
                                                    onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                                                    rows={1}
                                                    className={`${inputStyle} text-sm`}
                                                />
                                            </div>
                                            <button type="button" onClick={() => removeRound(index)} className="mt-1 flex-shrink-0 h-8 w-8 text-red-500 hover:bg-red-100 rounded-full text-lg font-bold">&times;</button>
                                        </div>
                                    ))}
                                     <button type="button" onClick={addRound} className="w-full text-sm font-semibold py-1.5 border-2 border-dashed border-slate-400 text-slate-600 rounded-md hover:bg-slate-200 transition">
                                        + Add Round
                                    </button>
                                </div>
                            </div>
                             <div>
                                <label htmlFor="skills" className={labelStyle}>Skills (comma-separated)</label>
                                <input type="text" id="skills" value={skills} onChange={e => setSkills(e.target.value)} className={inputStyle} placeholder="React, TypeScript, Next.js..."/>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Post Job</button>
                            </div>
                        </>
                    )}
                </form>
            </Card>
        </div>
    );
};

export default CreateJob;