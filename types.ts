// Reconstructing from constants.ts and adding Venture/Interest
export interface User {
  id: string;
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  vision: string;
  skills: string[];
  experience: Experience[];
  portfolio: Project[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  connections: string[];
  integrations?: {
    google?: boolean;
    microsoft?: boolean;
  };
  ventureIds?: string[];
  companyIds?: string[]; // Companies this user can manage
  firstBelieverFor?: string[]; // Array of ventureIds
}

export interface TeamMember {
    userId: string;
    role: 'Owner' | 'Admin' | 'Recruiter';
}

export interface Company {
    id: string;
    name: string;
    logoUrl: string;
    tagline: string;
    website: string;
    location: string;
    industry: string;
    size: string;
    about: string;
    vision: string;
    isVerified: boolean;
    team: TeamMember[];
    integrations?: {
        google?: boolean;
        microsoft?: boolean;
    };
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  url: string;
  isFeatured?: boolean;
  imageUrl?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: string;
  status: 'Open' | 'Closed';
  description: string;
  skills: string[];
  posterId: string;
  applicantDetails: ApplicantDetails[];
  likes: number;
  comments: Comment[];
  salaryRange?: string;
  experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  interviewRounds: InterviewRound[];
}

export interface ApplicantDetails {
  userId: string;
  status: ApplicantStatus;
  rating: number;
  aiReasoning?: string;
  aiAssistantAnalysis?: AIAssistantAnalysis;
  scheduledInterview?: {
    date: string;
    time: string;
    interviewers: string[];
    videoLink?: string;
  };
  aiSuggestion?: 'shortlist' | 'reject' | null;
  hasBeenReviewed?: boolean;
}

export type ApplicantStatus = 'Applied' | 'Shortlisted' | 'Technical Interview' | 'Founder Chat' | 'Hired' | 'Rejected' | string; // string for custom interview rounds

export interface Comment {
    id: string;
    authorId: string;
    text: string;
    timestamp: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  jobId?: string;
  isRead: boolean;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  companyId?: string;
  imageUrl: string;
  engagements: string[];
  likes: number;
  comments: Comment[];
  shares: number;
  category: 'Founder Journey' | 'Tech Deep Dive' | 'Growth Hacking' | 'Design Thinking' | 'Opinion';
  tags: string[];
  readingTime: number;
  status: 'Published' | 'Archived';
}

export interface Startup {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  vision: string;
}

export interface JobSlot {
  title: string;
  description: string;
  skills: string[];
}

export interface InterestedAttendee {
    userId: string;
    roleTitle: string;
    attended?: boolean;
    notes?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'Webinar' | 'Meetup' | 'Conference' | 'Walk-in Interview';
  location: string;
  description: string;
  authorId: string;
  companyId?: string;
  rsvps: string[];
  speakers?: Speaker[];
  agenda?: AgendaItem[];
  coverImageUrl?: string;
  totalSlots?: number;
  address?: string;
  directionsUrl?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  jobSlots?: JobSlot[];
  interestedAttendees?: InterestedAttendee[];
}

export interface Speaker {
  name: string;
  title: string;
  avatarUrl?: string;
}

export interface AgendaItem {
  time: string;
  topic: string;
}

export interface MessageTemplate {
  subject: string;
  body: (applicantName: string, jobTitle: string, companyName: string) => string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

export interface SharedDashboard {
    id: string;
    jobId: string;
    applicantUserIds: string[];
    createdAt: string;
}

export interface InterviewRound {
    name: string;
    description: string;
}

export interface AIChatSession {
    id: string;
    title: string;
    messages: AIChatMessage[];
}
export interface AIChatMessage {
    sender: 'user' | 'ai';
    content: React.ReactNode;
}

export interface AIResponse {
    jobs: { reasoning: string; ids: string[] } | null;
    people: { summary: string; ids: string[] } | null;
    events: { summary: string; ids: string[] } | null;
    general: { responseText: string } | null;
}

export interface AIShortlistPrediction {
    probability: number;
    reasoning: string;
}

export interface AIAssistantAnalysis {
    fitScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    skillValidation: Array<{
        skill: string;
        hasEvidence: boolean;
        evidence: string;
    }>;
    projectDeepDive: string;
    cultureAlignment: string;
    interviewQuestions: string[];
    aiSuggestion?: 'shortlist' | 'reject' | null;
}

export interface AIComparisonAnalysis {
    summary: string;
    recommendation: {
        userId: string;
        reasoning: string;
    };
    candidateBreakdowns: Array<{
        userId: string;
        strengths: string[];
        weaknesses: string[];
    }>;
}

export interface VenturePreferences {
    skills: string[];
    location: string;
}

// Venture related types
export interface Venture {
  id: string;
  ownerId: string;
  name: string;
  logoUrl: string;
  tagline: string;
  vision: string;
  problem: string;
  solution: string;
  market: string[];
  stage: 'Idea' | 'Prototype' | 'Early Traction';
  seeking: string[];
  interestedUsers: string[]; // array of userIds
  expressedInterest: string[]; // array of userIds the venture is interested in
  firstBelievers: string[]; // array of userIds who want to be early users
  acknowledgedBelievers: string[]; // array of userIds the founder has acknowledged
  signalIds: string[]; // array of signalIds
  preferences?: VenturePreferences;
  prototypeLink?: string;
  ideaLink?: string;
  imageUrls?: string[];
}

export type SignalType = 'update' | 'question' | 'poll';

export interface PollOption {
    text: string;
    votes: string[]; // array of userIds
}

export interface Feedback {
    id: string;
    authorId: string;
    pros: string;
    cons: string;
    suggestion: string;
    timestamp: string;
}

export interface Signal {
    id: string;
    ventureId: string;
    authorId: string;
    type: SignalType;
    content: string;
    timestamp: string;
    isExclusive?: boolean;
    pollOptions?: PollOption[];
    likes: string[]; // array of userIds
    comments: Comment[];
    feedback?: Feedback[];
}

// Notification types
export type NotificationType =
  | 'APPLICATION' // Someone applied to your job
  | 'COMMENT'     // Someone commented on your post (job, story, signal)
  | 'MATCH'       // You have a new co-founder match for your venture
  | 'INTEREST'    // Someone is interested in your venture
  | 'RSVP'        // Someone RSVP'd to your event
  | 'MESSAGE'     // You have a new message
  | 'EXCLUSIVE_CONTENT'; // New exclusive content for first believers

export interface Notification {
  id: string;
  type: NotificationType;
  actorId: string; // Who performed the action (e.g., the applicant)
  timestamp: string;
  isRead: boolean;
  targetId?: string; // ID of the item being acted on (e.g., job ID)
  targetType?: 'job' | 'story' | 'signal' | 'venture' | 'event' | 'conversation';
  message?: string; // Optional custom message for comment notifications
}