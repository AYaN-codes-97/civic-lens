# 🌍 Civic Lens

**An AR-powered civic engagement platform with AI-driven agents and gamification for community issue tracking and resolution.**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Civic Lens** is a revolutionary civic engagement platform designed to bridge the gap between citizens and municipalities. By combining **Augmented Reality (AR)**, **Artificial Intelligence**, and **gamification**, Civic Lens empowers communities to:

- **Visualize civic issues** in real-world environments using AR technology
- **Report and track** problems (potholes, streetlights, infrastructure issues) with precision
- **Receive intelligent suggestions** powered by Google Gemini AI
- **Engage with municipalities** through AI-powered communication channels
- **Earn badges and achievements** through active community participation
- **Collaborate on solutions** with other community members and city officials

### 🎭 Stakeholders

- **Citizens**: Community members reporting and resolving issues
- **Municipalities**: City officials managing and addressing reports
- **Developers**: Contributors extending platform capabilities

---

## ✨ Key Features

### 🔭 Augmented Reality (AR)
- Visualize civic issues in their real-world location
- AR markers show issue severity and type
- Interactive AR interface for detailed issue inspection
- Geolocation-aware AR positioning

### 🤖 AI-Powered Agents
The platform features four specialized AI agents powered by Google Gemini:

#### 💬 Chat Agent
- Conversational interface for user interactions
- Natural language understanding
- Context-aware responses
- Multi-turn conversation support

#### ✉️ Email Agent
- Email-to-issue conversion
- Automated email handling
- Template-based responses
- Notification management

#### 📋 Form Filling Agent
- Intelligent form completion
- Field validation and suggestions
- Multi-step form workflows
- Data extraction and processing

#### 💡 Suggestion Agent
- Smart recommendations based on issue context
- Historical data analysis
- Predictive problem solving
- Solution recommendations

### 🎮 Gamification System
- **Badge System**: Earn badges for various achievements
  - Reporter Badge: First issue reported
  - Community Helper: Multiple contributions
  - AR Explorer: Extensive AR usage
  - Problem Solver: Issue resolution participation
- **Achievement Tracking**: Visual progress indicators
- **Leaderboards**: Community engagement rankings
- **Points System**: Reward active participation

### 📍 Geolocation Features
- Real-time location tracking
- Proximity-based issue discovery
- Location-aware notifications
- Geographic data visualization

