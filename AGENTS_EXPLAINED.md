# Agents Explained: Complete Beginner's Guide

## What is an "Agent" in This Context?

An **Agent** is a specialized AI function that:
- Takes specific **input** (data/information)
- Processes it using **Google Gemini AI**
- Returns structured **output** (results)

Think of each agent as a **specialist** that does one job really well, like:
- A **Photo Analyst** that looks at pictures and describes what's wrong
- A **Chat Assistant** that answers questions about issues
- An **Email Writer** that drafts professional emails
- A **Location Advisor** that suggests what to look for nearby

---

## Agent 1: Form Filler Agent 📸

### What It Does
**Analyzes photos/videos** and automatically fills out the issue reporting form.

### Two Main Functions

#### Function 1: `analyzeMediaAndSuggestDetails()` - Initial Analysis

**What It Consumes (Inputs):**
```
{
  mimeType: "image/jpeg",  // Type of file (image/video)
  data: "base64_string..." // The actual image converted to text
}
```

**What It Processes:**
1. Receives your uploaded image (converted to base64 text format)
2. Sends image + instructions to Google Gemini AI
3. AI "looks at" the image using vision capabilities
4. AI identifies what's wrong in the image
5. AI generates three things:
   - **Title**: A short name (e.g., "Large Pothole on Main Street")
   - **Description**: Detailed explanation (e.g., "A deep pothole approximately 2 feet wide...")
   - **Category**: One of: Pothole, Graffiti, Broken Streetlight, Trash, Park Maintenance, Other

**The AI Prompt (Instructions):**
```
"You are an AI assistant for a civic engagement app called 'Civic Lens'.
Your task is to analyze the provided media (image or video) of a local issue 
and generate a structured report.

Analyze the media and identify the primary issue. Based on your analysis, provide:
1. A concise title for the issue.
2. A detailed description of what you see.
3. The most relevant category for the issue."
```

**What It Outputs:**
```json
{
  "title": "Large Pothole on Main Street",
  "description": "A deep pothole approximately 2 feet wide and 6 inches deep...",
  "category": "Pothole"
}
```

**Real Example:**
- **You upload**: Photo of a pothole
- **Agent receives**: Base64-encoded image data
- **Agent sends to AI**: Image + "What's wrong here?"
- **AI responds**: `{title: "Large Pothole", description: "...", category: "Pothole"}`
- **Form auto-fills**: Title, Description, Category fields get filled!

---

#### Function 2: `refineDetailsWithSpeech()` - Refinement

**What It Consumes (Inputs):**
```
1. currentDetails: {
     title: "Large Pothole on Main Street",
     description: "A deep pothole...",
     category: "Pothole"
   }
2. speechTranscript: "It's actually a huge pothole, dangerous for cyclists"
```

**What It Processes:**
1. Takes the AI's initial analysis
2. Takes your spoken corrections/additions
3. Sends both to Gemini AI with instructions to merge them intelligently
4. AI combines original analysis + your speech
5. AI updates title/description/category if needed

**The AI Prompt (Instructions):**
```
"You are an AI assistant for 'Civic Lens'. Your task is to refine an existing 
issue report based on new information provided by the user via speech.

This is the current analysis of the issue:
- Title: Large Pothole on Main Street
- Description: A deep pothole...
- Category: Pothole

The user has provided the following additional details via speech:
"It's actually a huge pothole, dangerous for cyclists"

Your job is to intelligently merge the user's new information with the existing details.
- Update the title, description, and category if the user's speech provides more 
  specific or accurate information.
- Do not remove correct information from the original analysis; supplement it."
```

**What It Outputs:**
```json
{
  "title": "Large Dangerous Pothole on Main Street",
  "description": "A huge deep pothole approximately 2 feet wide and 6 inches deep, 
                  presenting a significant danger to cyclists and vehicles...",
  "category": "Pothole"
}
```

**Real Example:**
- **Initial AI**: "Large Pothole"
- **You say**: "It's dangerous for cyclists"
- **Agent merges**: Both pieces of information
- **Final result**: "Large Dangerous Pothole...dangerous for cyclists..."

