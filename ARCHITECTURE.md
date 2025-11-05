# Civic Lens: Complete Architecture & Query Lifecycle

## Application Overview

**Civic Lens** is a civic engagement application that helps residents report, discuss, and take action on local community issues (potholes, graffiti, broken streetlights, etc.). The app uses:

- **Live Maps** (Leaflet.js + Esri World Imagery)
- **Real-time Geolocation** (Browser Geolocation API)
- **Multi-Agent AI System** (Google Gemini models)
- **Speech-to-Text** (Browser Web Speech API)
- **Gamification** (Badges & Stats)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + TypeScript)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   App.tsx    │  │   Map.tsx    │  │  NewIssueModal│                  │
│  │  (Orchestrator│  │ (Leaflet.js)│  │               │                  │
│  │   Component) │  │              │  │               │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                  │                  │                            │
│         │                  │                  │                            │
│  ┌──────▼──────────────────▼──────────────────▼───────┐                  │
│  │         IssueDetailsCard + AgentChat              │                  │
│  └──────────┬───────────────────┬────────────────────┘                  │
│             │                   │                                         │
│  ┌──────────▼──────┐  ┌────────▼──────────┐                            │
│  │ SuggestionSection│  │  EmailPreviewModal│                            │
│  └──────────────────┘  └───────────────────┘                            │
│                                                                           │
│  ┌────────────────────────────────────────────────────┐                 │
│  │              Hooks Layer                            │                 │
│  │  • useGeolocation (watchPosition)                   │                 │
│  │  • useSpeechToText (Web Speech API)                 │                 │
│  │  • useDeviceOrientation (for AR)                    │                 │
│  └────────────────────────────────────────────────────┘                 │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    │ HTTP/API Calls
                                    │
┌───────────────────────────────────▼───────────────────────────────────────┐
│                    SERVICES LAYER (geminiService.ts)                     │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │  • getAIResponseForIssue()                               │            │
│  │  • draftEmailToOfficial()                               │            │
│  │  • getNearbySuggestions()                                │            │
│  └──────────────────┬───────────────────────────────────────┘            │
└─────────────────────┼─────────────────────────────────────────────────────┘
                      │
                      │ API Requests
                      │
┌─────────────────────▼─────────────────────────────────────────────────────┐
│                      AGENTS LAYER                                         │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │  1. Form Filler Agent (formFillerAgent.ts)                 │         │
│  │     • analyzeMediaAndSuggestDetails()                       │         │
│  │     • refineDetailsWithSpeech()                            │         │
│  │     Model: gemini-2.5-flash                                 │         │
│  │     Input: Base64 image/video                              │         │
│  │     Output: {title, description, category}                  │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │  2. Chat Agent (chatAgent.ts)                              │         │
│  │     • createChatPrompt()                                   │         │
│  │     Model: gemini-2.5-flash                                │         │
│  │     Input: Issue + Chat History + User Query               │         │
│  │     Output: Natural language response                      │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │  3. Email Agent (emailAgent.ts)                            │         │
│  │     • createEmailDraftRequest()                            │         │
│  │     Model: gemini-2.5-flash                                │         │
│  │     Schema: JSON with {to, subject, body}                  │         │
│  │     Input: Issue details                                   │         │
│  │     Output: Professional email draft                        │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │  4. Suggestion Agent (suggestionAgent.ts)                 │         │
│  │     • createSuggestionRequest()                           │         │
│  │     Model: gemini-2.5-flash                               │         │
│  │     Tools: Google Maps Grounding                           │         │
│  │     Input: User geolocation                                │         │
│  │     Output: 3 actionable suggestions                       │         │
│  └────────────────────────────────────────────────────────────┘         │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    │
┌───────────────────────────────────▼───────────────────────────────────────┐
│                    EXTERNAL SERVICES                                      │
│                                                                             │
│  • Google Gemini API (gemini-2.5-flash)                                   │
│  • Esri ArcGIS Online (World Imagery tiles)                               │
│  • Browser Geolocation API (watchPosition)                                 │
│  • Browser Web Speech API (SpeechRecognition)                              │
│  • Google Maps Grounding (via Gemini API)                                 │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Responsibilities & Workflows

