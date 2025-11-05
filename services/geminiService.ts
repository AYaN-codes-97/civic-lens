
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Issue, ChatMessage, GeolocationCoordinates, GroundingChunk } from '../types';
import { createChatPrompt } from "../agents/chatAgent";
import { createEmailDraftRequest } from "../agents/emailAgent";
import { createSuggestionRequest } from "../agents/suggestionAgent";

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getAIResponseForIssue = async (
    issue: Issue,
    chatHistory: ChatMessage[],
    userQuery: string
): Promise<string> => {
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
