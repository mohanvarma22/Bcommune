import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import Company type
import type { Job, User, Event, AIResponse, Company } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


export async function getAIResponse(
    prompt: string, 
    // FIX: Add companies to the context type
    context: { jobs: Job[], users: User[], events: Event[], companies: Company[] },
    currentUser: User
): Promise<AIResponse> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }
    
    // FIX: Create a map of company IDs to names for efficient lookup.
    const companiesMap = new Map(context.companies.map(c => [c.id, c.name]));

    // Summarize and limit data to keep prompt size manageable and focused on relevant keywords
    // FIX: Use the companiesMap to get the company name from job.companyId.
    const jobSummaries = context.jobs.slice(0, 30).map(j => ({ id: j.id, title: j.title, company: companiesMap.get(j.companyId) || j.companyId, skills: j.skills, location: j.location, type: j.type }));
    const userSummaries = context.users.slice(0, 30).map(u => ({ id: u.id, name: u.name, title: u.title, skills: u.skills, location: u.location }));
    const eventSummaries = context.events.slice(0, 20).map(e => ({ id: e.id, title: e.title, type: e.type, description: e.description.substring(0, 100) + '...', location: e.location }));
    const currentUserSummary = { title: currentUser.title, skills: currentUser.skills, location: currentUser.location };


    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User prompt: "${prompt}"

            Current User Profile (for context):
            ${JSON.stringify(currentUserSummary)}

            Available Platform Data (summaries):
            Jobs: ${JSON.stringify(jobSummaries)}
            Users: ${JSON.stringify(userSummaries)}
            Events: ${JSON.stringify(eventSummaries)}
            `,
            config: {
                systemInstruction: `You are an expert AI assistant for "Bcommune", a professional networking platform. Your goal is to analyze the user's prompt and provide a structured JSON response.

                1.  **Determine Intent**: First, figure out if the user is looking for 'jobs', 'people', 'events', or asking a 'general' question.
                2.  **Find Relevant Items**: Based on the intent, search the corresponding platform data for items that match the user's query (keywords, skills, location, etc.).
                3.  **Generate Insightful Text**:
                    *   If finding **jobs**, analyze the current user's profile. Write a 'reasoning' text (1-2 sentences) explaining *why* the found jobs are a good match for their skills and title.
                    *   If finding **people** or **events**, write a brief 'summary' text (1 sentence) of what you found (e.g., "I found two designers with Figma skills.").
                    *   If it's a **general** question, write a helpful 'responseText'.
                4.  **Handle No Results**: If no items are found for a search, return a 'general' response explaining that you couldn't find a match.
                5.  **Format Output**: YOU MUST return a single JSON object. Only one of the top-level keys ('jobs', 'people', 'events', 'general') should be populated with an object; the others must be \`null\`.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        jobs: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                reasoning: { type: Type.STRING, description: "An explanation of why these jobs are a good match for the user's profile." },
                                ids: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        people: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                summary: { type: Type.STRING, description: "A brief summary of the people found." },
                                ids: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        events: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                summary: { type: Type.STRING, description: "A brief summary of the events found." },
                                ids: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        general: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                responseText: { type: Type.STRING, description: "A helpful text response for a general question." }
                            }
                        }
                    },
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result) {
            return result as AIResponse;
        }

        throw new Error("Invalid AI response format");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get AI response. Please check your API key and try again.");
    }
}

/**
 * Generates a short title for a chat conversation based on the initial prompt.
 * @param prompt The first message from the user in a conversation.
 * @returns A promise that resolves to a short, descriptive title string.
 */
export async function generateTitleForChat(prompt: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a very short, concise title (4-5 words max) for a chat conversation that starts with this user prompt: "${prompt}"`,
            config: {
                systemInstruction: `You are a title generator. Your only job is to create a short, descriptive title based on a user's prompt. Do not add quotes or any other formatting.`,
            },
        });
        
        return response.text.trim().replace(/"/g, ''); // Clean up potential quotes
        
    } catch (error) {
        console.error("Error generating title with Gemini API:", error);
        // Fallback title in case of API error
        return "New Chat";
    }
}