### 1. **Form Filler Agent** (`formFillerAgent.ts`)
   - **Purpose**: Analyze uploaded media and auto-fill issue report forms
   - **Two Functions**:
     - `analyzeMediaAndSuggestDetails()`: Initial image/video analysis
     - `refineDetailsWithSpeech()`: Refine analysis with user speech input
   - **Model**: `gemini-2.5-flash` (multimodal)
   - **Input Schema**: Base64-encoded image/video + MIME type
   - **Output Schema**: `{title: string, description: string, category: string}`
   - **Categories**: ["Pothole", "Graffiti", "Broken Streetlight", "Trash", "Park Maintenance", "Other"]

### 2. **Chat Agent** (`chatAgent.ts`)
   - **Purpose**: Provide conversational AI assistance about specific issues
   - **Function**: `createChatPrompt()`
   - **Model**: `gemini-2.5-flash`
   - **Input**: Issue details + Chat history + User query
   - **Output**: Natural language response
   - **Capabilities**: Summarize issues, answer questions, explain status

### 3. **Email Agent** (`emailAgent.ts`)
   - **Purpose**: Draft professional emails to city officials
   - **Function**: `createEmailDraftRequest()`
   - **Model**: `gemini-2.5-flash` with JSON schema
   - **Output Schema**: `{to: string, subject: string, body: string}`
   - **Tone**: Professional, respectful, action-oriented

### 4. **Suggestion Agent** (`suggestionAgent.ts`)
   - **Purpose**: Suggest nearby civic issues to report based on location
   - **Function**: `createSuggestionRequest()`
   - **Model**: `gemini-2.5-flash` with Google Maps Grounding
   - **Tool**: `{googleMaps: {}}` with retrieval config
   - **Input**: Geolocation coordinates (lat/lng)
   - **Output**: 3 bulleted suggestions + grounding chunks for attribution

---

## Life of a Query: Complete Flows

