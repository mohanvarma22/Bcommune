

import { GoogleGenAI, Type } from "@google/genai";
import type { Job } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Uses Gemini to search for jobs based on a natural language prompt.
 * @param prompt The user's search query.
 * @param jobs The list of all available jobs.
 * @returns A promise that resolves to an array of matched job IDs.
 */
export async function searchJobsWithAI(prompt: string, jobs: Job[]): Promise<string[]> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }
    
    // Limit the number of jobs sent to the API to avoid an overly large prompt
    const jobSummaries = jobs.slice(0, 50).map(job => ({
        id: job.id,
        title: job.title,
        // FIX: The Job type has 'companyId', not 'company'.
        companyId: job.companyId,
        description: job.description.substring(0, 200) + '...', // Keep prompt concise
        skills: job.skills,
    }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User Query: "${prompt}"

            Available Jobs (JSON format):
            ${JSON.stringify(jobSummaries)}
            `,
            config: {
                systemInstruction: `You are an expert AI recruiter for a startup ecosystem networking platform. Your task is to analyze a user's natural language query and a list of available job opportunities. You must identify and return only the jobs that are the best match for the user's query. Return a JSON object with a single key "relevantJobIds" which is an array of the job IDs.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        relevantJobIds: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && Array.isArray(result.relevantJobIds)) {
            return result.relevantJobIds;
        }

        return [];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to perform AI search. Please check your API key and try again.");
    }
}