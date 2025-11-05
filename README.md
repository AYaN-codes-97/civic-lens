# 🌆 Civic Lens

> An AR-powered civic engagement platform that empowers residents to report, discuss, and take action on local community issues using AI-assisted tools.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange.svg)](https://ai.google.dev/)

## 📖 Overview

**Civic Lens** is a modern civic engagement application that transforms how residents interact with their communities. By combining cutting-edge technologies like Augmented Reality (AR), AI-powered agents, real-time mapping, and gamification, Civic Lens makes it easy and rewarding to report local issues such as potholes, graffiti, broken streetlights, and more.

### What Makes Civic Lens Special?

- **AI-Powered Issue Reporting**: Upload a photo, and AI automatically analyzes and fills out the report for you
- **Conversational AI Assistant**: Chat with an AI agent to get help understanding and resolving issues
- **Professional Email Drafting**: Automatically generate professional emails to city officials
- **Location-Based Suggestions**: Get intelligent suggestions for nearby issues based on your location
- **Interactive Maps**: Visualize community issues on a real-time interactive map
- **Gamification**: Earn badges and track your community impact with an engaging reward system
- **Speech-to-Text**: Use voice input to refine issue descriptions
- **Augmented Reality**: (Coming soon) View issues through AR overlays

## ✨ Key Features

### 🤖 AI-Powered Agents

Civic Lens includes four specialized AI agents powered by Google Gemini:

1. **Form Filler Agent** 📸
   - Analyzes uploaded images/videos to identify issues
   - Automatically fills out issue report forms with title, description, and category
   - Refines details based on speech input

2. **Chat Agent** 💬
   - Provides conversational assistance about specific issues
   - Answers questions and provides context
   - Summarizes issue details on demand

3. **Email Agent** 📧
   - Drafts professional emails to city officials
   - Uses issue details to create compelling, action-oriented messages
   - Maintains respectful and effective tone

4. **Suggestion Agent** 📍
   - Suggests nearby civic issues to look for based on your GPS location
   - Uses Google Maps Grounding for accurate, location-aware recommendations
   - Provides context about your neighborhood

### 🗺️ Interactive Mapping

- **Live Maps**: Powered by Leaflet.js with Esri World Imagery tiles
- **Real-time Geolocation**: Automatically centers on your location
- **Issue Markers**: Visual representation of all reported issues
- **Click to Report**: Simply click on the map to report a new issue at that location

### 🎮 Gamification System

- **Badges**: Earn achievements for community contributions
- **Stats Tracking**: Monitor your impact (issues reported, votes cast, comments made)
- **Profile Dashboard**: View your progress and accomplishments
- **Community Recognition**: See how you're making a difference

### 🎤 Voice & AR Capabilities

- **Speech-to-Text**: Use browser's Web Speech API to add details by voice
- **Device Orientation**: Leverage device sensors for AR features
- **AR View**: (In development) View civic issues through augmented reality

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/))
- **npm** or **pnpm**: Package manager (comes with Node.js)
- **Google Gemini API Key**: Required for AI features ([Get your API key](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AYaN-codes-97/civic-lens.git
   cd civic-lens
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using pnpm:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```bash
   touch .env
   ```

   Add your Google Gemini API key to the `.env` file:

   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   > **Note**: See [SETUP_GEMINI_API.md](./SETUP_GEMINI_API.md) for detailed instructions on obtaining your API key.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:5173` (or another port if 5173 is busy).

5. **Grant location permissions**

   When prompted by your browser, allow location access for the best experience.

### Testing the Application

Try these features to ensure everything works:

- [ ] **Location**: Map centers on your current location
- [ ] **Suggestions**: AI-generated suggestions appear on the right side
- [ ] **Image Upload**: Upload a photo → AI auto-fills the report form
- [ ] **Chat**: Click a marker → Type a message → AI responds
- [ ] **Email**: Click "Draft email" → Preview the generated email
- [ ] **Voice Input**: Click the microphone → Speak to refine your report

## 📁 Project Structure

```
civic-lens/
├── agents/                    # AI Agent Logic
│   ├── chatAgent.ts          # Conversational AI for issue discussions
│   ├── emailAgent.ts         # Professional email drafting
│   ├── formFillerAgent.ts    # Image analysis and form auto-fill
│   └── suggestionAgent.ts    # Location-based issue suggestions
│
├── components/                # React UI Components
│   ├── AgentChat.tsx         # Chat interface with AI agent
│   ├── Map.tsx               # Interactive Leaflet map
│   ├── NewIssueModal.tsx     # Issue reporting form
│   ├── IssueDetailsCard.tsx  # Detailed view of issues
│   ├── SuggestionSection.tsx # Location-based suggestions
│   ├── EmailPreviewModal.tsx # Email draft preview
│   ├── ProfileModal.tsx      # User profile and badges
│   ├── BadgeDisplay.tsx      # Gamification badges
│   ├── ARView.tsx            # Augmented Reality view (placeholder)
│   └── ...                   # Other UI components
│
├── hooks/                     # Custom React Hooks
│   ├── useGeolocation.ts     # Real-time location tracking
│   ├── useSpeechToText.ts    # Speech recognition
│   └── useDeviceOrientation.ts # Device orientation for AR
│
├── services/                  # API Service Layer
│   └── geminiService.ts      # Google Gemini API wrapper
│
├── utils/                     # Utility Functions
│   ├── fileUtils.ts          # File and Base64 conversion
│   └── haversine.ts          # Distance calculations
│
├── data/                      # Static Data
│   └── gamification.ts       # Badges and user stats configuration
│
├── types.ts                   # TypeScript type definitions
├── App.tsx                    # Main application orchestrator
├── index.tsx                  # Application entry point
├── vite.config.ts            # Vite configuration
└── package.json              # Project dependencies and scripts
```

### Key Directories Explained

- **`/agents`**: Contains the specialized AI agents that power intelligent features. Each agent has a specific role (form filling, chat, email, suggestions).
  
- **`/components`**: React components that make up the user interface. Each component is self-contained and reusable.

- **`/hooks`**: Custom React hooks for accessing browser APIs (geolocation, speech recognition, device orientation).

- **`/services`**: Service layer that abstracts API communications, making the codebase more maintainable.

- **`/utils`**: Helper functions for common operations like file conversion and distance calculations.

- **`/data`**: Static configuration data for features like gamification badges and initial user stats.

## 📜 Available Scripts

In the project directory, you can run:

### `npm run dev` (or `pnpm dev`)

Starts the development server with hot module replacement (HMR).

- Opens at `http://localhost:5173`
- Auto-reloads when you make changes
- Shows helpful error messages in the browser

### `npm run build` (or `pnpm build`)

Builds the app for production to the `dist` folder.

- Optimizes and minifies code
- Bundles all assets
- Ready for deployment

### `npm run preview` (or `pnpm preview`)

Previews the production build locally.

- Serves the `dist` folder
- Use this to test the production build before deploying

## 📚 Documentation

Comprehensive documentation is available to help you understand and work with Civic Lens:

- **[Getting Started Guide](./GETTING_STARTED.md)** - Quick start guide after setting up your API key
- **[Architecture Overview](./ARCHITECTURE.md)** - Complete system architecture and data flow diagrams
- **[Agents Explained](./AGENTS_EXPLAINED.md)** - In-depth guide to all AI agents and how they work
- **[Gemini API Setup](./SETUP_GEMINI_API.md)** - Step-by-step guide to obtaining and configuring your API key
- **[Visual Guide](./AGENTS_VISUAL_GUIDE.md)** - Visual diagrams of agent workflows

### Additional Resources

- **[Query Flows](./QUERY_FLOWS.md)** - Understanding data flow through the application
- **[Next Steps](./NEXT_STEPS.md)** - Planned features and improvements
- **[Audit Report](./AUDIT.md)** - Code quality and security audit findings

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue describing the bug and how to reproduce it
- ✨ **Suggest Features**: Share your ideas for new features or improvements
- 📖 **Improve Documentation**: Help make our docs clearer and more comprehensive
- 💻 **Submit Pull Requests**: Fix bugs or implement new features

### Development Guidelines

1. **Fork the repository** and create a new branch for your feature
2. **Follow the existing code style** and TypeScript conventions
3. **Test your changes** thoroughly before submitting
4. **Write clear commit messages** describing your changes
5. **Update documentation** if you're adding new features
6. **Ensure your code builds** without errors: `npm run build`

### Code Style

- Use **TypeScript** for type safety
- Follow **React best practices** and hooks guidelines
- Keep components **small and focused** on a single responsibility
- Write **descriptive variable names** and add comments for complex logic
- Use **async/await** for asynchronous operations

## 🔐 Security & Privacy

- **API Keys**: Always store API keys in `.env` files (never commit them to git)
- **Geolocation**: User permission is required; location tracking is transparent
- **Media Uploads**: Currently processed client-side only (no server storage)
- **Data Privacy**: All issue data is stored locally in browser state (no backend yet)

> **Important**: Make sure `.env` is in your `.gitignore` file to prevent accidental exposure of sensitive keys.

## 🛠️ Technologies Used

- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 6.2
- **AI/ML**: Google Gemini API (gemini-2.5-flash model)
- **Mapping**: Leaflet.js with Esri World Imagery
- **Speech**: Browser Web Speech API
- **Geolocation**: Browser Geolocation API
- **UI Components**: Custom React components with inline styles
- **Markdown Rendering**: react-markdown

## 📄 License

This project is currently unlicensed. Please contact the repository owner for licensing information.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent features
- **Leaflet** and **Esri** for mapping capabilities
- **React** and **Vite** communities for excellent tools and documentation
- All contributors and community members who help improve Civic Lens

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/AYaN-codes-97/civic-lens/issues)
- **Repository**: [github.com/AYaN-codes-97/civic-lens](https://github.com/AYaN-codes-97/civic-lens)

---

**Made with ❤️ for civic engagement and community empowerment**