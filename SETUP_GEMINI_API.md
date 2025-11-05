# Google Gemini API Setup Guide

## What API You Need

You need the **Google AI Studio (Gemini API)** to use with this application.

## Step-by-Step: Getting Your API Key

### Step 1: Go to Google AI Studio

Visit: **https://makersuite.google.com/app/apikey**

Or go to: **https://aistudio.google.com/app/apikey**

### Step 2: Sign In

- Sign in with your Google account
- If you don't have a Google account, create one first

### Step 3: Create API Key

1. Click **"+ Create API Key"** button
2. You may be asked to create a Google Cloud Project (if you don't have one)
   - Just click through - it will auto-create one for you
3. Select where to create the API key:
   - **Create API key in new project** (recommended for first time)
   - OR **Create API key in existing project** (if you have one)
4. Click **Create API key in new project**

### Step 4: Copy Your API Key

You'll see your API key displayed. It will look something like:
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANT**: Copy this key immediately - you may not be able to see it again!

### Step 5: Set Up Your API Key in the Project

1. **Create a `.env` file** in the root of your project (same level as `package.json`)

2. **Add your API key** to the `.env` file:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Important Notes:**
- Replace `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` with your actual API key
- Don't put quotes around the key
- Don't commit the `.env` file to git (add it to `.gitignore`)

### Step 6: Verify Your Setup

Your `vite.config.ts` already reads from `GEMINI_API_KEY`, so it should work automatically!

## Example `.env` File

Create a file named `.env` in your project root:

```env
# Google Gemini API Key
GEMINI_API_KEY=AIzaSyYourActualKeyHere123456789
```

## Testing Your API Key

1. Start your development server:
```bash
npm run dev
```

2. Try uploading an image or starting a chat
3. Check the browser console for any API errors

## API Key Security

### ✅ DO:
- Store API key in `.env` file
- Add `.env` to `.gitignore` (so it's not committed to git)
- Use environment variables in production
- Regenerate keys if they're accidentally exposed

### ❌ DON'T:
- Commit API keys to git
- Hardcode keys in source code
- Share keys publicly
- Use the same key for development and production

## Check Your `.gitignore`

Make sure `.env` is in your `.gitignore` file. If not, add it:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

## Pricing & Limits

### Free Tier
- **60 requests per minute** (RPM)
- **1,500 requests per day** (RPD)
- Perfect for development and testing

### Paid Tier
- Pay-as-you-go pricing
- Higher rate limits
- Check: https://ai.google.dev/pricing

The app uses `gemini-2.5-flash` which is very affordable even for production use.

## API Models Used

Your app uses:
- **Model**: `gemini-2.5-flash`
- **Features**:
  - Text generation (chat, email)
  - Multimodal (image analysis)
  - JSON schema responses
  - Google Maps grounding (for suggestions)

## Troubleshooting

### "API Key not found"
- Make sure `.env` file exists in project root
- Check that `GEMINI_API_KEY` is spelled correctly
- Restart your dev server after creating `.env`

### "Invalid API Key"
- Verify you copied the entire key correctly
- Make sure there are no extra spaces or quotes
- Check that the key hasn't been disabled in Google AI Studio

### "Quota exceeded"
- You've hit the free tier limit
- Wait for the quota to reset (daily)
- Or upgrade to paid tier for higher limits

### "API Key not authorized"
- Check if you enabled the Gemini API in your Google Cloud project
- Go to: https://console.cloud.google.com/apis/library
- Search for "Generative Language API" and enable it

## Enable Required APIs

If you get permission errors, make sure these APIs are enabled:

1. Go to: **https://console.cloud.google.com/apis/library**
2. Search for and enable:
   - **Generative Language API**
   - **Maps JavaScript API** (for Google Maps grounding - optional)

## Quick Reference

| Item | Value |
|------|-------|
| API Provider | Google AI Studio |
| API URL | https://aistudio.google.com/app/apikey |
| Environment Variable | `GEMINI_API_KEY` |
| SDK Package | `@google/genai` |
| Model Used | `gemini-2.5-flash` |
| File to Create | `.env` in project root |

## Next Steps

1. ✅ Get API key from Google AI Studio
2. ✅ Create `.env` file with `GEMINI_API_KEY=your_key_here`
3. ✅ Add `.env` to `.gitignore`
4. ✅ Restart dev server: `npm run dev`
5. ✅ Test the app!

Your app is already configured to use this API key - just add it to `.env` and you're ready to go! 🚀

