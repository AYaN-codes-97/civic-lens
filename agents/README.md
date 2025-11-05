# Civic Lens: Agentic Architecture

This document outlines the multi-agent architecture powering the intelligent features of the Civic Lens application. We have adopted a modular, task-oriented approach where specialized agents collaborate to perform complex workflows. The orchestration of these agents is managed to create robust and stateful interactions.

## Agent Orchestration

Instead of having a single monolithic AI prompt, we employ a team of specialized AI agents that communicate and hand off tasks to one another. This is known as Agent-to-Agent (A2A) communication. This workflow is managed by an **Orchestrator**, which directs the flow of information and tasks between agents.

This approach provides several key benefits:
1.  **Specialization:** Each agent has a single, well-defined responsibility (e.g., analyze an image, draft an email). This makes them more accurate and reliable.
2.  **Modularity:** Agents can be developed, tested, and improved independently.
3.  **Stateful Workflows:** The orchestrator maintains the state of a task as it moves through the system, allowing for more complex, multi-step processes like "analyze, then await user feedback, then refine."
4.  **Observability:** We can clearly see which agent is working at any given time, making it easier to debug and provide real-time feedback to the user.

---

## The Agent Team

### 1. Image Analysis Agent (`formFillerAgent.ts`)

*   **Task:** To perform the initial analysis of a user-submitted photo or video.
*   **Input:** A base64-encoded media file.
*   **Process:** This agent uses the Gemini multimodal model to "look" at the image. It identifies the core subject of the issue, determines its likely category, and writes a concise title and a detailed description.
*   **Output:** A structured JSON object (`AnalyzedIssueData`) containing the `title`, `description`, and `category`. This object serves as the "draft report."

### 2. Form Refinement Agent (`formFillerAgent.ts`)

*   **Task:** To update and improve the draft report using the user's spoken feedback.
*   **Input:** The `AnalyzedIssueData` JSON from the Image Analysis Agent, plus a new text transcript from the user.
*   **Process:** This agent is instructed to treat the initial analysis as the source of truth and intelligently merge the user's new details. For example, if the initial description was "A crack in the pavement," and the user says, "It's a huge pothole that's a danger to cyclists," the agent will update the description and potentially the title and category to reflect this new, more specific information.
*   **Output:** A final, user-verified `AnalyzedIssueData` JSON object.

### 3. Solutions Agent (`suggestionAgent.ts`)

*   **Task:** To provide actionable advice and external resources related to a reported issue.
*   **Input:** The details of a confirmed issue (`Issue` object).
*   **Process:** This agent leverages **Google Search Grounding**. It is tasked with finding official city websites, public reporting portals, or relevant contact information for the specific type of issue. For a broken streetlight, it will search for the "public works department" or "streetlight repair form" for that city.
*   **Output:** A structured JSON object containing a `suggestion` text and a relevant `link`.

### 4. Email Agent (`emailAgent.ts`)

*   **Task:** To draft a professional, formal email to a city official.
*   **Input:** The final, confirmed `Issue` object.
*   **Process:** This agent is given a strict persona—a concerned but professional resident. It synthesizes all the issue details (title, description, votes) into a polite but firm email, requesting action. It uses a JSON schema to ensure the output always contains `to`, `subject`, and `body` fields.
*   **Output:** A structured JSON object representing the final email.

### 5. Civic Scout Agent (`suggestionAgent.ts`)

*   **Task:** To help users discover potential issues in their immediate vicinity.
*   **Input:** The user's current geolocation coordinates.
*   **Process:** This agent uses **Google Maps Grounding**. It analyzes the user's location to understand the types of public spaces nearby (parks, busy roads, commercial areas) and suggests relevant issue categories to look out for.
*   **Output:** A list of simple text suggestions.

## Application Integration

The React UI is designed to be a window into this agentic workflow. When a user initiates a task like reporting an issue:
1.  The UI calls a single method from the **Orchestrator**.
2.  The Orchestrator starts the workflow, beginning with the first agent (e.g., Image Analysis).
3.  The UI listens for state changes from the Orchestrator and updates to show the user what's happening (e.g., "Analyzing image...", "Awaiting your feedback...").
4.  User interactions (like speaking) are sent back to the Orchestrator, which then activates the next agent in the sequence.

This creates a seamless, transparent, and highly interactive experience that makes the user feel like they are collaborating directly with a team of intelligent assistants.
