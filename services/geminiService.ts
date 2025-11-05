
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Issue, ChatMessage, GeolocationCoordinates, GroundingChunk } from '../types';
import { createChatPrompt } from "../agents/chatAgent";
import { createEmailDraftRequest } from "../agents/emailAgent";
import { createSuggestionRequest } from "../agents/suggestionAgent";

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
// Handle missing API key gracefully to prevent app crashes
let ai: GoogleGenAI | null = null;
const apiKey = process.env.API_KEY;

// Only initialize if we have a valid API key
if (apiKey && apiKey.length > 0 && apiKey !== 'undefined') {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (error) {
        console.warn('GoogleGenAI initialization failed. AI features will be disabled.', error);
        ai = null;
    }
} else {
    console.info('No Gemini API key configured. AI features will use fallback responses.');
}

export const getAIResponseForIssue = async (
    issue: Issue,
    chatHistory: ChatMessage[],
    userQuery: string
): Promise<string> => {
    if (!ai) {
        return "AI features require an API key. Please configure your Gemini API key.";
    }
    try {
        const prompt = createChatPrompt(issue, chatHistory, userQuery);
        // Fix: Call the generateContent method with the correct model and contents.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // Fix: Extract the text from the response object.
        return response.text;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

interface EmailData {
    to: string;
    subject: string;
    body: string;
}

export const draftEmailToOfficial = async (issue: Issue): Promise<EmailData> => {
    if (!ai) {
        return {
            to: 'city.official@example.com',
            subject: `Regarding Issue: ${issue.title}`,
            body: 'AI email drafting requires an API key. Please describe the issue manually.'
        };
    }
    try {
        const request = createEmailDraftRequest(issue);
        // Fix: Call the generateContent method with the model, contents, and JSON config.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: request.contents,
            config: request.config,
        });
        // Fix: Parse the JSON string from the response text.
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error drafting email:", error);
        return {
            to: 'city.official@example.com',
            subject: `Regarding Issue: ${issue.title}`,
            body: 'There was an error generating this email. Please describe the issue here.'
        };
    }
};

export const getNearbySuggestions = async (
    location: GeolocationCoordinates
): Promise<{ suggestions: string[], groundingChunks: GroundingChunk[] }> => {
    if (!ai) {
        return { 
            suggestions: ['Potholes on roads', 'Broken or flickering streetlights', 'Overfilled public trash cans'], 
            groundingChunks: [] 
        };
    }
    try {
        const request = createSuggestionRequest(location);
        // Fix: Call generateContent with Google Maps grounding tool configuration.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: request.contents,
            config: request.config,
        });
        const suggestions = response.text
            .split('\n')
            .map(s => s.replace(/^- /, '').trim())
            .filter(Boolean);
            
        // Fix: Extract grounding metadata for source attribution.
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { suggestions, groundingChunks };
    } catch (error) {
        console.error("Error getting suggestions:", error);
        return { suggestions: [], groundingChunks: [] };
    }
};
