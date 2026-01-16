// Vercel serverless function for Gemini AI chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Optimized system prompt - concise and focused for faster responses
    const systemPrompt = `You are ShikshAq's AI assistant. Answer questions about ShikshAq briefly and helpfully.

KEY FACTS:
- Free platform connecting students/parents with verified tutors in Kolkata
- Search by subject, class, location, board, mode (online/offline), class size
- Direct WhatsApp contact with teachers - no middlemen
- Platform is FREE for users - only pay teachers directly
- All tutors verified (identity, qualifications, experience)
- Contact: WhatsApp +91 8240980312 or email join.shikshaq@gmail.com

RULES:
- Keep answers brief (1-2 sentences, max 3)
- Use friendly, warm tone
- If unsure, suggest contacting the team
- Only answer ShikshAq-related questions

COMMON QUESTIONS:
Q: Is ShikshAq free? A: Yes! Completely free for students/parents. No platform fees.
Q: How does it work? A: Search teachers, browse profiles, contact via WhatsApp directly.
Q: Are tutors verified? A: Yes! All tutors are verified for identity and qualifications.
Q: What if I can't find a tutor? A: Contact us and we'll help find a match.`;

    // Build conversation history for context (last 5 messages to keep it fast)
    // Convert history from frontend format to simple text
    const historyArray = Array.isArray(history) ? history : [];
    const recentHistory = historyArray.slice(-5);
    let conversationContext = '';
    if (recentHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n';
      recentHistory.forEach((msg: { role?: string; parts?: { text?: string }[]; content?: string }) => {
        const role = msg.role === 'model' ? 'assistant' : msg.role || 'user';
        const content = msg.parts?.[0]?.text || msg.content || '';
        if (role === 'user') {
          conversationContext += `User: ${content}\n`;
        } else if (role === 'assistant' || role === 'model') {
          conversationContext += `Assistant: ${content}\n`;
        }
      });
    }

    // Use Gemini 2.5 Flash-Lite (fastest and available on free tier)
    // Fallback to other models if needed
    const modelsToTry = [
      'gemini-2.5-flash-lite',    // Fastest, free tier model
      'gemini-1.5-flash-latest',  // Latest flash model (fallback)
      'gemini-1.5-pro-latest',    // Latest pro model (fallback)
      'gemini-pro',                // Standard pro model (fallback)
    ];
    let lastError: Error | null = null;
    let result: { response: { text: () => string } } | null = null;

    // Concise prompt for faster processing
    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser: ${message}\n\nAssistant:`;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            maxOutputTokens: 150, // Limit response length for speed
            temperature: 0.7, // Balanced creativity vs consistency
          },
        });

        // Timeout: 15 seconds (gemini-pro is reliable but may be slower)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 15000);
        });

        const generatePromise = model.generateContent(fullPrompt);
        result = await Promise.race([generatePromise, timeoutPromise]) as { response: { text: () => string } };
        
        console.log(`Success with model: ${modelName}`);
        break; // Success, exit loop
      } catch (modelError: unknown) {
        const err = modelError as Error;
        lastError = err;
        console.warn(`Model ${modelName} failed:`, err.message);
        // Continue to next model
      }
    }

    if (!result) {
      // All models failed
      const error = lastError || new Error('All models failed');
      console.error('Gemini API error:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 200),
      });
      
      // If all models failed with 404, suggest checking available models
      if (error.message?.includes('404 Not Found') || error.message?.includes('is not found')) {
        console.error('Note: None of the models are available. Check Google AI Studio to see which models your API key has access to.');
        console.error('Common models: gemini-1.5-flash-latest, gemini-1.5-pro-latest, gemini-pro');
      }
      
      throw error;
    }

    const response = result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error: unknown) {
    const err = error as Error & { status?: number };
    console.error('Chat handler error:', {
      message: err.message,
      name: err.name,
      status: err.status,
    });

    // Return user-friendly error message
    return res.status(500).json({
      error: 'Failed to generate response',
      message: err.message?.includes('API key') 
        ? 'API key not configured' 
        : err.message?.includes('timeout')
        ? 'Request timeout - please try again'
        : 'Unable to generate response',
    });
  }
}
