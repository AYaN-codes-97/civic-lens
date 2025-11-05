
import { Type, GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { AnalyzedIssueData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const FORM_FILL_MODEL = 'gemini-2.5-flash';

const CATEGORIES = ["Pothole", "Graffiti", "Broken Streetlight", "Trash", "Park Maintenance", "Other"];

const issueSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise, descriptive title for the issue (max 10 words).",
        },
        description: {
            type: Type.STRING,
            description: "A detailed description of the issue observed in the media.",
        },
        category: {
            type: Type.STRING,
            description: `The most appropriate category from this list: [${CATEGORIES.join(", ")}].`,
        },
    },
    required: ["title", "description", "category"],
};

export const analyzeMediaAndSuggestDetails = async (
    media: { mimeType: string; data: string }
): Promise<AnalyzedIssueData> => {
    const prompt = `
        You are an AI assistant for a civic engagement app called "Civic Lens".
        Your task is to analyze the provided media (image or video) of a local issue and generate a structured report.

        Analyze the media and identify the primary issue. Based on your analysis, provide:
        1. A concise title for the issue.
        2. A detailed description of what you see.
        3. The most relevant category for the issue.

        Return the result as a single JSON object.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: FORM_FILL_MODEL,
            contents: {
                parts: [
                    { inlineData: media },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: issueSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error analyzing media:", error);
        throw new Error("AI analysis of the media failed.");
    }
};

export const refineDetailsWithSpeech = async (
    currentDetails: AnalyzedIssueData,
    speechTranscript: string
): Promise<AnalyzedIssueData> => {
    const prompt = `
        You are an AI assistant for "Civic Lens". Your task is to refine an existing issue report based on new information provided by the user via speech.

        This is the current analysis of the issue:
        - Title: ${currentDetails.title}
        - Description: ${currentDetails.description}
        - Category: ${currentDetails.category}

        The user has provided the following additional details or corrections via speech:
        "${speechTranscript}"

        Your job is to intelligently merge the user's new information with the existing details. 
        - Update the title, description, and category if the user's speech provides more specific or accurate information.
        - Do not remove correct information from the original analysis; supplement it.
        - Ensure the final description is a coherent combination of the original analysis and the user's input.
        
        Return the updated report as a single JSON object.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: FORM_FILL_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: issueSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error refining details with speech:", error);
        throw new Error("AI refinement of the report failed.");
    }
};
