# Getting Started - After Adding API Key

## ✅ You're Almost Ready!

### Quick Start (3 Steps)

### Step 1: Verify Your `.env` File

Make sure you have a `.env` file in your project root with:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Location**: The `.env` file should be in:
```
civic-lens/
├── .env          ← HERE (same folder as package.json)
├── package.json
├── vite.config.ts
└── ...
```

### Step 2: Start the Development Server

Run this command:
```bash
npm run dev
```

This will:
- Start Vite dev server
- Load your API key from `.env`
- Open your app at `http://localhost:3000`

### Step 3: Test the App!

Open your browser and:
1. **Allow location access** when prompted
2. **Map loads** with your location
3. **Click on the map** to report an issue
4. **Upload a photo** - AI will analyze it automatically
5. **Click a marker** to see issue details and chat

## 🧪 Testing Checklist

Test these features to make sure everything works:

- [ ] **Location**: Map centers on your location
- [ ] **Suggestions**: See AI suggestions on the right side
- [ ] **Image Upload**: Upload a photo → AI auto-fills form
- [ ] **Chat**: Click a marker → Type a message → AI responds
- [ ] **Email**: Click "Draft email" → See email preview

## 🐛 Common Issues

### "API key not found"
→ Make sure `.env` file exists and has `GEMINI_API_KEY=...`
→ Restart dev server after creating `.env`

### "Invalid API key"
→ Double-check you copied the entire key correctly
→ No extra spaces or quotes

### Map doesn't load
→ Need internet connection (uses Esri tiles)
→ Check browser console for errors

### Location not working
→ Allow location access in browser
→ Geolocation needs permission

## 📚 What Each Feature Does

1. **Form Filler Agent**: Analyzes images → Auto-fills issue forms
2. **Chat Agent**: Answers questions about issues
3. **Email Agent**: Drafts professional emails to officials
4. **Suggestion Agent**: Provides location-based tips

All powered by Google Gemini! 🚀