### Flow 1: User Reports a New Issue

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Interaction                                                 │
│                                                                           │
│  User clicks on map → NewIssueModal opens                                 │
│  User uploads image(s) via file input                                    │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Media Processing                                                  │
│                                                                           │
│  • File selected → Convert to Base64 (fileUtils.ts)                      │
│  • Show preview in UI                                                     │
│  • Set isAnalyzing = true                                                 │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Form Filler Agent - Image Analysis                               │
│                                                                           │
│  NewIssueModal.handleFileChange()                                        │
│    → analyzeMediaAndSuggestDetails({                                      │
│         mimeType: "image/jpeg",                                           │
│         data: "base64..."                                                 │
│       })                                                                  │
│                                                                           │
│  formFillerAgent.ts:                                                      │
│    • Build prompt with media analysis instructions                        │
│    • Call Gemini API with multimodal input                                │
│    • Parse JSON response: {title, description, category}                  │
│                                                                           │
│  Result: Form auto-filled with AI-generated details                      │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: User Refinement (Optional)                                       │
│                                                                           │
│  User clicks microphone button                                            │
│  → useSpeechToText.startListening()                                      │
│  → Browser SpeechRecognition API activates                               │
│  → User speaks: "It's actually a huge pothole, dangerous for cyclists"   │
│  → Speech → Text transcript received                                      │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Form Filler Agent - Speech Refinement                             │
│                                                                           │
│  NewIssueModal.handleSpeechResult(transcript)                             │
│    → refineDetailsWithSpeech(currentDetails, transcript)                   │
│                                                                           │
│  formFillerAgent.ts:                                                      │
│    • Build prompt merging AI analysis + user speech                       │
│    • Call Gemini API                                                      │
│    • Parse updated JSON                                                   │
│                                                                           │
│  Result: Form updated with refined details                               │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Submission                                                        │
│                                                                           │
│  User clicks "Submit Issue"                                               │
│  → App.tsx.handleNewIssueSubmit()                                        │
│    • Create Issue object with:                                            │
│      - id: `issue-${Date.now()}`                                         │
│      - Analyzed data (title, desc, category)                             │
│      - Location (lat/lng from map click)                                 │
│      - mediaUrls: blob URLs (previews)                                    │
│      - votes: 1 (auto-vote)                                               │
│    • Add to issues state                                                  │
│    • Update user stats (issuesReported++)                                 │
│    • Check for badge unlocks                                              │
│    • Close modal                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Flow 2: User Queries Issue via Chat

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Opens Issue Details                                         │
│                                                                           │
│  User clicks marker on map                                               │
│  → IssueDetailsCard opens                                                │
│  → AgentChat component mounts                                            │
│  → Initial message: "Hi! I'm a helpful AI agent..."                      │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: User Types Query                                                 │
│                                                                           │
│  User types: "Can you summarize this issue?"                             │
│  OR clicks quick action button: "Summarize"                               │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Chat Agent Processing                                            │
│                                                                           │
│  AgentChat.handleSend(message)                                           │
│    → setMessages([...prev, {sender: 'user', text: message}])            │
│    → setIsLoading(true)                                                  │
│                                                                           │
│  → getAIResponseForIssue(issue, chatHistory, message)                     │
│      • Build prompt via createChatPrompt()                               │
│        - Include issue details (title, desc, category, votes, date)      │
│        - Format chat history as conversation                             │
│        - Append user query                                                │
│                                                                           │
│      • Call Gemini API:                                                  │
│        ai.models.generateContent({                                         │
│          model: 'gemini-2.5-flash',                                       │
│          contents: prompt                                                 │
│        })                                                                 │
│                                                                           │
│      • Extract response.text                                              │
│                                                                           │
│    → setMessages([...prev, {sender: 'agent', text: response}])           │
│    → setIsLoading(false)                                                  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Display Response                                                  │
│                                                                           │
│  Chat message bubbles render                                              │
│  Response appears in gray bubble (agent)                                  │
│  User can continue conversation                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Flow 3: User Drafts Email to Official

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Requests Email                                               │
│                                                                           │
│  User clicks "Draft email to official" button                            │
│  OR types: "Please draft an email to a city official about this."         │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Email Agent Processing                                           │
│                                                                           │
│  AgentChat.handleDraftEmail()                                            │
│    → Add user message to chat                                            │
│    → Add "Drafting email now..." message                                 │
│    → setIsLoading(true)                                                   │
│                                                                           │
│  → draftEmailToOfficial(issue)                                           │
│      • Build request via createEmailDraftRequest()                        │
│        - Prompt includes issue details                                    │
│        - Instructions: Professional, respectful, action-oriented        │
│                                                                           │
│      • Call Gemini API with JSON schema:                                  │
│        ai.models.generateContent({                                         │
│          model: 'gemini-2.5-flash',                                       │
│          contents: prompt,                                                │
│          config: {                                                         │
│            responseMimeType: "application/json",                           │
│            responseSchema: {                                               │
│              type: OBJECT,                                                │
│              properties: {to, subject, body}                              │
│            }                                                               │
│          }                                                                 │
│        })                                                                 │
│                                                                           │
│      • Parse JSON: {to, subject, body}                                   │
│                                                                           │
│    → setEmailData(data)                                                   │
│    → setIsLoading(false)                                                  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Email Preview Modal                                               │
│                                                                           │
│  EmailPreviewModal opens                                                  │
│  Displays:                                                                │
│    • To: "City Official" (or parsed recipient)                           │
│    • Subject: Generated subject line                                     │
│    • Body: Full email body                                               │
│                                                                           │
│  User can:                                                                │
│    • Review email                                                         │
│    • Click "Send Email" (simulated)                                       │
│    • Close modal                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Flow 4: Location-Based Suggestions

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: App Loads & Gets Location                                        │
│                                                                           │
│  App.tsx mounts                                                          │
│  → useGeolocation() hook activates                                        │
│  → navigator.geolocation.watchPosition()                                  │
│  → Location received: {latitude, longitude}                              │
│  → Map centers on user location                                          │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Suggestion Section Loads                                         │
│                                                                           │
│  SuggestionSection component mounts                                      │
│  → useEffect triggers                                                    │
│  → fetchSuggestions() called                                             │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Suggestion Agent Processing                                      │
│                                                                           │
│  getNearbySuggestions(location)                                           │
│    → createSuggestionRequest(location)                                    │
│      • Build prompt with location coordinates                             │
│      • Configure Google Maps Grounding tool:                              │
│        {                                                                  │
│          tools: [{googleMaps: {}}],                                      │
│          toolConfig: {                                                   │
│            retrievalConfig: {                                            │
│              latLng: {latitude, longitude}                               │
│            }                                                              │
│          }                                                                │
│        }                                                                  │
│                                                                           │
│    → Call Gemini API with grounding                                      │
│    → Parse response text (bullet points)                                 │
│    → Extract groundingChunks for attribution                             │
│                                                                           │
│  Result: 3 suggestions + Google Maps links                               │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Display Suggestions                                               │
│                                                                           │
│  SuggestionSection renders:                                               │
│    • "What to look for nearby?" header                                   │
│    • 3 clickable suggestion buttons                                      │
│    • "Powered by Google Maps data" section with links                    │
│                                                                           │
│  User can click suggestions → Alert/Pre-fill new issue form             │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Map

