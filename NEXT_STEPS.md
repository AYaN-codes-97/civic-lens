# Next Steps After Adding Google API Key

## ✅ Quick Checklist

### 1. Verify Your `.env` File
- [ ] Created `.env` file in project root (same folder as `package.json`)
- [ ] Added `GEMINI_API_KEY=your_actual_key_here`
- [ ] No quotes around the key
- [ ] No spaces before or after the `=`

Example `.env` file:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 2. Install Dependencies (if not already done)
```bash
npm install
```

This installs:
- `@google/genai` - Google Gemini SDK
- `react` - React framework
- `leaflet` - Map library
- Other dependencies

### 3. Start Development Server
```bash
npm run dev
```

This will:
- Start Vite dev server on port 3000
- Load your API key from `.env`
- Open the app in your browser

### 4. Test the Application

#### Test 1: Check Console for Errors
1. Open browser DevTools (F12)
2. Check Console tab for any API errors
3. If you see "API key not found" → check your `.env` file
4. If you see "Invalid API key" → verify your key is correct

#### Test 2: Test Geolocation
1. Allow location access when prompted
2. Map should center on your location
3. You should see suggestions appear on the right side

#### Test 3: Test Image Upload & AI Analysis
1. Click anywhere on the map
2. "New Issue Modal" should open
3. Click "Select Images" and upload a photo
4. AI should analyze the image and auto-fill the form
5. Watch for "AI is analyzing your image..." message

#### Test 4: Test Chat
1. Click on an issue marker (red/pink markers on map)
2. Issue details card should open
3. Type a message in the chat box (e.g., "Can you summarize this issue?")
4. AI should respond with a summary

#### Test 5: Test Email Drafting
1. In the chat, click "Draft email to official" button
2. Email preview modal should open
3. Should show a professional email draft

#### Test 6: Test Suggestions
1. With location enabled, check the right sidebar
2. Should see "What to look for nearby?" section
3. Should show 3 AI-generated suggestions
4. May show Google Maps links below (if grounding works)

## 🔧 Troubleshooting

### Issue: "API key not found" or undefined
**Solution:**
- Make sure `.env` file is in project root
- Restart dev server after creating `.env`
- Check spelling: `GEMINI_API_KEY` (not `GEMINI_API`)

### Issue: "Invalid API key"
**Solution:**
- Double-check you copied the entire key
- Make sure no extra spaces or quotes
- Verify key is still active in Google AI Studio

### Issue: "Quota exceeded"
**Solution:**
- You've hit free tier limits (60 req/min, 1500/day)
- Wait for quota to reset
- Or upgrade to paid tier

### Issue: Location not working
**Solution:**
- Allow location access in browser
- Check browser permissions
- Try HTTPS (geolocation requires secure context)

### Issue: Map not loading
**Solution:**
- Check internet connection
- Esri tiles require internet access
- Check browser console for errors

## 🚀 Ready to Use!

Once everything works, you can:

1. **Report Issues**: Click map → Upload image → AI auto-fills → Submit
2. **Chat About Issues**: Click marker → Chat with AI about the issue
3. **Draft Emails**: Click "Draft email to official" to generate professional emails
4. **Get Suggestions**: See AI-powered suggestions for nearby issues to report
5. **Track Progress**: View your stats and badges in profile

## 📝 What Happens Next

When you:
- **Upload an image**: Form Filler Agent analyzes it → Auto-fills form
- **Type in chat**: Chat Agent responds based on issue context
- **Request email**: Email Agent drafts professional email
- **Get suggestions**: Suggestion Agent uses Google Maps + your location

All powered by your Google Gemini API key! 🎉

