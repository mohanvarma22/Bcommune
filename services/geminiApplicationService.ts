import { GoogleGenAI, Type } from "@google/genai";
import type { Job, User, AIShortlistPrediction } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

type AnalysisResult = {
    userId: string;
    rating: number;
    reasoning: string;
};

/**
 * Uses Gemini to analyze a list of applicants for a specific job.
 * @param job The job posting.
 * @param applicants An array of user profiles for the applicants.
 * @returns A promise that resolves to an array of analysis results.
 */
export async function analyzeApplicantsWithAI(job: Job, applicants: User[]): Promise<AnalysisResult[]> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }
    
    // Create concise summaries to send to the API
    const jobSummary = {
        title: job.title,
        description: job.description.substring(0, 300) + '...',
        requiredSkills: job.skills,
        responsibilities: job.responsibilities,
    };
    
    const applicantSummaries = applicants.map(applicant => ({
        userId: applicant.id,
        title: applicant.title,
        skills: applicant.skills,
        experience: applicant.experience.map(exp => `${exp.role} at ${exp.company}: ${exp.description.substring(0,100)}...`).join('; '),
    }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Job Details:
            ${JSON.stringify(jobSummary)}

            Applicant Profiles:
            ${JSON.stringify(applicantSummaries)}
            `,
            config: {
                systemInstruction: `You are an expert AI recruitment assistant. Your task is to analyze a list of applicants for a specific job. For each applicant, you must provide:
                1.  A 'rating' from 1 to 5 stars, where 5 is a perfect match.
                2.  A concise 'reasoning' (1-2 sentences) explaining why you gave that rating, comparing the applicant's skills and experience to the job requirements.
                You MUST return a JSON object with a single key "analysis" which is an array of objects, each containing "userId", "rating", and "reasoning".`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    userId: { type: Type.STRING },
                                    rating: { type: Type.INTEGER, description: "A rating from 1 to 5." },
                                    reasoning: { type: Type.STRING, description: "A brief explanation for the rating." },
                                },
                            },
                        },
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && Array.isArray(result.analysis)) {
            return result.analysis;
        }

        return [];

    } catch (error) {
        console.error("Error calling Gemini API for applicant analysis:", error);
        throw new Error("Failed to perform AI analysis. Please check your API key and try again.");
    }
}


/**
 * Uses Gemini to predict the shortlist probability for a user for a specific job.
 * @param job The job posting.
 * @param user The user profile.
 * @returns A promise that resolves to an AI shortlist prediction object.
 */
export async function getShortlistProbability(job: Job, user: User): Promise<AIShortlistPrediction> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }

    const jobSummary = {
        title: job.title,
        description: job.description.substring(0, 300) + '...',
        requiredSkills: job.skills,
        qualifications: job.qualifications,
    };

    const userSummary = {
        title: user.title,
        skills: user.skills,
        experience: user.experience.map(exp => `${exp.role} at ${exp.company}`).join(', '),
        vision: user.vision,
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the user's profile against the job description.
            
            Job Details:
            ${JSON.stringify(jobSummary)}

            User Profile:
            ${JSON.stringify(userSummary)}
            `,
            config: {
                systemInstruction: `You are an expert AI career coach. Your task is to predict the probability of a user getting shortlisted for a job and provide a brief justification.
                1.  **probability**: An integer between 0 and 100 representing the chance of being shortlisted.
                2.  **reasoning**: A concise, 1-2 sentence explanation for the probability score, highlighting strengths and weaknesses.
                You MUST return a JSON object with "probability" and "reasoning" keys.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        probability: {
                            type: Type.INTEGER,
                            description: "The probability (0-100) of being shortlisted."
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "A concise reason for the given probability."
                        },
                    },
                    required: ["probability", "reasoning"],
                },
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && typeof result.probability === 'number' && typeof result.reasoning === 'string') {
            return result as AIShortlistPrediction;
        }

        throw new Error("Invalid AI response format.");
    } catch (error) {
        console.error("Error calling Gemini API for shortlist prediction:", error);
        throw new Error("Failed to get AI prediction. Please check your API key.");
    }
}

/**
 * Generates rejection feedback by comparing a rejected applicant to successful ones.
 * @param job The job posting.
 * @param rejectedApplicant The user profile of the rejected applicant.
 * @param successfulApplicants An array of user profiles for successful applicants.
 * @returns A promise that resolves to a string of constructive feedback.
 */
export async function generateComparativeRejectionFeedback(job: Job, rejectedApplicant: User, successfulApplicants: User[]): Promise<string> {
    if (!process.env.API_KEY) throw new Error("API_KEY is not configured.");

    const jobSummary = { title: job.title, requiredSkills: job.skills, description: job.description.substring(0, 200) };
    const rejectedSummary = { skills: rejectedApplicant.skills, experience: rejectedApplicant.experience.map(e => e.role).join(', ') };
    const successfulSummaries = successfulApplicants.slice(0, 3).map(u => ({ skills: u.skills, experience: u.experience.map(e => e.role).join(', ') }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Job Details: ${JSON.stringify(jobSummary)}
            Rejected Applicant: ${JSON.stringify(rejectedSummary)}
            Successful Applicants: ${JSON.stringify(successfulSummaries)}`,
            config: {
                systemInstruction: `You are an expert, empathetic recruitment advisor. Your goal is to provide high-quality, transparent, and constructive feedback to a rejected job applicant.

                Your task is to:
                1.  **Compare** the rejected applicant's profile to the profiles of the successful applicants.
                2.  **Identify the single most significant differentiator** that led to the decision. This could be a specific required skill they lacked, less years of relevant experience, or a weaker alignment with the company's domain (e.g., fintech, healthtech).
                3.  **Craft a 1-2 sentence feedback message** that is polite, direct, and constructive.
                    - **DO NOT** be generic (e.g., "we found more qualified candidates").
                    - **DO** be specific about the differentiator.
                    - **DO NOT** mention the other candidates directly. Frame it as what the "hiring team prioritized".
                    - **Start** with a positive note if possible.

                **Excellent Example:** "While your experience in UI/UX design is impressive, the hiring team ultimately prioritized candidates who demonstrated deep, hands-on experience with Next.js, which was a core requirement for this particular role."

                Return only the feedback text as a single string.`,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating comparative feedback:", error);
        return "After careful consideration, the team has decided to move forward with other candidates whose experience more closely matched the specific requirements of the role at this time.";
    }
}

/**
 * Generates rejection feedback based on a single applicant's fit for a job.
 * @param job The job posting.
 * @param rejectedApplicant The user profile of the rejected applicant.
 * @returns A promise that resolves to a string of constructive feedback.
 */
export async function generateRejectionFeedback(job: Job, rejectedApplicant: User): Promise<string> {
    if (!process.env.API_KEY) throw new Error("API_KEY is not configured.");

    const jobSummary = { title: job.title, requiredSkills: job.skills, description: job.description.substring(0, 200) };
    const rejectedSummary = { skills: rejectedApplicant.skills, experience: rejectedApplicant.experience.map(e => e.role).join(', ') };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Job Details: ${JSON.stringify(jobSummary)}
            Applicant Profile: ${JSON.stringify(rejectedSummary)}`,
            config: {
                systemInstruction: `You are an empathetic recruitment advisor. Your task is to provide constructive feedback to a rejected applicant.
                1.  Analyze the 'Applicant Profile' against the 'Job Details'.
                2.  Identify the most significant skill or experience gap.
                3.  Provide a polite, constructive, 1-2 sentence feedback explaining this gap.

                **Excellent Example:** "Thank you for your application. For this role, the hiring team was looking for candidates with deeper experience in backend technologies like Django, which was a key requirement."

                Return only the feedback text as a single string.`,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating feedback:", error);
        return "After careful consideration, the team has decided to move forward with other candidates whose experience more closely matched the requirements of the role at this time.";
    }
}
