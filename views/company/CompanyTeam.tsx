import React, { useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import type { TeamMember } from '../../types';
import { GoogleIcon, MicrosoftIcon, ShieldCheckIcon } from '../../components/common/Icons';
import ToggleSwitch from '../../components/common/ToggleSwitch';

const CompanyTeam: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { companies, users, currentUser, activeProfile, toggleCompanyIntegration } = useContext(DataContext);

    if (activeProfile.type !== 'company' || activeProfile.id !== companyId) {
        return <Navigate to="/feed" replace />;
    }

    const company = companies.find(c => c.id === companyId);
    if (!company || !company.team.some(member => member.userId === currentUser?.id)) {
        return <Navigate to="/feed" replace />;
    }

    const isOwner = company.team.find(m => m.userId === currentUser?.id)?.role === 'Owner';

    const IntegrationRow: React.FC<{ provider: 'google' | 'microsoft', name: string, icon: React.ReactNode }> = ({ provider, name, icon }) => {
        const isConnected = company?.integrations?.[provider] || false;
        return (
            <div className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                    {icon}
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{name}</p>
                </div>
                <ToggleSwitch isEnabled={isConnected} onToggle={() => toggleCompanyIntegration(company.id, provider)} />
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">Team Management</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">Manage who can post and recruit on behalf of {company.name}.</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" disabled={!isOwner}>
                        + Invite Member
                    </button>
                </div>

                <Card className="dark:bg-slate-800">
                     <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Current Team Members ({company.team.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {company.team.map(member => {
                            const user = users.find(u => u.id === member.userId);
                            if (!user) return null;

                            return (
                                <div key={member.userId} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                            {member.role}
                                        </span>
                                        <button className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50 disabled:no-underline" disabled={member.role === 'Owner' || !isOwner}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
            
            {isOwner && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Company Integrations</h2>
                     <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-5 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="text-slate-500 dark:text-slate-400"><ShieldCheckIcon /></div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Connect Your Workspace</h3>
                        </div>
                        <div className="p-5 divide-y divide-slate-200 dark:divide-slate-700">
                           <IntegrationRow provider="google" name="Google Workspace" icon={<GoogleIcon />} />
                           <IntegrationRow provider="microsoft" name="Microsoft 365" icon={<MicrosoftIcon />} />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CompanyTeam;