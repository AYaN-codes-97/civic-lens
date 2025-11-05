# Azure Migration Guide

## Overview

This guide explains how to migrate from Google Gemini API to Azure OpenAI Service.

## Compatibility Matrix

| Feature | Google Gemini | Azure OpenAI | Migration Effort |
|---------|--------------|--------------|------------------|
| Text Generation | ✅ `gemini-2.5-flash` | ✅ GPT-4 Turbo | Medium |
| Image Analysis | ✅ Multimodal | ✅ GPT-4 Vision | Medium |
| JSON Schema | ✅ Native support | ✅ Structured Outputs | Medium |
| Google Maps Grounding | ✅ Built-in | ❌ Not available | High (workaround needed) |
| Fast/Cheap Model | ✅ `gemini-2.5-flash` | ✅ GPT-4o-mini | Low |

## Required Changes

### 1. Install Azure OpenAI SDK

```bash
npm uninstall @google/genai
npm install @azure/openai
```

### 2. Update Environment Variables

Create `.env` file:
```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini  # or gpt-4-turbo, gpt-4-vision

# For suggestions without Maps grounding, you can optionally use Azure Maps
AZURE_MAPS_SUBSCRIPTION_KEY=optional-maps-key
```

### 3. Update `vite.config.ts`

```typescript
define: {
  'process.env.AZURE_OPENAI_ENDPOINT': JSON.stringify(env.AZURE_OPENAI_ENDPOINT),
  'process.env.AZURE_OPENAI_API_KEY': JSON.stringify(env.AZURE_OPENAI_API_KEY),
  'process.env.AZURE_OPENAI_DEPLOYMENT_NAME': JSON.stringify(env.AZURE_OPENAI_DEPLOYMENT_NAME),
}
```

### 4. Create New Azure Service File

Create `services/azureService.ts` to replace `geminiService.ts`:

```typescript
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import type { Issue, ChatMessage, GeolocationCoordinates, GroundingChunk } from '../types';
import { createChatPrompt } from '../agents/chatAgent';
import { createEmailDraftRequest } from '../agents/emailAgent';
import { createSuggestionRequest } from '../agents/suggestionAgent';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const apiKey = process.env.AZURE_OPENAI_API_KEY as string;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

export const getAIResponseForIssue = async (
    issue: Issue,
    chatHistory: ChatMessage[],
    userQuery: string
): Promise<string> => {
    try {
        const prompt = createChatPrompt(issue, chatHistory, userQuery);
        
        const response = await client.getChatCompletions(deploymentName, [
            { role: 'user', content: prompt }
        ]);

        return response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
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
        
        const response = await client.getChatCompletions(deploymentName, [
            { role: 'user', content: request.contents }
        ], {
            responseFormat: {
                type: 'json_object'
            }
        });

        const content = response.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(content);
        
        // Ensure all required fields exist
        return {
            to: parsed.to || 'city.official@example.com',
            subject: parsed.subject || `Regarding Issue: ${issue.title}`,
            body: parsed.body || 'There was an error generating this email.'
        };
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
        
        // Azure OpenAI doesn't have Google Maps grounding
        // Workaround: Use location-aware prompt without grounding
        const prompt = `
            ${request.contents}
            
            Note: The user is at latitude ${location.latitude}, longitude ${location.longitude}.
            Provide relevant, location-aware suggestions based on typical civic issues in urban/suburban areas.
        `;
        
        const response = await client.getChatCompletions(deploymentName, [
            { role: 'user', content: prompt }
        ]);

        const text = response.choices[0]?.message?.content || '';
        const suggestions = text
            .split('\n')
            .map(s => s.replace(/^- /, '').trim())
            .filter(Boolean)
            .slice(0, 3); // Take first 3
            
        // Azure doesn't provide grounding chunks like Google Maps
        // Return empty array or implement Azure Maps integration separately
        return { suggestions, groundingChunks: [] };
    } catch (error) {
        console.error("Error getting suggestions:", error);
        return { suggestions: [], groundingChunks: [] };
    }
};
```

### 5. Update Form Filler Agent

Create `agents/formFillerAgentAzure.ts`:

