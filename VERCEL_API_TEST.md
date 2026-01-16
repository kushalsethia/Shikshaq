# Testing Gemini API on Vercel

## ✅ Quick Test (Deployed Site)

1. **Deploy to Vercel** (if not already deployed)
   - Push your code to GitHub
   - Vercel will auto-deploy
   - Or manually deploy: `vercel --prod`

2. **Open your deployed site**
   - Go to your Vercel deployment URL
   - Look for the "Ask AI" button (bottom-right, beside WhatsApp)

3. **Test the chatbot**
   - Click "Ask AI" button
   - Ask: "Is ShikshAq free?"
   - If it responds with an answer → ✅ API key is working!
   - If it shows an error or times out → ❌ Check logs

---

## 📊 Check Vercel Logs

### Method 1: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **"Deployments"** tab
4. Click on the latest deployment
5. Go to **"Functions"** tab
6. Look for `/api/chat` function
7. Click on it to see logs

**What to look for:**
- ✅ `200` status → API is working
- ✅ Response time ~1-3 seconds → Fast response
- ❌ `500` or `API key not configured` → API key issue
- ❌ `Request timeout` → Network/model issue

### Method 2: Real-time Logs

1. Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Filter by: `/api/chat`
4. Test the chatbot on your site
5. Watch logs appear in real-time

**Good logs:**
```
POST /api/chat 200 in 1.2s
```

**Bad logs:**
```
POST /api/chat 500 in 0.1s
Error: API key not configured
```

---

## 🔍 Troubleshooting Vercel Logs

### Error: "API key not configured"
**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `GEMINI_API_KEY` exists
3. Check spelling (must be exact: `GEMINI_API_KEY`)
4. Check it's added to correct environments (Production, Preview, Development)
5. **Redeploy** after adding/changing env vars

### Error: "Request timeout"
**Possible causes:**
- API key is invalid
- Network issues
- Google API is slow

**Solution:**
1. Verify API key format (should start with `AIza...`)
2. Check Google AI Studio to confirm API key is valid
3. Test again (might be temporary)

### Error: "Failed to generate response"
**Possible causes:**
- API key doesn't have access to Gemini API
- Billing not enabled on Google Cloud project
- API quota exceeded

**Solution:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Verify API key is active
3. Check if billing is enabled (required for Gemini API)

---

## ✅ Success Indicators

**If working correctly:**
- ✅ Chatbot responds to questions
- ✅ Response time: 1-3 seconds
- ✅ Logs show `200` status
- ✅ No errors in Vercel logs

**Quick test questions:**
- "Is ShikshAq free?"
- "How does it work?"
- "Are teachers verified?"

All should get quick, relevant responses!

---

## 🚀 After Verification

Once you confirm it's working:
- ✅ API key is correctly configured
- ✅ Chatbot is functional
- ✅ Ready for production use

**Monitor in production:**
- Check Vercel logs periodically
- Watch for timeouts or errors
- Track response times

