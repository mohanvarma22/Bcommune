import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import Company type
import type { Job, User, AIShortlistPrediction, AIAssistantAnalysis, Company, AIComparisonAnalysis } from '../types';

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


/**
 * Generates a deep, multi-faceted analysis of a single applicant.
 * @param job The job posting.
 * @param applicant The user profile of the applicant.
 * @param company The company profile for the job.
 * @returns A promise resolving to a detailed analysis object.
 */
// FIX: Add company parameter to access companyVision
export async function getAIAssistantAnalysis(job: Job, applicant: User, company: Company): Promise<AIAssistantAnalysis & { userId: string }> {
    if (!process.env.API_KEY) throw new Error("API_KEY is not configured.");

    const jobSummary = {
        title: job.title,
        // FIX: Use company.vision instead of non-existent job.companyVision
        companyVision: company.vision,
        requiredSkills: job.skills,
        description: job.description.substring(0, 300),
    };

    const applicantSummary = {
        userId: applicant.id,
        title: applicant.title,
        skills: applicant.skills,
        experience: applicant.experience.map(e => `${e.role}: ${e.description.substring(0, 100)}...`).join('; '),
        portfolio: applicant.portfolio.map(p => `${p.name}: ${p.description.substring(0, 100)}...`).join('; '),
        vision: applicant.vision,
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Job Posting: ${JSON.stringify(jobSummary)}\n\nApplicant Profile: ${JSON.stringify(applicantSummary)}`,
            config: {
                systemInstruction: `You are an elite senior technical recruiter and hiring co-pilot. Analyze the applicant's profile against the job posting and provide a detailed, structured JSON response.

                You MUST return a single JSON object with the following structure:
                1.  "userId": The applicant's ID.
                2.  "fitScore": An integer from 0-100 indicating overall role fit.
                3.  "summary": A 1-2 sentence executive summary of the candidate's fit.
                4.  "strengths": An array of 2-3 short strings highlighting the applicant's key strengths for this specific role.
                5.  "weaknesses": An array of 1-2 short strings highlighting potential weaknesses or areas to probe in an interview.
                6.  "skillValidation": An array of objects. For each of the job's required skills, validate if the applicant has it. The object should have "skill", "hasEvidence" (boolean), and "evidence" (a short string quoting their experience or project that proves the skill). If no evidence, state "No direct evidence found."
                7.  "projectDeepDive": A 1-2 sentence analysis of how their portfolio projects relate to the job requirements.
                8.  "cultureAlignment": A 1-2 sentence analysis comparing the applicant's "vision" statement to the company's vision.
                9.  "interviewQuestions": An array of 2-3 specific, insightful interview questions to ask this candidate based on their profile.
                10. "aiSuggestion": Based on the fitScore, provide a suggestion. If fitScore >= 85, suggest "shortlist". If fitScore < 50, suggest "reject". Otherwise, null.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        userId: { type: Type.STRING },
                        fitScore: { type: Type.INTEGER },
                        summary: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        skillValidation: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    skill: { type: Type.STRING },
                                    hasEvidence: { type: Type.BOOLEAN },
                                    evidence: { type: Type.STRING },
                                },
                                required: ["skill", "hasEvidence", "evidence"],
                            },
                        },
                        projectDeepDive: { type: Type.STRING },
                        cultureAlignment: { type: Type.STRING },
                        interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        aiSuggestion: { type: Type.STRING, nullable: true },
                    },
                    required: ["userId", "fitScore", "summary", "strengths", "weaknesses", "skillValidation", "projectDeepDive", "cultureAlignment", "interviewQuestions", "aiSuggestion"],
                },
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && result.userId) {
            return result as AIAssistantAnalysis & { userId: string };
        }
        
        throw new Error("Invalid AI response format for single applicant analysis.");

    } catch (error) {
        console.error("Error calling Gemini API for assistant analysis:", error);
        throw new Error("Failed to perform AI analysis. Please check your API key.");
    }
}

/**
 * Compares a small set of candidates and recommends the best fit.
 * @param job The job posting.
 * @param candidates An array of 2-4 candidate user profiles.
 * @returns A promise resolving to a detailed comparison object.
 */
export async function generateAIComparison(job: Job, candidates: User[]): Promise<AIComparisonAnalysis> {
    if (!process.env.API_KEY) throw new Error("API_KEY is not configured.");
    if (candidates.length < 2 || candidates.length > 4) throw new Error("Comparison requires 2 to 4 candidates.");

    const jobSummary = {
        title: job.title,
        requiredSkills: job.skills,
        description: job.description.substring(0, 300),
    };

    const candidateSummaries = candidates.map(c => ({
        userId: c.id,
        name: c.name,
        title: c.title,
        skills: c.skills,
        experienceSummary: c.experience.map(e => e.role).join(', '),
    }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Job Posting: ${JSON.stringify(jobSummary)}\n\nCandidate Profiles: ${JSON.stringify(candidateSummaries)}`,
            config: {
                systemInstruction: `You are an executive hiring manager providing a final recommendation. Analyze the provided candidate profiles against the job posting and return a structured JSON comparison.

                You MUST return a single JSON object with the following structure:
                1.  "summary": A 2-3 sentence executive summary comparing the candidates' overall strengths.
                2.  "recommendation": An object with "userId" of the single best candidate and a concise "reasoning" for your choice.
                3.  "candidateBreakdowns": An array of objects, one for each candidate, containing their "userId", an array of their top "strengths" for this role, and an array of their "weaknesses" or areas of concern.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        recommendation: {
                            type: Type.OBJECT,
                            properties: {
                                userId: { type: Type.STRING },
                                reasoning: { type: Type.STRING },
                            },
                            required: ["userId", "reasoning"],
                        },
                        candidateBreakdowns: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    userId: { type: Type.STRING },
                                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                                },
                                required: ["userId", "strengths", "weaknesses"],
                            },
                        },
                    },
                    required: ["summary", "recommendation", "candidateBreakdowns"],
                },
            },
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        if (result && result.recommendation) {
            return result as AIComparisonAnalysis;
        }
        throw new Error("Invalid AI response format for candidate comparison.");
    } catch (error) {
        console.error("Error calling Gemini API for candidate comparison:", error);
        throw new Error("Failed to perform AI comparison. Please check your API key.");
    }
}