# Query Flows - Quick Reference

## Flow 1: Report New Issue

```
User Action
    │
    ├─► Clicks Map Location
    │   └─► Opens NewIssueModal
    │
    ├─► Uploads Image(s)
    │   │
    │   ├─► File → Base64 (fileUtils.ts)
    │   │
    │   └─► Form Filler Agent: analyzeMediaAndSuggestDetails()
    │       │
    │       ├─► Input: {mimeType, data: base64}
    │       ├─► Gemini API (multimodal)
    │       └─► Output: {title, description, category}
    │           └─► Form Auto-Filled
    │
    ├─► [Optional] Speaks into Microphone
    │   │
    │   ├─► Web Speech API → Transcript
    │   │
    │   └─► Form Filler Agent: refineDetailsWithSpeech()
    │       │
    │       ├─► Input: Current Details + Transcript
    │       ├─► Gemini API
    │       └─► Output: Refined {title, description, category}
    │
    └─► Submits Form
        │
        ├─► Creates Issue Object
        ├─► Updates User Stats (issuesReported++)
        ├─► Checks Badge Unlocks
        └─► Adds to Issues Array → Map Marker Appears
```

## Flow 2: Chat About Issue

```
User Opens Issue
    │
    ├─► Clicks Marker → IssueDetailsCard Opens
    │   └─► AgentChat Component Mounts
    │
    ├─► User Types Query OR Clicks Quick Action
    │   │
    │   └─► AgentChat.handleSend()
    │       │
    │       ├─► Add User Message to Chat
    │       ├─► Set Loading State
    │       │
    │       └─► Chat Agent: getAIResponseForIssue()
    │           │
    │           ├─► createChatPrompt()
    │           │   ├─► Include Issue Details
    │           │   ├─► Format Chat History
    │           │   └─► Append User Query
    │           │
    │           ├─► Gemini API Call
    │           │   model: gemini-2.5-flash
    │           │
    │           └─► Response Text
    │               └─► Displayed in Chat Bubble
    │
    └─► [Optional] User Requests Email
        │
        └─► AgentChat.handleDraftEmail()
            │
            ├─► Email Agent: draftEmailToOfficial()
            │   │
            │   ├─► createEmailDraftRequest()
            │   │   └─► Build Professional Email Prompt
            │   │
            │   ├─► Gemini API with JSON Schema
            │   │   └─► {to, subject, body}
            │   │
            │   └─► EmailPreviewModal Opens
```

## Flow 3: Get Nearby Suggestions

```
App Loads
    │
    ├─► useGeolocation() Hook
    │   └─► navigator.geolocation.watchPosition()
    │       └─► Location: {latitude, longitude}
    │
    ├─► Map Centers on Location
    │
    └─► SuggestionSection Mounts
        │
        ├─► useEffect Triggers
        │
        └─► Suggestion Agent: getNearbySuggestions()
            │
            ├─► createSuggestionRequest()
            │   ├─► Build Prompt with Location
            │   └─► Configure Google Maps Grounding
            │
            ├─► Gemini API with Maps Tool
            │   │
            │   ├─► Tool: {googleMaps: {}}
            │   └─► Retrieval: {latLng: {lat, lng}}
            │
            └─► Parse Response
                ├─► 3 Suggestions (bullets)
                └─► Grounding Chunks (attribution links)
                    └─► Displayed in SuggestionSection
```

## Agent Decision Tree

```
User Action
    │
    ├─► Uploads Image
    │   └─► Form Filler Agent (Analyze)
    │       └─► Input: Image Base64
    │           └─► Output: {title, description, category}
    │
    ├─► Speaks Refinement
    │   └─► Form Filler Agent (Refine)
    │       └─► Input: Current Data + Speech Transcript
    │           └─► Output: Updated {title, description, category}
    │
    ├─► Types Chat Message
    │   └─► Chat Agent
    │       └─► Input: Issue + History + Query
    │           └─► Output: Natural Language Response
    │
    ├─► Requests Email
    │   └─► Email Agent
    │       └─► Input: Issue Details
    │           └─► Output: {to, subject, body}
    │
    └─► App Loads with Location
        └─► Suggestion Agent
            └─► Input: Geolocation
                └─► Output: 3 Suggestions + Maps Links
```

## Data Pipeline

```
RAW INPUT
    │
    ├─► Image File
    │   └─► blobToBase64() → Base64 String
    │       └─► Form Filler Agent → AnalyzedIssueData
    │           └─► Issue Object → Issues Array → Map Marker
    │
    ├─► Speech Audio
    │   └─► Web Speech API → Transcript String
    │       └─► Form Filler Agent → Refined AnalyzedIssueData
    │
    ├─► Text Query
    │   └─► Chat Agent → Response String
    │       └─► Chat Message → Chat UI
    │
    └─► Geolocation
        └─► watchPosition() → GeolocationCoordinates
            ├─► Map Centers
            └─► Suggestion Agent → Suggestions Array
```

## State Updates Chain

```
User Action → Component Handler → Service Call → Agent → API → Response → State Update → UI Re-render

Example:
User Uploads Image
    ↓
NewIssueModal.handleFileChange()
    ↓
analyzeMediaAndSuggestDetails() [service]
    ↓
formFillerAgent.analyzeMediaAndSuggestDetails() [agent]
    ↓
Gemini API.generateContent()
    ↓
JSON Response {title, description, category}
    ↓
setDetails(analyzedData) [state]
    ↓
Form Fields Auto-Fill [UI]
```