---

## Agent 2: Chat Agent 💬

### What It Does
**Answers questions** and **provides help** about specific issues in a conversational way.

### Function: `createChatPrompt()` - Creates the Prompt

**What It Consumes (Inputs):**
```
1. issue: {
     id: "1",
     title: "Large Pothole on Main St",
     description: "A very large and dangerous pothole...",
     category: "Pothole",
     lat: 34.0522,
     lng: -118.2437,
     votes: 15,
     createdAt: 1234567890
   }
2. chatHistory: [
     {sender: 'user', text: 'What is this issue?'},
     {sender: 'agent', text: 'This is a pothole reported...'}
   ]
3. userQuery: "Can you summarize this issue?"
```

**What It Processes:**
1. Takes the full issue details (title, description, location, votes, etc.)
2. Takes the conversation history (previous messages)
3. Takes the new user question
4. Combines all this into one big prompt
5. Sends to Gemini AI with instructions to be helpful and concise

**The AI Prompt (Instructions):**
```
"You are a helpful AI assistant for a civic engagement app called 'Civic Lens'.
Your goal is to help users understand and take action on local issues.
You must be concise and helpful.

Current Issue Details:
- Title: Large Pothole on Main St
- Description: A very large and dangerous pothole...
- Category: Pothole
- Location: (lat: 34.0522, lng: -118.2437)
- Votes: 15
- Reported on: 12/15/2023

Chat History:
User: What is this issue?
AI: This is a pothole reported...

New User Query: "Can you summarize this issue?"

Based on the issue details and chat history, provide a direct and helpful response.
If the user asks to summarize, provide a brief summary of the issue.
Do not invent information. Stick to the details provided."
```

**What It Outputs:**
```
"This is a community-reported pothole on Main Street that has been flagged as 
dangerous. It's received 15 upvotes from other residents, indicating strong 
community concern. The issue was first reported on December 15, 2023."
```

**Real Example:**
- **You ask**: "Can you summarize this issue?"
- **Agent sends to AI**: Issue details + your question + instructions
- **AI responds**: A helpful summary using only the issue information
- **Chat shows**: AI's response as a message

---

## Agent 3: Email Agent 📧

### What It Does
**Drafts professional emails** to city officials about reported issues.

### Function: `createEmailDraftRequest()` - Creates the Prompt

**What It Consumes (Inputs):**
```
issue: {
  id: "1",
  title: "Large Pothole on Main St",
  description: "A very large and dangerous pothole...",
  category: "Pothole",
  lat: 34.0522,
  lng: -118.2437,
  votes: 15,
  createdAt: 1234567890
}
```

**What It Processes:**
1. Takes all issue details
2. Sends to Gemini AI with instructions to write a professional email
3. AI generates:
   - **To**: Recipient (usually "City Official")
   - **Subject**: Email subject line
   - **Body**: Professional email content

**The AI Prompt (Instructions):**
```
"You are an AI assistant helping a concerned resident draft a professional and 
effective email to a city official about a local issue.

Issue Details:
- Title: Large Pothole on Main St
- Description: A very large and dangerous pothole...
- Category: Pothole
- Location: Approximately at latitude 34.05220, longitude -118.24370
- Community Votes: 15
- Date Reported: 12/15/2023

Task:
Draft an email based on the issue details provided. The email should be:
- Addressed to a generic 'City Official'.
- Clear, concise, and respectful in tone.
- Start with a clear subject line.
- Briefly introduce the issue and its location.
- Mention that it has been reported on the 'Civic Lens' app and has garnered 
  community support (15 votes).
- Request attention or action on the matter.
- End with a professional closing from 'A Concerned Resident'.

Return the email as a JSON object with 'to', 'subject', and 'body' fields."
```

**What It Outputs:**
```json
{
  "to": "City Official",
  "subject": "Community-Reported Pothole Requiring Attention on Main Street",
  "body": "Dear City Official,\n\nI am writing to bring your attention to a 
           significant pothole that has been reported on Main Street... This 
           issue has been reported through the Civic Lens app and has received 
           15 votes from concerned community members, indicating strong public 
           concern...\n\nI respectfully request that this matter be addressed to 
           ensure public safety.\n\nThank you for your attention to this matter.\n\n
           Sincerely,\nA Concerned Resident"
}
```

