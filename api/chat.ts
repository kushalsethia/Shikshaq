// Vercel serverless function for Gemini AI chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // System prompt with FAQ context
    const systemPrompt = `You are a friendly and helpful AI assistant for ShikshAq, a tutoring platform that connects students with verified tuition teachers in Kolkata, India.

Your role:
- Answer questions about ShikshAq based on the provided FAQ context
- Be concise, friendly, and helpful
- If you don't know something or the question is outside the FAQ context, politely suggest contacting the team via WhatsApp (+91 8240980312) or email (join.shikshaq@gmail.com)
- Keep responses brief (2-3 sentences maximum)
- Use a conversational, warm tone

FAQ Context:
ShikshAq is a platform that connects students and parents with verified tuition teachers across Kolkata. We make it easy to find, compare, and reach out to quality educators without any intermediaries.

Common Questions and Answers:

1. What exactly is ShikshAq?
ShikshAq is a platform that connects students and parents with verified tuition teachers across Kolkata. We make it easy to find, compare, and reach out to quality educators without any intermediaries.

2. How does it actually work?
Simply search for teachers by subject, grade, or locality. Browse through detailed profiles, read reviews, and when you find someone you like, reach out to them directly via WhatsApp. No middlemen, no hassle.

3. Is this safe? Are the tutors actually verified?
Yes! All tutors on our platform go through a verification process. We verify their identity, qualifications, and teaching experience to ensure you connect with genuine educators.

4. What if I search and can't find the right tutor?
If you can't find a suitable tutor, you can contact us and we'll help you find the right match. We're constantly adding new teachers to our platform.

5. What if I connect with a tutor and it doesn't work out?
That's okay! There's no commitment. You can always browse and connect with other tutors until you find the perfect fit for your learning needs.

6. How much does this cost? What about payments?
ShikshAq is completely free for students and parents! There are no commissions or hidden fees. You negotiate the tuition fees directly with the teacher.

7. Is ShikshAq free to use?
Yes! ShikshAq is completely free for students and parents. There are no platform fees, commissions, or hidden charges. The platform is free to use, and you only pay the tuition fees directly to the teacher.

8. What if I need help? How do I reach your team?
You can reach us via WhatsApp at +91 8240980312 or email at join.shikshaq@gmail.com. Our team is always ready to help you with any questions or concerns you might have.

Additional Information:
- Teachers can be searched by subject, class, location, board, mode of teaching, and class size
- All teachers have detailed profiles with their qualifications, experience, and teaching areas
- Direct communication via WhatsApp for each teacher
- Platform is free to use for students and parents
- Based in Kolkata, India

Remember: Only answer questions related to ShikshAq. For other topics, politely redirect to contact the team.`;

    // Prepare the full prompt with system instructions
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    // Try different models with fallback
    const modelsToTry = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-pro'];
    let lastError: Error | null = null;
    let result: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Generate response with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
        });

        const generatePromise = model.generateContent(fullPrompt);
        result = await Promise.race([generatePromise, timeoutPromise]) as any;
        break; // Success, exit loop
      } catch (modelError: any) {
        lastError = modelError;
        console.warn(`Model ${modelName} failed, trying next...`, modelError.message);
        // Continue to next model
      }
    }

    if (!result) {
      throw lastError || new Error('All models failed');
    }

    const response = result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        message: error.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
