import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/common/Card';
import ToggleSwitch from '../components/common/ToggleSwitch';
import { ThemeIcon, SettingsProfileIcon, SettingsNotificationIcon, SettingsPrivacyIcon, GoogleIcon, MicrosoftIcon, ShieldCheckIcon, CheckBadgeIcon } from '../components/common/Icons';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import AddPhoneModal from '../components/settings/AddPhoneModal';
import VerifyOtpModal from '../components/settings/VerifyOtpModal';

const Settings: React.FC = () => {
    const { currentUser, toggleIntegration } = useContext(DataContext);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    // Modal states
    const [isAddPhoneModalOpen, setIsAddPhoneModalOpen] = useState(false);
    const [verifyModal, setVerifyModal] = useState<{ isOpen: boolean; type: 'email' | 'phone' | null }>({ isOpen: false, type: null });

    // Mock state for toggles
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [inAppEnabled, setInAppEnabled] = useState(true);
    const [visibilityEnabled, setVisibilityEnabled] = useState(true);
    const [dataSharingEnabled, setDataSharingEnabled] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const handlePhoneAdded = () => {
        setIsAddPhoneModalOpen(false);
        setVerifyModal({ isOpen: true, type: 'phone' });
    };

    const SectionCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
            <div className="p-5 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700">
                <div className="text-slate-500 dark:text-slate-400">{icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            </div>
            <div className="p-5 divide-y divide-slate-200 dark:divide-slate-700">
                {children}
            </div>
        </Card>
    );

    const SettingRow: React.FC<{ label: string, description: string, children: React.ReactNode }> = ({ label, description, children }) => (
        <div className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
            <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
            <div>{children}</div>
        </div>
    );

    const IntegrationRow: React.FC<{ provider: 'google' | 'microsoft', name: string, icon: React.ReactNode }> = ({ provider, name, icon }) => {
        const isConnected = currentUser?.integrations?.[provider] || false;
    
        return (
            <div className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{name}</p>
                        {isConnected && currentUser?.email && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                        )}
                    </div>
                </div>
                {isConnected ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleIntegration(provider)}
                            className="px-3 py-1 text-xs font-semibold bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-300"
                        >
                            Disconnect
                        </button>
                        <button
                            onClick={() => alert("This would open a prompt to connect another account.")}
                            className="px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-900/50"
                        >
                            Add Account
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => toggleIntegration(provider)}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Connect
                    </button>
                )}
            </div>
        );
    };

    if (!currentUser) return null;

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Settings</h1>
                <div className="space-y-8">
                    {/* Login & Security */}
                    <SectionCard icon={<ShieldCheckIcon />} title="Login & Security">
                        <SettingRow label="Email Address" description={currentUser.email || 'No email set'}>
                            {currentUser.emailVerified ? (
                                <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                    <CheckBadgeIcon /> Verified
                                </div>
                            ) : (
                                <button onClick={() => setVerifyModal({ isOpen: true, type: 'email' })} className="px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50">
                                    Verify
                                </button>
                            )}
                        </SettingRow>
                        <SettingRow label="Phone Number" description={currentUser.phone || 'Not provided'}>
                            {currentUser.phone ? (
                                currentUser.phoneVerified ? (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                        <CheckBadgeIcon /> Verified
                                    </div>
                                ) : (
                                    <button onClick={() => setVerifyModal({ isOpen: true, type: 'phone' })} className="px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50">
                                        Verify
                                    </button>
                                )
                            ) : (
                                <button onClick={() => setIsAddPhoneModalOpen(true)} className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200">
                                    Add Phone
                                </button>
                            )}
                        </SettingRow>
                    </SectionCard>

                    {/* Integration Settings */}
                    <SectionCard icon={<SettingsProfileIcon />} title="Integrations">
                        <IntegrationRow provider="google" name="Google Calendar" icon={<GoogleIcon />} />
                        <IntegrationRow provider="microsoft" name="Microsoft Outlook" icon={<MicrosoftIcon />} />
                    </SectionCard>
                    
                    {/* Theme Settings */}
                    <SectionCard icon={<ThemeIcon />} title="Appearance">
                        <SettingRow label="Dark Mode" description="Switch between light and dark themes.">
                            <ToggleSwitch isEnabled={theme === 'dark'} onToggle={toggleTheme} />
                        </SettingRow>
                    </SectionCard>
                    
                    {/* Profile Settings */}
                     <SectionCard icon={<SettingsProfileIcon />} title="Profile Settings">
                        <SettingRow label="Edit Your Profile" description="Update your skills, experience, and vision.">
                            <Link to={`/profile/${currentUser.id}`} className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition">
                                Edit
                            </Link>
                        </SettingRow>
                    </SectionCard>

                    {/* Notification Settings */}
                    <SectionCard icon={<SettingsNotificationIcon />} title="Notifications">
                        <SettingRow label="Email Notifications" description="Receive updates about your network and jobs.">
                            <ToggleSwitch isEnabled={emailEnabled} onToggle={() => setEmailEnabled(p => !p)} />
                        </SettingRow>
                         <SettingRow label="In-App Notifications" description="Show alerts for messages and connections.">
                            <ToggleSwitch isEnabled={inAppEnabled} onToggle={() => setInAppEnabled(p => !p)} />
                        </SettingRow>
                    </SectionCard>

                    {/* Privacy Settings */}
                    <SectionCard icon={<SettingsPrivacyIcon />} title="Privacy">
                        <SettingRow label="Profile Visibility" description="Allow your profile to be discovered by others.">
                            <ToggleSwitch isEnabled={visibilityEnabled} onToggle={() => setVisibilityEnabled(p => !p)} />
                        </SettingRow>
                        <SettingRow label="Share Data with Partners" description="Help us improve our services.">
                             <ToggleSwitch isEnabled={dataSharingEnabled} onToggle={() => setDataSharingEnabled(p => !p)} />
                        </SettingRow>
                    </SectionCard>
                </div>
            </div>

            <AddPhoneModal 
                isOpen={isAddPhoneModalOpen}
                onClose={() => setIsAddPhoneModalOpen(false)}
                onSuccess={handlePhoneAdded}
            />

            <VerifyOtpModal
                isOpen={verifyModal.isOpen}
                onClose={() => setVerifyModal({ isOpen: false, type: null })}
                contactType={verifyModal.type}
            />
        </>
    );
};

export default Settings;