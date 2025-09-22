import React, { createContext, useState, useEffect } from 'react';
import type { User, Job, Conversation, Story, Event, ApplicantStatus, ChatMessage, Comment, AIAssistantAnalysis, SharedDashboard, Venture, Signal, SignalType, Feedback, Company, VenturePreferences, Notification, AIComparisonAnalysis } from '../types';
import { MOCK_USERS, MOCK_JOBS, MOCK_CONVERSATIONS, MOCK_STORIES, MOCK_UPCOMING_EVENTS, MOCK_CURRENT_USER_ID, MOCK_SHARED_DASHBOARDS, MOCK_VENTURES, MOCK_SIGNALS, MOCK_COMPANIES, MOCK_NOTIFICATIONS } from '../constants';
import { generateComparativeRejectionFeedback, generateRejectionFeedback, getAIAssistantAnalysis, generateAIComparison } from '../services/geminiApplicantService';

export interface ActiveProfile {
    type: 'user' | 'company';
    id: string;
    name: string;
}

interface IDataContext {
    users: User[];
    jobs: Job[];
    companies: Company[];
    conversations: Conversation[];
    stories: Story[];
    events: Event[];
    sharedDashboards: SharedDashboard[];
    ventures: Venture[];
    signals: Signal[];
    notifications: Notification[];
    currentUser: User | undefined;
    activeProfile: ActiveProfile;
    switchProfile: (type: 'user' | 'company', id: string) => void;
    addCompany: (companyData: Omit<Company, 'id' | 'team' | 'isVerified'>) => void;
    addJob: (job: Omit<Job, 'id' | 'posterId' | 'applicantDetails' | 'likes' | 'comments'>) => void;
    addStory: (story: Omit<Story, 'id' | 'authorId' | 'engagements' | 'likes' | 'comments' | 'shares' | 'readingTime'>) => void;
    addEvent: (event: Omit<Event, 'id' | 'authorId' | 'rsvps' | 'interestedAttendees'>) => void;
    addVenture: (venture: Omit<Venture, 'id' | 'ownerId' | 'interestedUsers' | 'expressedInterest' | 'firstBelievers' | 'signalIds' | 'acknowledgedBelievers'>) => void;
    updateVenture: (ventureId: string, updatedData: Partial<Omit<Venture, 'id'>>) => void;
    updateVenturePreferences: (ventureId: string, preferences: VenturePreferences) => void;
    addSignal: (ventureId: string, signalData: Omit<Signal, 'id' | 'ventureId' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'feedback'>) => void;
    voteOnSignalPoll: (signalId: string, optionIndex: number) => void;
    likeSignal: (signalId: string) => void;
    addFeedback: (signalId: string, feedbackData: { pros: string; cons: string; suggestion: string }) => void;
    addFirstBeliever: (ventureId: string) => void;
    acknowledgeFirstBeliever: (ventureId: string, userId: string) => void;
    userExpressesInterestInVenture: (ventureId: string, userId: string) => void;
    ventureExpressesInterestInUser: (ventureId: string, userId: string) => boolean; // Returns true on match
    addConnection: (userId: string, message?: string) => void;
    applyForJob: (jobId: string) => Promise<void>;
    rsvpToEvent: (eventId: string) => void;
    expressInterestInWalkInRole: (eventId: string, roleTitle: string) => void;
    markWalkInAttendee: (eventId: string, userId: string, attended: boolean) => void;
    addNoteToWalkInAttendee: (eventId: string, userId: string, notes: string) => void;
    rateApplicant: (jobId: string, applicantId: string, rating: number) => void;
    updateApplicantStatus: (jobId: string, applicantId: string, status: ApplicantStatus) => void;
    markApplicantAsReviewed: (jobId: string, applicantId: string) => void;
    findOrCreateConversation: (participantId: string) => Conversation;
    sendMessage: (conversationId: string, text: string, jobId?: string) => void;
    broadcastMessage: (ventureId: string, text: string) => void;
    likeItem: (itemId: string, itemType: 'job' | 'story') => void;
    addComment: (itemId: string, itemType: 'job' | 'story' | 'signal', text: string) => void;
    updateCurrentUserProfile: (updatedData: Partial<User>) => void;
    updateApplicantAiAnalysis: (jobId: string, analysisResults: { userId: string; rating: number; reasoning: string }[]) => void;
    updateJobStatus: (jobId: string, status: Job['status']) => void;
    updateEventStatus: (eventId: string, status: Event['status']) => void;
    updateStoryStatus: (storyId: string, status: Story['status']) => void;
    deleteStory: (storyId: string) => void;
    rejectApplicant: (jobId: string, applicantId: string) => Promise<void>;
    markMessagesAsRead: (jobId: string) => void;
    bulkUpdateApplicantStatus: (jobId: string, applicantIds: string[], status: ApplicantStatus) => void;
    bulkRejectApplicants: (jobId: string, applicantIds: string[]) => Promise<void>;
    saveAIAssistantAnalyses: (jobId: string, analyses: Array<{ userId: string } & AIAssistantAnalysis>) => void;
    toggleIntegration: (provider: 'google' | 'microsoft') => void;
    toggleCompanyIntegration: (companyId: string, provider: 'google' | 'microsoft') => void;
    scheduleInterview: (jobId: string, applicantId: string, details: { date: string; time: string; interviewers: string[]; videoLink?: string }) => void;
    sendBulkEmails: (jobId: string, applicantIds: string[], subject: string, body: string) => void;
    updatePhoneNumber: (phone: string) => void;
    verifyContact: (type: 'email' | 'phone', otp: string) => boolean;
    createSharedDashboard: (jobId: string, applicantUserIds: string[]) => SharedDashboard;
    markNotificationsAsRead: () => void;
    getAIComparisonAnalysis: (job: Job, candidates: User[]) => Promise<AIComparisonAnalysis>;
}

