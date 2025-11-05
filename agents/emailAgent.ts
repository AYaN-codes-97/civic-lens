
import { Type } from "@google/genai";
import type { Issue } from '../types';

export const createEmailDraftRequest = (issue: Issue) => {
    const prompt = `
        You are an AI assistant helping a concerned resident draft a professional and effective email to a city official about a local issue.
        
        Issue Details:
        - Title: ${issue.title}
        - Description: ${issue.description}
        - Category: ${issue.category}
        - Location: Approximately at latitude ${issue.lat.toFixed(5)}, longitude ${issue.lng.toFixed(5)}
        - Community Votes: ${issue.votes}
        - Date Reported: ${new Date(issue.createdAt).toLocaleDateString()}

        Task:
        Draft an email based on the issue details provided. The email should be:
        - Addressed to a generic "City Official".
        - Clear, concise, and respectful in tone.
        - Start with a clear subject line.
        - Briefly introduce the issue and its location.
        - Mention that it has been reported on the "Civic Lens" app and has garnered community support (${issue.votes} votes).
        - Request attention or action on the matter.
        - End with a professional closing from "A Concerned Resident".

        Return the email as a JSON object with "to", "subject", and "body" fields.
    `;

    return {
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    to: {
                        type: Type.STRING,
                        description: "The recipient of the email.",
                    },
                    subject: {
                        type: Type.STRING,
                        description: "The subject line of the email.",
                    },
                    body: {
                        type: Type.STRING,
                        description: "The full body content of the email.",
                    },
                },
                required: ["to", "subject", "body"],
            },
        },
    };
};