**Real Example:**
- **You click**: "Draft email to official"
- **Agent sends to AI**: Issue details + email writing instructions
- **AI generates**: Professional email with all required fields
- **Email Preview Modal opens**: Shows the generated email
- **You can review**: Before sending (simulated)

---

## Agent 4: Suggestion Agent 📍

### What It Does
**Suggests nearby civic issues** to look for based on your current location.

### Function: `createSuggestionRequest()` - Creates the Prompt

**What It Consumes (Inputs):**
```
location: {
  latitude: 34.0522,
  longitude: -118.2437,
  accuracy: 10
}
```

**What It Processes:**
1. Takes your GPS coordinates (latitude/longitude)
2. Sends to Gemini AI with **Google Maps Grounding** tool
3. AI uses Google Maps to understand your location (neighborhood, area type)
4. AI generates 3 relevant suggestions based on:
   - Your location context
   - Typical civic issues in that area
   - What makes sense nearby

**The AI Prompt (Instructions):**
```
"You are an AI assistant for a civic reporting app. Your goal is to suggest 
potential issues a user might look for in their vicinity.

User's location: latitude: 34.0522, longitude: -118.2437.

Based on this location, generate a list of 3 concise, actionable suggestions 
for civic issues to report.
Frame them as simple statements, not questions.
For example: 'Potholes on main roads', 'Broken or flickering streetlights', 
'Graffiti on public walls', 'Overfilled public trash cans'.

Return ONLY a bulleted list of these 3 suggestions, with each suggestion on a 
new line starting with a hyphen."
```

**Special Feature: Google Maps Grounding**
The agent uses `tools: [{ googleMaps: {} }]` which allows the AI to:
- Look up location data from Google Maps
- Understand what's nearby (parks, roads, buildings)
- Provide relevant, location-aware suggestions

**What It Outputs:**
```
"- Potholes on main roads
- Broken or flickering streetlights
- Graffiti on public walls"
```

Plus grounding chunks (optional):
```
[
  {
    maps: {
      uri: "https://maps.google.com/...",
      title: "Downtown Area"
    }
  }
]
```

**Real Example:**
- **You open app**: Location detected (Los Angeles, CA)
- **Agent sends to AI**: Your coordinates + Google Maps grounding
- **AI checks**: What's nearby (urban area, busy streets, public spaces)
- **AI suggests**: "Potholes on main roads", "Broken streetlights", "Graffiti"
- **UI shows**: These suggestions on the right side

---

## Complete Data Flow Examples

### Example 1: Reporting a New Issue

```
1. User uploads image
   ↓
2. Image → Base64 conversion (blobToBase64)
   ↓
3. Base64 → Form Filler Agent (analyzeMediaAndSuggestDetails)
   ↓
4. Agent → Gemini AI:
   - Input: Base64 image + "Analyze this"
   - AI looks at image
   - AI identifies: "Pothole"
   ↓
5. AI → Agent: {title, description, category}
   ↓
6. Agent → Form: Auto-fills fields
   ↓
7. User can refine via speech:
   - User speaks: "It's dangerous for cyclists"
   - Speech → Text (Web Speech API)
   - Text → Form Filler Agent (refineDetailsWithSpeech)
   - Agent → Gemini AI: Original + Speech
   - AI merges: Both pieces of info
   - AI → Agent: Updated {title, description, category}
   - Form updates
   ↓
8. User submits
   ↓
9. New Issue created
```

### Example 2: Chatting About an Issue

```
1. User clicks issue marker
   ↓
2. Issue Details Card opens
   ↓
3. User types: "Can you summarize this?"
   ↓
4. Chat Agent (createChatPrompt):
   - Takes issue details
   - Takes chat history
   - Takes user query
   - Combines into prompt
   ↓
5. Agent → Gemini AI:
   - Input: Issue + History + Query + Instructions
   - AI reads all context
   - AI generates helpful response
   ↓
6. AI → Agent: Response text
   ↓
7. Agent → Chat UI: Message displayed
```