```typescript
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import type { AnalyzedIssueData } from '../types';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const apiKey = process.env.AZURE_OPENAI_API_KEY as string;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';
const visionModel = process.env.AZURE_OPENAI_VISION_DEPLOYMENT || 'gpt-4-vision';

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

const CATEGORIES = ["Pothole", "Graffiti", "Broken Streetlight", "Trash", "Park Maintenance", "Other"];

export const analyzeMediaAndSuggestDetails = async (
    media: { mimeType: string; data: string }
): Promise<AnalyzedIssueData> => {
    const prompt = `
        You are an AI assistant for a civic engagement app called "Civic Lens".
        Your task is to analyze the provided media (image or video) of a local issue and generate a structured report.

        Analyze the media and identify the primary issue. Based on your analysis, provide:
        1. A concise title for the issue (max 10 words).
        2. A detailed description of what you see.
        3. The most relevant category from this list: [${CATEGORIES.join(", ")}].

        Return ONLY a valid JSON object with these exact keys: "title", "description", "category".
    `;

    try {
        // Convert base64 to data URL for Azure OpenAI
        const dataUrl = `data:${media.mimeType};base64,${media.data}`;
        
        const response = await client.getChatCompletions(visionModel, [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        imageUrl: { url: dataUrl }
                    }
                ]
            }
        ], {
            responseFormat: {
                type: 'json_object'
            }
        });

        const content = response.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(content);
        
        return {
            title: parsed.title || 'Untitled Issue',
            description: parsed.description || 'No description provided.',
            category: parsed.category || 'Other'
        };
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

        Current analysis:
        - Title: ${currentDetails.title}
        - Description: ${currentDetails.description}
        - Category: ${currentDetails.category}

        User's additional details via speech: "${speechTranscript}"

        Intelligently merge the user's new information with the existing details.
        - Update title, description, and category if the user's speech provides more specific or accurate information.
        - Do not remove correct information from the original analysis; supplement it.
        - Ensure the final description is a coherent combination of the original analysis and the user's input.
        
        Return ONLY a valid JSON object with these exact keys: "title", "description", "category".
        Categories must be one of: [${CATEGORIES.join(", ")}].
    `;
    
    try {
        const response = await client.getChatCompletions(deploymentName, [
            { role: 'user', content: prompt }
        ], {
            responseFormat: {
                type: 'json_object'
            }
        });

        const content = response.choices[0]?.message?.content || '{}';
        return JSON.parse(content);
    } catch (error) {
        console.error("Error refining details with speech:", error);
        throw new Error("AI refinement of the report failed.");
    }
};
```

### 6. Update Imports

Update files that import from `geminiService.ts`:

**`components/AgentChat.tsx`:**
```typescript
// Change:
import { getAIResponseForIssue, draftEmailToOfficial } from '../services/geminiService';
// To:
import { getAIResponseForIssue, draftEmailToOfficial } from '../services/azureService';
```

**`components/NewIssueModal.tsx`:**
```typescript
// Change:
import { analyzeMediaAndSuggestDetails, refineDetailsWithSpeech } from '../agents/formFillerAgent';
// To:
import { analyzeMediaAndSuggestDetails, refineDetailsWithSpeech } from '../agents/formFillerAgentAzure';
```

**`components/SuggestionSection.tsx`:**
```typescript
// Change:
import { getNearbySuggestions } from '../services/geminiService';
// To:
import { getNearbySuggestions } from '../services/azureService';
```

### 7. Update Package.json

```json
{
  "dependencies": {
    "@azure/openai": "^1.0.0-beta.1",
    // Remove: "@google/genai": "^1.28.0"
  }
}
```

## Google Maps Grounding Alternative

Since Azure OpenAI doesn't have Google Maps grounding, you have two options:

### Option 1: Remove Grounding Links (Simplest)
- Just show suggestions without attribution links
- Already handled in the migration above (empty `groundingChunks`)

### Option 2: Integrate Azure Maps Separately
- Use Azure Maps API to get nearby POIs
- Combine with AI suggestions
- More complex but provides similar functionality

### Option 3: Use Location in Prompt (Recommended)
- Include location coordinates in the prompt
- Ask AI to consider location context
- Works well for civic issue suggestions

## Cost Comparison

| Service | Model | Price (Approx) |
|---------|-------|----------------|
| Google Gemini | gemini-2.5-flash | ~$0.075 per 1M input tokens |
| Azure OpenAI | gpt-4o-mini | ~$0.15 per 1M input tokens |
| Azure OpenAI | gpt-4-turbo | ~$10 per 1M input tokens |

**Recommendation**: Use `gpt-4o-mini` for most operations, `gpt-4-vision` only for image analysis.

## Testing Checklist

- [ ] Install Azure OpenAI SDK
- [ ] Create Azure OpenAI resource and deployment
- [ ] Update environment variables
- [ ] Test image analysis (form filling)
- [ ] Test chat responses
- [ ] Test email drafting
- [ ] Test suggestions (without grounding)
- [ ] Update all imports
- [ ] Test end-to-end user flows

## Deployment Notes

1. **Environment Variables**: Ensure Azure credentials are in your production environment
2. **Deployment Names**: Match your Azure OpenAI deployment names exactly
3. **Model Availability**: Ensure vision models are deployed if using image analysis
4. **Rate Limits**: Azure has different rate limits than Google - monitor usage

## Limitations After Migration

1. ❌ **Google Maps Grounding**: Not available in Azure OpenAI
   - Workaround: Location-aware prompts
2. ⚠️ **Response Format**: Slight differences in JSON schema handling
   - Workaround: Explicit JSON object prompts
3. ⚠️ **Model Names**: Different model names and pricing
   - Solution: Configure deployment names appropriately

## Support

- Azure OpenAI Documentation: https://learn.microsoft.com/azure/ai-services/openai/
- Azure OpenAI SDK: https://www.npmjs.com/package/@azure/openai

