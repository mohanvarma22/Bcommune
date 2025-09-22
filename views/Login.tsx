import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogoIcon } from '../components/common/Icons';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd have auth logic here.
        // For this demo, we'll just navigate to the main feed.
        navigate('/feed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-8">
                    <div className="flex flex-col items-center mb-6">
                         <LogoIcon />
                        <h1 className="font-warnes text-3xl font-bold text-slate-900 mt-2">Bcommune</h1>
                        <p className="text-slate-500">Connect with the future.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    defaultValue="alex.chen@example.com"
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-900 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    defaultValue="password123"
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-900 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-blue-500 transition-transform hover:scale-105"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                     <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/onboarding" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;