```
App.tsx (Main Orchestrator)
│
├─── Header
│    └── Profile button → ProfileModal
│
├─── Map (Leaflet)
│    ├── Issue markers (from issues state)
│    ├── Click handler → NewIssueModal OR IssueDetailsCard
│    └── Centers on user geolocation
│
├─── SuggestionSection
│    ├── Calls: getNearbySuggestions() on mount
│    ├── Uses: Suggestion Agent
│    └── Shows: 3 suggestions + Google Maps links
│
├─── IssueDetailsCard (shown when marker clicked)
│    ├── Issue details + media + votes
│    ├── CommentThread
│    └── AgentChat
│        ├── Uses: Chat Agent
│        ├── Uses: Email Agent
│        └── Shows: EmailPreviewModal
│
├─── NewIssueModal (shown when map clicked)
│    ├── File upload → Form Filler Agent (analyzeMediaAndSuggestDetails)
│    ├── Speech input → Form Filler Agent (refineDetailsWithSpeech)
│    └── Submit → Creates new Issue
│
├─── ProfileModal
│    └── Shows: User stats + badges (gamification)
│
└─── ARView (placeholder)
     └── Uses: useDeviceOrientation
```

---

## Data Flow & State Management

### State Hierarchy (App.tsx)

```typescript
State:
├── location (from useGeolocation)         // Real-time user position
├── user (User)                            // Stats, badges, voted issues
├── issues (Issue[])                       // All reported issues
├── selectedIssue (Issue | null)          // Currently viewed issue
├── isNewIssueModalOpen (boolean)         // New issue modal state
├── newIssuePosition ({lat, lng} | null)  // Where user clicked on map
├── isProfileModalOpen (boolean)           // Profile modal state
├── isARViewOpen (boolean)                 // AR view state
└── newlyUnlockedBadges (Badge[])          // Badge unlock notifications
```

### Data Transformations

