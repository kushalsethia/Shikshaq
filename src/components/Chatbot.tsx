import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_CONTEXT = `ShikshAq is a platform that connects students and parents with verified tuition teachers across Kolkata. We make it easy to find, compare, and reach out to quality educators without any intermediaries.

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

7. What if I need help? How do I reach your team?
You can reach us via WhatsApp at +91 8240980312 or email at join.shikshaq@gmail.com. Our team is always ready to help you with any questions or concerns you might have.

Additional Information:
- Teachers can be searched by subject, class, location, board, mode of teaching, and class size
- All teachers have detailed profiles with their qualifications, experience, and teaching areas
- Direct communication via WhatsApp for each teacher
- Platform is free to use for students and parents
- Based in Kolkata, India`;

// Quick responses for common questions (instant, no API call needed)
const QUICK_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['free', 'cost', 'price', 'charge', 'fee', 'payment', 'money'],
    response: 'Yes! ShikshAq is completely free for students and parents. There are no platform fees, commissions, or hidden charges. You only pay the tuition fees directly to the teacher.',
  },
  {
    keywords: ['what is', 'about', 'tell me'],
    response: 'ShikshAq is a platform that connects students and parents with verified tuition teachers across Kolkata. You can search for teachers by subject, class, or location, and contact them directly via WhatsApp. No middlemen, no hassle!',
  },
  {
    keywords: ['how', 'work', 'does it work'],
    response: 'Simply search for teachers by subject, grade, or locality. Browse through detailed profiles, read reviews, and when you find someone you like, reach out to them directly via WhatsApp. No middlemen, no hassle.',
  },
  {
    keywords: ['safe', 'verified', 'trust', 'genuine'],
    response: 'Yes! All tutors on our platform go through a verification process. We verify their identity, qualifications, and teaching experience to ensure you connect with genuine educators.',
  },
  {
    keywords: ['contact', 'help', 'support', 'reach', 'email', 'whatsapp'],
    response: 'You can reach us via WhatsApp at +91 8240980312 or email at join.shikshaq@gmail.com. Our team is always ready to help you with any questions or concerns you might have.',
  },
];

const SYSTEM_PROMPT = `You are a friendly and helpful AI assistant for ShikshAq, a tutoring platform that connects students with verified tuition teachers in Kolkata, India.

Your role:
- Answer questions about ShikshAq based on the provided FAQ context
- Be concise, friendly, and helpful
- If you don't know something or the question is outside the FAQ context, politely suggest contacting the team via WhatsApp (+91 8240980312) or email (join.shikshaq@gmail.com)
- Keep responses brief (2-3 sentences maximum)
- Use a conversational, warm tone

FAQ Context:
${FAQ_CONTEXT}

Remember: Only answer questions related to ShikshAq. For other topics, politely redirect to contact the team.`;

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your ShikshAq assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getQuickResponse = (message: string): string | null => {
    const lowerMessage = message.toLowerCase();
    
    // Check if message matches any quick response keywords
    for (const quickResponse of QUICK_RESPONSES) {
      const matchesKeyword = quickResponse.keywords.some(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      );
      
      if (matchesKeyword) {
        return quickResponse.response;
      }
    }
    
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    
    // Check for quick response first (instant, no API call)
    const quickResponse = getQuickResponse(userMessage);
    if (quickResponse) {
      // Small delay to make it feel natural
      await new Promise(resolve => setTimeout(resolve, 300));
      setMessages((prev) => [...prev, { role: 'assistant', content: quickResponse }]);
      return;
    }

    // If no quick response, use API
    setLoading(true);

    try {
      // Reduced timeout to 15 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.response) {
        throw new Error('No response from server');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = "Sorry, I'm having trouble right now. ";
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMessage = "The request is taking too long. For quick answers, try asking 'Is ShikshAq free?' or 'How do I contact you?'. You can also reach us directly via WhatsApp (+91 8240980312).";
      } else if (error.message?.includes('API key')) {
        errorMessage = "The chatbot is temporarily unavailable. Please contact us directly via WhatsApp (+91 8240980312) or email (join.shikshaq@gmail.com).";
      } else {
        errorMessage += "Please contact us directly via WhatsApp (+91 8240980312) or email (join.shikshaq@gmail.com) for assistance.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button with ? icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Ask AI"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Chat Window - Uses part of screen, not full screen */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] md:w-[28rem] h-[calc(100vh-8rem)] max-h-[600px] z-50 bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300">
          {/* Header - Mobile: Larger, Desktop: Compact */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm md:text-base truncate">ShikshAq Assistant</h3>
                <p className="text-xs text-muted-foreground hidden md:block">AI-powered FAQ helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 md:p-2 hover:bg-muted active:bg-muted rounded-full transition-colors flex-shrink-0 -mr-1 md:mr-0"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 md:w-5 md:h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages - Mobile: Better padding and spacing */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 overscroll-contain">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-3 py-2 md:px-4 md:py-2.5">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Mobile: Better touch targets and padding */}
          <div className="p-3 md:p-4 border-t border-border flex-shrink-0 bg-card safe-area-pb">
            <div className="flex gap-2 items-end">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2.5 md:px-4 md:py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px] md:min-h-0"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                size="icon"
                className="flex-shrink-0 h-[44px] w-[44px] md:h-auto md:w-auto"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center hidden md:block">
              Powered by Google Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}