### Example 3: Drafting an Email

```
1. User clicks "Draft email" button
   ↓
2. Email Agent (createEmailDraftRequest):
   - Takes issue details
   - Creates email writing prompt
   ↓
3. Agent → Gemini AI:
   - Input: Issue details + "Write professional email"
   - AI understands context
   - AI writes email in professional tone
   - AI uses JSON schema (structured output)
   ↓
4. AI → Agent: {to, subject, body}
   ↓
5. Agent → Email Preview Modal: Email displayed
```

### Example 4: Getting Suggestions

```
1. App loads, gets user location
   ↓
2. Suggestion Agent (createSuggestionRequest):
   - Takes GPS coordinates
   - Creates suggestion prompt
   - Enables Google Maps grounding
   ↓
3. Agent → Gemini AI:
   - Input: Coordinates + "Suggest nearby issues"
   - AI uses Google Maps to understand location
   - AI thinks: "Urban area, busy streets..."
   - AI generates relevant suggestions
   ↓
4. AI → Agent: 3 suggestions + grounding links
   ↓
5. Agent → UI: Suggestions displayed on right side
```

---

## How Agents Work Together

```
User Uploads Image
    ↓
Form Filler Agent analyzes → Auto-fills form
    ↓
User Submits → Issue Created
    ↓
User Clicks Issue
    ↓
Chat Agent answers questions about issue
    ↓
User Requests Email
    ↓
Email Agent drafts professional email
    ↓
Separately: Suggestion Agent suggests nearby issues
```

---

## Key Concepts Explained

### 1. **Prompt** (Instructions to AI)
A prompt is **instructions** you give to the AI. It's like telling a person:
- What their role is ("You are a helpful assistant...")
- What they should do ("Analyze this image...")
- What format to use ("Return as JSON...")

### 2. **Base64 Encoding**
Images are binary (1s and 0s). To send them to an API, we convert them to text:
- Image file → Base64 text string
- API can read the text → Convert back to image → Analyze

### 3. **JSON Schema** (Structured Output)
We tell AI exactly what format we want:
```json
{
  "title": "string",
  "description": "string",
  "category": "string"
}
```
AI must return exactly this format - no extra fields!

### 4. **Grounding** (Using External Data)
When Suggestion Agent uses Google Maps grounding:
- AI doesn't just guess about your location
- AI actually looks up your location in Google Maps
- AI gets real data about what's nearby
- AI provides accurate, relevant suggestions

### 5. **Multimodal** (Multiple Types of Input)
Form Filler Agent is **multimodal** because it can process:
- **Images** (visual data)
- **Text** (instructions/prompts)
- Both at the same time!

---

## Summary Table

| Agent | What It Consumes | What It Processes | What It Outputs |
|-------|-----------------|------------------|-----------------|
| **Form Filler** | Image (base64) | Analyzes photo to identify issue | {title, description, category} |
| **Form Filler (Refine)** | Current details + Speech | Merges AI analysis with user speech | Updated {title, description, category} |
| **Chat Agent** | Issue + Chat history + Query | Answers questions about issue | Natural language response |
| **Email Agent** | Issue details | Writes professional email | {to, subject, body} |
| **Suggestion Agent** | GPS coordinates | Suggests nearby issues to report | 3 suggestions + Maps links |

---

## Understanding the Code

### Why We Use `async/await`
Agents are **asynchronous** because:
- API calls take time (1-3 seconds)
- We don't want to freeze the app
- `async/await` lets us wait for results

### Why We Use `try/catch`
API calls can fail:
- Network errors
- Invalid API key
- Quota exceeded
- `try/catch` handles errors gracefully

### Why We Use JSON Schema
Without schema, AI might return:
```
"Here's a pothole on Main Street..."
```

With schema, AI must return:
```json
{"title": "...", "description": "...", "category": "..."}
```

This ensures our code always gets the same format!

---

This covers each agent in detail. If you have questions about any specific part, let me know! 🚀