```
User Input (File) 
  → Base64 (blobToBase64)
    → Form Filler Agent
      → AnalyzedIssueData
        → Issue Object
          → Issues Array
            → Map Markers

User Speech
  → Transcript (Web Speech API)
    → Form Filler Agent (refine)
      → Updated AnalyzedIssueData

User Location
  → GeolocationCoordinates
    → Suggestion Agent
      → Suggestions Array
        → UI Buttons

Issue + Query
  → Chat Agent
    → Response Text
      → Chat Message

Issue
  → Email Agent
    → EmailData JSON
      → EmailPreviewModal
```

---

## External API Integrations

### 1. **Google Gemini API**
   - **Endpoint**: Via `@google/genai` SDK
   - **Models Used**: `gemini-2.5-flash`
   - **Features**:
     - Multimodal input (images)
     - JSON schema responses
     - Google Maps Grounding (for suggestions)
   - **Agents**: All 4 agents use this API

### 2. **Esri ArcGIS Online**
   - **URL**: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
   - **Type**: Satellite/aerial imagery tiles
   - **Usage**: Leaflet tile layer

### 3. **Browser APIs**
   - **Geolocation API**: `navigator.geolocation.watchPosition()`
   - **Web Speech API**: `SpeechRecognition`
   - **Device Orientation API**: `DeviceOrientationEvent` (for AR)

---

## Key Design Patterns

1. **Agent-Oriented Architecture**: Specialized agents for specific tasks
2. **Stateful Workflows**: Multi-step processes (analyze → refine → submit)
3. **Progressive Enhancement**: AI pre-fills forms, user can refine
4. **Real-time Updates**: Geolocation watching, live map updates
5. **Modular Components**: Reusable, composable React components
6. **Type Safety**: Full TypeScript typing throughout
7. **Service Layer**: Abstracted API calls via `geminiService.ts`

---

## File Structure Summary

```
civic-lens/
├── agents/                    # AI Agent Logic
│   ├── chatAgent.ts          # Chat/conversation prompts
│   ├── emailAgent.ts         # Email drafting prompts
│   ├── formFillerAgent.ts    # Media analysis + refinement
│   └── suggestionAgent.ts    # Location-based suggestions
│
├── components/                # React UI Components
│   ├── AgentChat.tsx         # Chat interface
│   ├── Map.tsx               # Leaflet map component
│   ├── NewIssueModal.tsx     # Issue reporting form
│   ├── IssueDetailsCard.tsx  # Issue details + chat
│   ├── SuggestionSection.tsx # Nearby suggestions
│   └── EmailPreviewModal.tsx # Email preview
│
├── hooks/                     # Custom React Hooks
│   ├── useGeolocation.ts     # Location tracking
│   ├── useSpeechToText.ts   # Speech recognition
│   └── useDeviceOrientation.ts # AR orientation
│
├── services/                  # API Service Layer
│   └── geminiService.ts      # Gemini API wrapper
│
├── utils/                     # Utility Functions
│   ├── fileUtils.ts          # Base64 conversion
│   └── haversine.ts          # Distance calculations
│
├── data/                      # Static Data
│   └── gamification.ts       # Badges & user stats
│
├── types.ts                   # TypeScript type definitions
├── App.tsx                    # Main app orchestrator
└── index.tsx                  # Entry point
```

---

## Security & Privacy Considerations

1. **API Keys**: Stored in `process.env.API_KEY` (should use env variables)
2. **Geolocation**: User permission required, watched continuously
3. **Media Uploads**: Converted to base64 client-side (no server upload yet)
4. **Speech Recognition**: Browser-based, no cloud processing
5. **External Services**: Esri tiles (public), Gemini API (authenticated)

---

## Future Enhancements (Noted in Code)

1. **AR View**: Currently placeholder, needs full implementation
2. **Backend**: No server currently; uses mock data and blob URLs
3. **Real Uploads**: Media URLs are blob URLs, need actual storage
4. **Email Sending**: Currently simulated
5. **Persistent Storage**: All state is in-memory (React state)