export const DataContext = createContext<IDataContext>({} as IDataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
    const [events, setEvents] = useState<Event[]>(MOCK_UPCOMING_EVENTS);
    const [sharedDashboards, setSharedDashboards] = useState<SharedDashboard[]>(MOCK_SHARED_DASHBOARDS);
    const [ventures, setVentures] = useState<Venture[]>(MOCK_VENTURES);
    const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    // One-time effect to process `firstBelieverFor`
    useEffect(() => {
        const usersWithBelieverData = MOCK_USERS.map(user => {
            const believerFor = MOCK_VENTURES
                .filter(venture => venture.firstBelievers.includes(user.id))
                .map(venture => venture.id);
            return { ...user, firstBelieverFor: believerFor };
        });
        setUsers(usersWithBelieverData);
    }, []);

    const currentUser = users.find(u => u.id === MOCK_CURRENT_USER_ID);

    const [activeProfile, setActiveProfile] = useState<ActiveProfile>(() => {
        const user = MOCK_USERS.find(u => u.id === MOCK_CURRENT_USER_ID);
        return {
            type: 'user',
            id: MOCK_CURRENT_USER_ID,
            name: user?.name || '',
        };
    });
    
    // --- NOTIFICATION LOGIC ---
    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random()}`,
            timestamp: 'Just now',
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    // Real-time notification simulator
    useEffect(() => {
        const interval = setInterval(() => {
            if (!currentUser) return;
            
            const otherUsers = users.filter(u => u.id !== currentUser.id);
            if(otherUsers.length === 0) return;

            const randomActor = otherUsers[Math.floor(Math.random() * otherUsers.length)];
            
            const rand = Math.random();
            if (rand < 0.33) { // New Application to one of my jobs
                const myJobs = jobs.filter(j => j.posterId === currentUser.id);
                if (myJobs.length > 0) {
                    const randomJob = myJobs[Math.floor(Math.random() * myJobs.length)];
                    addNotification({ type: 'APPLICATION', actorId: randomActor.id, targetId: randomJob.id, targetType: 'job' });
                }
            } else if (rand < 0.66) { // New Comment on one of my stories
                const myStories = stories.filter(s => s.authorId === currentUser.id);
                if (myStories.length > 0) {
                    const randomStory = myStories[Math.floor(Math.random() * myStories.length)];
                    addNotification({ type: 'COMMENT', actorId: randomActor.id, targetId: randomStory.id, targetType: 'story', message: 'This is a great story!' });
                }
            } else { // New Interest in one of my ventures
                const myVentures = ventures.filter(v => v.ownerId === currentUser.id);
                if(myVentures.length > 0) {
                    const randomVenture = myVentures[Math.floor(Math.random() * myVentures.length)];
                    addNotification({ type: 'INTEREST', actorId: randomActor.id, targetId: randomVenture.id, targetType: 'venture' });
                }
            }
        }, 20000); // every 20 seconds

        return () => clearInterval(interval);
    }, [users, jobs, stories, ventures, currentUser]);


    const switchProfile = (type: 'user' | 'company', id: string) => {
        if (type === 'user' && currentUser) {
            setActiveProfile({ type: 'user', id: currentUser.id, name: currentUser.name });
        } else if (type === 'company') {
            const company = companies.find(c => c.id === id);
            if (company) {
                setActiveProfile({ type: 'company', id: company.id, name: company.name });
            }
        }
    };

    const addCompany = (companyData: Omit<Company, 'id' | 'team' | 'isVerified'>) => {
        const newCompany: Company = {
            id: `company-${Date.now()}`,
            ...companyData,
            isVerified: false,
            team: [{ userId: MOCK_CURRENT_USER_ID, role: 'Owner' }],
        };
        setCompanies(prev => [...prev, newCompany]);
        setUsers(prevUsers => prevUsers.map(u =>
            u.id === MOCK_CURRENT_USER_ID
                ? { ...u, companyIds: [...(u.companyIds || []), newCompany.id] }
                : u
        ));
        switchProfile('company', newCompany.id);
    };

    const addJob = (jobData: Omit<Job, 'id' | 'posterId' | 'applicantDetails' | 'likes' | 'comments'>) => {
        if (activeProfile.type !== 'company') {
            console.error("Cannot add job when not in company profile mode.");
            return;
        }
        const newJob: Job = {
            id: `job-${Date.now()}`,
            ...jobData,
            posterId: MOCK_CURRENT_USER_ID,
            applicantDetails: [],
            likes: 0,
            comments: [],
        };
        setJobs(prev => [newJob, ...prev]);
    };

    const addStory = (storyData: Omit<Story, 'id' | 'authorId' | 'engagements' | 'likes' | 'comments' | 'shares' | 'readingTime'>) => {
        const newStory: Story = {
            id: `story-${Date.now()}`,
            ...storyData,
            authorId: activeProfile.type === 'user' ? activeProfile.id : MOCK_CURRENT_USER_ID,
            companyId: activeProfile.type === 'company' ? activeProfile.id : undefined,
            engagements: [],
            likes: 0,
            comments: [],
            shares: 0,
            readingTime: Math.ceil(storyData.content.split(' ').length / 200),
        };
        setStories(prev => [newStory, ...prev]);
    };

    const addEvent = (eventData: Omit<Event, 'id' | 'authorId' | 'rsvps' | 'interestedAttendees'>) => {
        const newEvent: Event = {
            id: `event-${Date.now()}`,
            ...eventData,
            authorId: activeProfile.type === 'user' ? activeProfile.id : MOCK_CURRENT_USER_ID,
            companyId: activeProfile.type === 'company' ? activeProfile.id : undefined,
            rsvps: [],
            interestedAttendees: [],
        };
        setEvents(prev => [newEvent, ...prev]);
    };

    const addVenture = (ventureData: Omit<Venture, 'id' | 'ownerId' | 'interestedUsers' | 'expressedInterest' | 'firstBelievers' | 'signalIds' | 'acknowledgedBelievers'>) => {
        const newVenture: Venture = {
            id: `venture-${Date.now()}`,
            ...ventureData,
            ownerId: MOCK_CURRENT_USER_ID,
            interestedUsers: [],
            expressedInterest: [],
            firstBelievers: [],
            acknowledgedBelievers: [],
            signalIds: [],
        };
        setVentures(prev => [...prev, newVenture]);
    };

    const updateVenture = (ventureId: string, updatedData: Partial<Omit<Venture, 'id'>>) => {
        setVentures(prevVentures => 
            prevVentures.map(v => 
                v.id === ventureId ? { ...v, ...updatedData } : v
            )
        );
    };

    const updateVenturePreferences = (ventureId: string, preferences: VenturePreferences) => {
        setVentures(prev => prev.map(v => v.id === ventureId ? { ...v, preferences } : v));
    };
    
    // FIX: Changed the function signature to match the IDataContext interface.
    const addSignal = (ventureId: string, signalData: Omit<Signal, 'id' | 'ventureId' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'feedback'>) => {
        const newSignal: Signal = {
            id: `signal-${Date.now()}`,
            ventureId: ventureId,
            authorId: MOCK_CURRENT_USER_ID,
            timestamp: 'Just now',
            likes: [],
            comments: [],
            ...signalData,
        };
        setSignals(prev => [newSignal, ...prev]);

        if (newSignal.isExclusive) {
            const venture = ventures.find(v => v.id === newSignal.ventureId);
            if (venture) {
                venture.firstBelievers.forEach(userId => {
                    addNotification({
                        type: 'EXCLUSIVE_CONTENT',
                        actorId: MOCK_CURRENT_USER_ID,
                        targetId: newSignal.ventureId,
                        targetType: 'venture',
                        message: `New exclusive content from ${venture.name}`
                    });
                });
            }
        }
    };

    const voteOnSignalPoll = (signalId: string, optionIndex: number) => {
        setSignals(prevSignals => prevSignals.map(signal => {
            if (signal.id === signalId && signal.pollOptions) {
                const newPollOptions = signal.pollOptions.map((opt, idx) => {
                    const newVotes = opt.votes.filter(voterId => voterId !== MOCK_CURRENT_USER_ID);
                    if (idx === optionIndex && !opt.votes.includes(MOCK_CURRENT_USER_ID)) {
                        newVotes.push(MOCK_CURRENT_USER_ID);
                    }
                    return { ...opt, votes: newVotes };
                });
                return { ...signal, pollOptions: newPollOptions };
            }
            return signal;
        }));
    };

    const likeSignal = (signalId: string) => {
        setSignals(prevSignals => prevSignals.map(signal => {
            if (signal.id === signalId) {
                const isLiked = signal.likes.includes(MOCK_CURRENT_USER_ID);
                const newLikes = isLiked
                    ? signal.likes.filter(id => id !== MOCK_CURRENT_USER_ID)
                    : [...signal.likes, MOCK_CURRENT_USER_ID];
                return { ...signal, likes: newLikes };
            }
            return signal;
        }));
    };

    const addFeedback = (signalId: string, feedbackData: { pros: string; cons: string; suggestion: string }) => {
        setSignals(prevSignals => prevSignals.map(signal => {
            if (signal.id === signalId) {
                const newFeedback: Feedback = {
                    id: `feedback-${Date.now()}`,
                    authorId: MOCK_CURRENT_USER_ID,
                    ...feedbackData,
                    timestamp: 'Just now',
                };
                const feedbackArray = signal.feedback ? [...signal.feedback, newFeedback] : [newFeedback];
                return { ...signal, feedback: feedbackArray };
            }
            return signal;
        }));
    };

    const addFirstBeliever = (ventureId: string) => {
        setVentures(prev => prev.map(v => {
            if (v.id === ventureId && !v.firstBelievers.includes(MOCK_CURRENT_USER_ID)) {
                return { ...v, firstBelievers: [...v.firstBelievers, MOCK_CURRENT_USER_ID] };
            }
            return v;
        }));
         setUsers(prev => prev.map(u => {
            if (u.id === MOCK_CURRENT_USER_ID) {
                const newBelieverFor = [...(u.firstBelieverFor || []), ventureId];
                return { ...u, firstBelieverFor: newBelieverFor };
            }
            return u;
        }));
    };
    
    const acknowledgeFirstBeliever = (ventureId: string, userId: string) => {
        setVentures(prev => prev.map(v => {
            if (v.id === ventureId && !v.acknowledgedBelievers.includes(userId)) {
                return { ...v, acknowledgedBelievers: [...v.acknowledgedBelievers, userId] };
            }
            return v;
        }));
    };

    const userExpressesInterestInVenture = (ventureId: string, userId: string) => {
        setVentures(prev => prev.map(v => {
            if (v.id === ventureId && !v.interestedUsers.includes(userId)) {
                addNotification({ type: 'INTEREST', actorId: userId, targetId: ventureId, targetType: 'venture' });
                return { ...v, interestedUsers: [...v.interestedUsers, userId] };
            }
            return v;
        }));
    };

    const ventureExpressesInterestInUser = (ventureId: string, userId: string): boolean => {
        let isMatch = false;
        setVentures(prev => prev.map(v => {
            if (v.id === ventureId && !v.expressedInterest.includes(userId)) {
                const venture = prev.find(p => p.id === ventureId);
                if (venture && venture.interestedUsers.includes(userId)) {
                    isMatch = true;
                    const newConversation = findOrCreateConversation(userId);
                    sendMessage(newConversation.id, `It's a match! You and ${venture.name} are both interested in collaborating. Start the conversation!`);
                    addNotification({ type: 'MATCH', actorId: venture.ownerId, targetId: venture.id, targetType: 'venture' });
                }
                return { ...v, expressedInterest: [...v.expressedInterest, userId] };
            }
            return v;
        }));
        return isMatch;
    };
    
    const addConnection = (userId: string) => {
        setUsers(prev => prev.map(u => {
            if (u.id === MOCK_CURRENT_USER_ID && !u.connections.includes(userId)) {
                return { ...u, connections: [...u.connections, userId] };
            }
            return u;
        }));
        alert(`Connection request sent to user ${userId}`);
    };
    
    const applyForJob = async (jobId: string): Promise<void> => {
        if (!currentUser) {
            alert("Current user not found.");
            return;
        }
        
        const job = jobs.find(j => j.id === jobId);
        const company = companies.find(c => c.id === job?.companyId);

        if (!job || !company) {
            alert("Job or company not found.");
            return;
        }

        // Check if already applied
        if (job.applicantDetails.some(a => a.userId === currentUser.id)) {
            alert("You have already applied for this job.");
            return;
        }

        // Add applicant to the list immediately for UI responsiveness
        addNotification({ type: 'APPLICATION', actorId: MOCK_CURRENT_USER_ID, targetId: jobId, targetType: 'job'});
        setJobs(prevJobs => prevJobs.map(j => {
            if (j.id === jobId) {
                return {
                    ...j,
                    applicantDetails: [...j.applicantDetails, { userId: currentUser.id, status: 'Applied', rating: 0, hasBeenReviewed: false }]
                };
            }
            return j;
        }));
        alert("Application submitted! The AI co-pilot is now analyzing your profile.");

        // Run AI analysis in the background
        try {
            const analysis = await getAIAssistantAnalysis(job, currentUser, company);
            saveAIAssistantAnalyses(jobId, [analysis]);
        } catch (error) {
            console.error("Background AI analysis failed:", error);
            // Optionally handle the error, e.g., show a silent notification to the user
        }
    };
    
    const rsvpToEvent = (eventId: string) => {
        setEvents(prev => prev.map(e => {
            if (e.id === eventId && !e.rsvps.includes(MOCK_CURRENT_USER_ID)) {
                addNotification({ type: 'RSVP', actorId: MOCK_CURRENT_USER_ID, targetId: eventId, targetType: 'event'});
                return { ...e, rsvps: [...e.rsvps, MOCK_CURRENT_USER_ID] };
            }
            return e;
        }));
    };

    const expressInterestInWalkInRole = (eventId: string, roleTitle: string) => {
        setEvents(prev => prev.map(e => {
            if (e.id === eventId && !e.interestedAttendees?.some(a => a.userId === MOCK_CURRENT_USER_ID)) {
                const newAttendee = { userId: MOCK_CURRENT_USER_ID, roleTitle };
                const updatedAttendees = [...(e.interestedAttendees || []), newAttendee];
                const updatedRsvps = e.rsvps.includes(MOCK_CURRENT_USER_ID) ? e.rsvps : [...e.rsvps, MOCK_CURRENT_USER_ID];
                return { ...e, interestedAttendees: updatedAttendees, rsvps: updatedRsvps };
            }
            return e;
        }));
        alert(`Your interest in the ${roleTitle} role has been noted!`);
    };

    const markWalkInAttendee = (eventId: string, userId: string, attended: boolean) => {
        setEvents(prev => prev.map(e => {
            if (e.id === eventId) {
                const updatedAttendees = e.interestedAttendees?.map(a => 
                    a.userId === userId ? { ...a, attended } : a
                );
                return { ...e, interestedAttendees: updatedAttendees };
            }
            return e;
        }));
    };

    const addNoteToWalkInAttendee = (eventId: string, userId: string, notes: string) => {
        setEvents(prev => prev.map(e => {
            if (e.id === eventId) {
                const updatedAttendees = e.interestedAttendees?.map(a => 
                    a.userId === userId ? { ...a, notes } : a
                );
                return { ...e, interestedAttendees: updatedAttendees };
            }
            return e;
        }));
    };
    
    const rateApplicant = (jobId: string, applicantId: string, rating: number) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantDetails: j.applicantDetails.map(a => a.userId === applicantId ? { ...a, rating } : a) } : j));
    };

    const updateApplicantStatus = (jobId: string, applicantId: string, newStatus: ApplicantStatus) => {
        setJobs(prev => prev.map(job => {
            if (job.id === jobId) {
                const isNewStatusInterview = job.interviewRounds.map(r => r.name).includes(newStatus);
                return {
                    ...job,
                    applicantDetails: job.applicantDetails.map(applicant => {
                        if (applicant.userId === applicantId) {
                            const updatedApplicant = { ...applicant, status: newStatus };
                            // If the new status is NOT an interview stage, clear any scheduled interview details.
                            if (!isNewStatusInterview) {
                                delete updatedApplicant.scheduledInterview;
                            }
                            // Clear AI suggestion after a status change
                            updatedApplicant.aiSuggestion = null;
                            return updatedApplicant;
                        }
                        return applicant;
                    })
                };
            }
            return job;
        }));
    };

    const markApplicantAsReviewed = (jobId: string, applicantId: string) => {
        setJobs(prev => prev.map(j => {
            if (j.id === jobId) {
                return {
                    ...j,
                    applicantDetails: j.applicantDetails.map(a => 
                        a.userId === applicantId ? { ...a, hasBeenReviewed: true } : a
                    )
                };
            }
            return j;
        }));
    };

    const findOrCreateConversation = (participantId: string): Conversation => {
        let conversation = conversations.find(c => c.participantIds.includes(MOCK_CURRENT_USER_ID) && c.participantIds.includes(participantId));
        if (!conversation) {
            conversation = {
                id: `conv-${Date.now()}`,
                participantIds: [MOCK_CURRENT_USER_ID, participantId],
                messages: [],
            };
            setConversations(prev => [...prev, conversation!]);
        }
        return conversation;
    };
    
    const sendMessage = (conversationId: string, text: string, jobId?: string) => {
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: MOCK_CURRENT_USER_ID,
            text,
            timestamp: 'Just now',
            jobId,
            isRead: false,
        };
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c));
    };

    const broadcastMessage = (ventureId: string, text: string) => {
        const venture = ventures.find(v => v.id === ventureId);
        if (venture) {
            venture.firstBelievers.forEach(userId => {
                const conversation = findOrCreateConversation(userId);
                sendMessage(conversation.id, `Update from ${venture.name}:\n\n${text}`);
            });
        }
    };
    
    const likeItem = (itemId: string, itemType: 'job' | 'story') => {
        if (itemType === 'job') {
            setJobs(prev => prev.map(j => j.id === itemId ? { ...j, likes: j.likes + 1 } : j));
        } else {
            setStories(prev => prev.map(s => s.id === itemId ? { ...s, likes: s.likes + 1 } : s));
        }
    };
    
    const addComment = (itemId: string, itemType: 'job' | 'story' | 'signal', text: string) => {
        const newComment: Comment = { id: `comment-${Date.now()}`, authorId: MOCK_CURRENT_USER_ID, text, timestamp: 'Just now' };
        if (itemType === 'job') setJobs(prev => prev.map(j => j.id === itemId ? { ...j, comments: [...j.comments, newComment] } : j));
        if (itemType === 'story') setStories(prev => prev.map(s => s.id === itemId ? { ...s, comments: [...s.comments, newComment] } : s));
        if (itemType === 'signal') setSignals(prev => prev.map(s => s.id === itemId ? { ...s, comments: [...s.comments, newComment] } : s));
    };

    const updateCurrentUserProfile = (updatedData: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === MOCK_CURRENT_USER_ID ? { ...u, ...updatedData } : u));
    };
    
    const updateApplicantAiAnalysis = (jobId: string, analysisResults: { userId: string; rating: number; reasoning: string }[]) => {
       setJobs(prevJobs => prevJobs.map(j => {
           if(j.id === jobId) {
               const newApplicantDetails = j.applicantDetails.map(ad => {
                   const result = analysisResults.find(res => res.userId === ad.userId);
                   return result ? { ...ad, rating: result.rating, aiReasoning: result.reasoning } : ad;
               });
               return { ...j, applicantDetails: newApplicantDetails };
           }
           return j;
       }));
    };
    
    const updateJobStatus = (jobId: string, status: Job['status']) => setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    const updateEventStatus = (eventId: string, status: Event['status']) => setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));
    const updateStoryStatus = (storyId: string, status: Story['status']) => setStories(prev => prev.map(s => s.id === storyId ? { ...s, status } : s));
    const deleteStory = (storyId: string) => setStories(prev => prev.filter(s => s.id !== storyId));
    
    const rejectApplicant = async (jobId: string, applicantId: string): Promise<void> => {
        const job = jobs.find(j => j.id === jobId);
        const applicant = users.find(u => u.id === applicantId);
        if (!job || !applicant) return;
        const successfulApplicants = users.filter(u => job.applicantDetails.some(ad => ad.userId === u.id && (ad.status === 'Hired' || ad.status === 'Shortlisted')));
        const feedback = successfulApplicants.length > 0 ? await generateComparativeRejectionFeedback(job, applicant, successfulApplicants) : await generateRejectionFeedback(job, applicant);
        updateApplicantStatus(jobId, applicantId, 'Rejected');
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantDetails: j.applicantDetails.map(a => a.userId === applicantId ? { ...a, aiReasoning: feedback } : a) } : j));
    };
    
    const markMessagesAsRead = (jobId: string) => {
        setConversations(prev => prev.map(c => ({ ...c, messages: c.messages.map(m => m.jobId === jobId && m.senderId !== MOCK_CURRENT_USER_ID ? { ...m, isRead: true } : m) })));
    };
    
    const bulkUpdateApplicantStatus = (jobId: string, applicantIds: string[], status: ApplicantStatus) => {
        applicantIds.forEach(applicantId => {
            updateApplicantStatus(jobId, applicantId, status);
        });
    };

    const bulkRejectApplicants = async (jobId: string, applicantIds: string[]) => {
        applicantIds.forEach(id => rejectApplicant(jobId, id));
    };
    
    const saveAIAssistantAnalyses = (jobId: string, analyses: Array<{ userId: string } & AIAssistantAnalysis>) => {
        setJobs(prev => prev.map(j => {
            if (j.id === jobId) {
                const newDetails = j.applicantDetails.map(ad => {
                    const analysis = analyses.find(an => an.userId === ad.userId);
                    return analysis ? { ...ad, aiAssistantAnalysis: analysis, rating: Math.round(analysis.fitScore / 20), aiSuggestion: analysis.aiSuggestion } : ad;
                });
                return { ...j, applicantDetails: newDetails };
            }
            return j;
        }));
    };
    
    const toggleIntegration = (provider: 'google' | 'microsoft') => {
        setUsers(prev => prev.map(u => u.id === MOCK_CURRENT_USER_ID ? { ...u, integrations: { ...u.integrations, [provider]: !u.integrations?.[provider] } } : u));
    };
    
    const toggleCompanyIntegration = (companyId: string, provider: 'google' | 'microsoft') => {
        setCompanies(prev => prev.map(c => 
            c.id === companyId 
                ? { ...c, integrations: { ...c.integrations, [provider]: !c.integrations?.[provider] } } 
                : c
        ));
    };

    const scheduleInterview = (jobId: string, applicantId: string, details: { date: string; time: string; interviewers: string[]; videoLink?: string }) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantDetails: j.applicantDetails.map(ad => ad.userId === applicantId ? { ...ad, scheduledInterview: details } : ad) } : j));
    };
    
    const sendBulkEmails = (jobId: string, applicantIds: string[], subject: string, body: string) => {
         const job = jobs.find(j => j.id === jobId);
         if (!job) return;
         const company = companies.find(c => c.id === job.companyId);
         applicantIds.forEach(id => {
             const user = users.find(u => u.id === id);
             if (user) {
                 const personalizedBody = body.replace(/{applicantName}/g, user.name.split(' ')[0]).replace(/{jobTitle}/g, job.title).replace(/{companyName}/g, company?.name || '').replace(/{recruiterName}/g, currentUser?.name || '');
                 const conversation = findOrCreateConversation(id);
                 sendMessage(conversation.id, personalizedBody, jobId);
             }
         });
         alert(`Emails sent to ${applicantIds.length} applicants.`);
    };

    const updatePhoneNumber = (phone: string) => {
        setUsers(prev => prev.map(u => u.id === MOCK_CURRENT_USER_ID ? { ...u, phone, phoneVerified: false } : u));
    };

    const verifyContact = (type: 'email' | 'phone', otp: string): boolean => {
        if (otp === '123456') {
            setUsers(prev => prev.map(u => u.id === MOCK_CURRENT_USER_ID ? { ...u, [`${type}Verified`]: true } : u));
            return true;
        }
        return false;
    };

    const createSharedDashboard = (jobId: string, applicantUserIds: string[]): SharedDashboard => {
        const newDashboard: SharedDashboard = { id: `dash-${Date.now()}`, jobId, applicantUserIds, createdAt: new Date().toISOString() };
        setSharedDashboards(prev => [...prev, newDashboard]);
        return newDashboard;
    };
    
    const getAIComparisonAnalysis = async (job: Job, candidates: User[]): Promise<AIComparisonAnalysis> => {
        return await generateAIComparison(job, candidates);
    };

    const value: IDataContext = {
        users, jobs, companies, conversations, stories, events, sharedDashboards, ventures, signals, notifications, currentUser, activeProfile,
        switchProfile, addCompany, addJob, addStory, addEvent, addVenture, updateVenture, updateVenturePreferences, addSignal, voteOnSignalPoll, likeSignal, addFeedback,
        addFirstBeliever, acknowledgeFirstBeliever, userExpressesInterestInVenture, ventureExpressesInterestInUser, addConnection, applyForJob,
        rsvpToEvent, expressInterestInWalkInRole, markWalkInAttendee, addNoteToWalkInAttendee, rateApplicant, updateApplicantStatus, markApplicantAsReviewed, findOrCreateConversation, sendMessage, broadcastMessage, likeItem, addComment,
        updateCurrentUserProfile, updateApplicantAiAnalysis, updateJobStatus, updateEventStatus, updateStoryStatus, deleteStory,
        rejectApplicant, markMessagesAsRead, bulkUpdateApplicantStatus, bulkRejectApplicants, saveAIAssistantAnalyses,
        toggleIntegration, toggleCompanyIntegration, scheduleInterview, sendBulkEmails, updatePhoneNumber, verifyContact, createSharedDashboard,
        markNotificationsAsRead, getAIComparisonAnalysis
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};