### 🎙️ Speech-to-Text
- Voice-based issue reporting
- Accessibility support
- Hands-free operation
- Multi-language support (foundation)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v14 or higher ([Download](https://nodejs.org/))
- **pnpm**: v7 or higher (`npm install -g pnpm`)
- **Git**: For version control
- **Google Gemini API Key**: For AI features ([Setup Guide](./SETUP_GEMINI_API.md))

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AYaN-codes-97/civic-lens.git
   cd civic-lens
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_APP_ENV=development
   ```
   
   > **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.
   
   For detailed API setup instructions, see [SETUP_GEMINI_API.md](./SETUP_GEMINI_API.md)

4. **Start Development Server**
   ```bash
   pnpm dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   pnpm build
   ```

### Quick Start Example

```typescript
// Example: Using the Chat Agent
import { chatAgent } from './agents/chatAgent';

const response = await chatAgent.chat({
  message: 'I found a pothole on Main Street',
  context: { location: 'Main St, Downtown' }
});
```

---

## 📁 Project Structure

```
civic-lens/
├── agents/                 # AI-powered agent implementations
│   ├── chatAgent.ts       # Chat conversation agent
│   ├── emailAgent.ts      # Email handling agent
│   ├── formFillerAgent.ts # Form automation agent
│   ├── suggestionAgent.ts # Smart suggestions agent
│   └── README.md          # Agent documentation
│
├── components/            # React UI components
│   ├── AgentChat.tsx      # Chat interface component
│   ├── ARView.tsx         # AR visualization component
│   ├── IssueDetailsCard.tsx # Issue detail display
│   ├── Map.tsx            # Map visualization
│   ├── BadgeDisplay.tsx   # Badge achievement display
│   ├── CommentThread.tsx  # Community comments
│   └── ... (other components)
│
├── services/              # Backend services
│   └── geminiService.ts   # Google Gemini API integration
│
├── hooks/                 # Custom React hooks
│   ├── useGeolocation.ts  # Geolocation hook
│   ├── useDeviceOrientation.ts # Device orientation hook
│   └── useSpeechToText.ts # Speech recognition hook
│
├── utils/                 # Utility functions
│   ├── haversine.ts       # Distance calculation
│   └── fileUtils.ts       # File handling utilities
│
├── data/                  # Static data files
│   └── gamification.ts    # Badge and achievement data
│
├── App.tsx                # Main React component
├── index.tsx              # Application entry point
├── index.html             # HTML template
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── package.json           # Project dependencies
└── .gitignore             # Git ignore patterns
```

### Directory Descriptions

| Directory | Purpose |
|-----------|---------|
| `/agents` | AI agent implementations using Google Gemini |
| `/components` | Reusable React components |
| `/services` | External service integrations |
| `/hooks` | Custom React hooks for shared logic |
| `/utils` | Helper functions and utilities |
| `/data` | Configuration and static data |

---

## 📝 Available Scripts

### Development
```bash
# Start development server with hot reload
pnpm dev
```

### Building
```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

### Code Quality
```bash
# Run ESLint for code linting
pnpm lint
```

### Other Commands
```bash
# Install dependencies
pnpm install

# Update dependencies
pnpm update
```

**Build Output**: Production build is created in the `dist/` directory.

---

## 📚 Documentation

Comprehensive documentation is available in the following files:

### Core Documentation
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Detailed setup and installation guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns

### Feature Documentation
- **[AGENTS_EXPLAINED.md](./AGENTS_EXPLAINED.md)** - In-depth agent functionality and usage
- **[AGENTS_VISUAL_GUIDE.md](./AGENTS_VISUAL_GUIDE.md)** - Visual guide to agent interactions

### Configuration
- **[SETUP_GEMINI_API.md](./SETUP_GEMINI_API.md)** - Google Gemini API setup guide
- **[AZURE_MIGRATION_GUIDE.md](./AZURE_MIGRATION_GUIDE.md)** - Azure deployment guide

### Process Documentation
- **[QUERY_FLOWS.md](./QUERY_FLOWS.md)** - Data flow and query processing
- **[AUDIT.md](./AUDIT.md)** - System audit logs and monitoring
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Future development roadmap

---

## 🤝 Contributing

We welcome contributions from the community! To get started:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/civic-lens.git
   cd civic-lens
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues (e.g., #1)
   - Wait for code review and feedback

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices
- Test your changes locally
- Keep commit messages descriptive
- Update relevant documentation

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔗 Quick Links

- **GitHub Repository**: [AYaN-codes-97/civic-lens](https://github.com/AYaN-codes-97/civic-lens)
- **Issues**: [Report a bug or request a feature](https://github.com/AYaN-codes-97/civic-lens/issues)
- **Discussions**: [Community discussions](https://github.com/AYaN-codes-97/civic-lens/discussions)

---

## 🙏 Acknowledgments

Built with:
- ⚡ [Vite](https://vitejs.dev/) - Next-generation build tool
- ⚛️ [React](https://reactjs.org/) - UI library
- 📘 [TypeScript](https://www.typescriptlang.org/) - Type safety
- 🤖 [Google Gemini AI](https://ai.google.dev/) - AI capabilities
- 📍 [Geolocation APIs](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) - Location services

---

## 📞 Support

For questions, issues, or suggestions:
- 📧 Email: mehtaayan18@gmail.com
- 🐛 [GitHub Issues](https://github.com/AYaN-codes-97/civic-lens/issues)
- 💬 [GitHub Discussions](https://github.com/AYaN-codes-97/civic-lens/discussions)

---

**Happy coding! 🚀**