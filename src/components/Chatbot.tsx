import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink } from '@/utils/whatsapp';
import DOMPurify from 'dompurify';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Quick responses for common FAQ questions (instant, no API call). Order matters: more specific first.
// Only add "contact" keywords when user is clearly asking how to reach Shikshaq support.
const QUICK_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['pay through shikshaq', 'pay shikshaq', 'payment to shikshaq', 'where does payment go', 'commission', 'who do i pay'],
    response: 'All payments are made directly to the teacher. Shikshaq does not handle payments and takes zero commission. Fees are decided between you and the teacher.',
  },
  {
    keywords: ['free', 'cost', 'price', 'charge', 'platform fee', 'hidden fee'],
    response: 'Yes! Shikshaq is completely free for students and parents. There are no platform charges or hidden fees. You only pay tuition fees directly to the teacher.',
  },
  {
    keywords: ['which city', 'which cities', 'which localities', 'where does shikshaq', 'kolkata only', 'other cities'],
    response: 'Shikshaq currently operates only in Kolkata and covers most major localities. Expansion to other cities is planned for the future.',
  },
  {
    keywords: ['which class', 'which grade', 'which boards', 'icse', 'cbse', 'ib', 'igcse', 'state board'],
    response: 'Shikshaq supports Classes 1–12, UG, and PG. Boards supported: ICSE/ISC, CBSE, IB, IGCSE, and State Boards.',
  },
  {
    keywords: ['how do i find', 'how to find tutor', 'find right tutor', 'choose tutor'],
    response: 'Use filters for subject, class, board, and locality. Compare profiles, experience, and student reviews. You can contact multiple teachers to find the best match.',
  },
  {
    keywords: ['how do i contact a teacher', 'contact teacher', 'message teacher', 'reach teacher'],
    response: 'Each teacher profile has a direct contact option. You can message or call them directly—no account needed to browse or contact.',
  },
  {
    keywords: ['what is shikshaq', 'what is shikshaq and how', 'about shikshaq', 'tell me about shikshaq'],
    response: 'Shikshaq helps students and parents discover tuition teachers in Kolkata. You browse profiles, compare experience and reviews, and contact teachers directly to start classes.',
  },
  {
    keywords: ['verified', 'verification', 'verified badge', 'are tutors verified'],
    response: 'A Verified badge means a Shikshaq team member has personally vouched for that teacher. Shikshaq does not guarantee teaching outcomes or accept liability.',
  },
  {
    keywords: ['reviews real', 'are reviews', 'reviews genuine', 'teacher reviews'],
    response: 'Reviews are from genuine student or parent experiences. Teachers cannot remove reviews; they help keep things transparent.',
  },
  {
    keywords: ['account', 'sign up', 'create account', 'do i need account'],
    response: 'No account is needed to browse or contact tutors. You can use Shikshaq without signing up.',
  },
  {
    keywords: ['who is shikshaq for', 'shikshaq for'],
    response: 'Shikshaq is for students and parents looking for reliable tutors across subjects, grades, boards, and exams.',
  },
  {
    keywords: ['negotiate fee', 'negotiate fees', 'trial class', 'demo class'],
    response: 'Fees and arrangements are agreed between you and the teacher. Trial or demo classes depend on the teacher—ask them when you contact.',
  },
  {
    keywords: ['responsibility', 'liable', 'shikshaq responsible', 'dispute', 'payment dispute'],
    response: 'Shikshaq is a discovery platform and does not take responsibility for teaching quality, payments, or disputes. All arrangements are between you and the teacher.',
  },
  {
    keywords: ['teacher not responding', 'teacher didn\'t reply', 'no response from teacher'],
    response: 'You can contact Team Shikshaq via Contact Us. We\'ll try to reach the teacher on your behalf within 48 hours.',
  },
  {
    keywords: ['change tutor', 'switch tutor', 'another tutor'],
    response: 'Yes. You can contact another tutor anytime—there\'s no commitment to stay with one teacher.',
  },
  {
    keywords: ['phone number safe', 'data safe', 'personal data', 'privacy'],
    response: 'Yes. Shikshaq doesn\'t sell or share your personal info. Only the teacher you contact sees your details.',
  },
  {
    keywords: ['what is on profile', 'teacher profile', 'profile shows'],
    response: 'Profiles show subjects, classes, boards, experience, locations, teaching mode (online/home), fees if provided, and student reviews.',
  },
  {
    keywords: ['online class', 'online classes', 'zoom', 'google meet'],
    response: 'Teachers usually use Zoom, Google Meet, or WhatsApp video. You need a stable connection, camera/mic, and a quiet space. Confirm the platform with the teacher.',
  },
  {
    keywords: ['group class', 'one to one', 'one-on-one', 'batch'],
    response: 'It depends on the teacher—some do group batches, others one-to-one. Ask when you contact them.',
  },
  {
    keywords: ['recommend a tutor', 'assign a tutor', 'suggest a tutor', 'shikshaq recommend'],
    response: 'Shikshaq doesn\'t assign or recommend one tutor. You browse profiles and choose teachers based on your preferences and reviews. You can contact multiple teachers to compare.',
  },
  {
    keywords: ['guarantee', 'improvement in marks', 'improve marks', 'results guaranteed'],
    response: 'Shikshaq doesn\'t guarantee marks or results. Academic performance depends on student effort, teacher compatibility, and regular practice.',
  },
  {
    keywords: ['trial class', 'demo before', 'try before finalising'],
    response: 'A trial class is a good idea to evaluate teaching style and comfort. Availability depends on the teacher—ask when you contact them.',
  },
  {
    keywords: ['stop classes', 'discontinue', 'leave tutor', 'not satisfied'],
    response: 'Yes. You can stop or change anytime. Continuation depends on mutual agreement between you and the teacher.',
  },
  {
    keywords: ['refund', 'refunds', 'shikshaq handle refund'],
    response: 'Shikshaq doesn\'t handle payments or refunds. Refund discussions are between you and the teacher since you pay them directly.',
  },
  {
    keywords: ['weekend class', 'weekend only', 'schedule change'],
    response: 'Scheduling (including weekend-only or timing changes) is decided directly between you and the teacher. Confirm with them.',
  },
  {
    keywords: ['first time', 'never had tuition', 'where to start'],
    response: 'Browse tutors for your class and subject, shortlist a few, speak to them, and try an initial class before deciding. You can compare 2–4 teachers.',
  },
  {
    keywords: ['how to contact you', 'contact shikshaq', 'whatsapp number', 'support number', 'reach you', 'customer support', 'contact support', 'your email', 'your whatsapp'],
    response: 'You can reach Team Shikshaq via WhatsApp at +91 8240980312 or email at join.shikshaq@gmail.com. We aim to respond within 48 hours.',
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Shikshaq assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputShaking, setInputShaking] = useState(false);

  const shakeInput = () => {
    setInputShaking(true);
    setTimeout(() => setInputShaking(false), 400);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Allow opening chatbot from outside (e.g. FAQ "Ask our AI assistant" link)
  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener('shikshaq-open-chat', openChat);
    return () => window.removeEventListener('shikshaq-open-chat', openChat);
  }, []);

  useEffect(() => {
    // Save current viewport scale before opening
    const savedViewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

    if (isOpen) {
      // Prevent horizontal scroll on mobile
      document.body.style.overflowX = 'hidden';
      
      // Prevent zoom by setting maximum-scale and user-scalable=no temporarily
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      // Delay focus to reduce zoom effect
      const focusTimeout = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);

      return () => {
        clearTimeout(focusTimeout);
      };
    } else {
      // Restore viewport settings and overflow when closed
      if (viewport && savedViewport) {
        viewport.setAttribute('content', savedViewport);
      } else if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
      document.body.style.overflowX = '';
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
      if (import.meta.env.DEV) {
        console.error('Chat error:', error);
      }
      
      let errorMessage = "Sorry, I'm having trouble right now. ";
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMessage = "The request is taking too long. For quick answers, try asking 'Is Shikshaq free?' or 'How do I contact you?'. You can also reach us directly via WhatsApp (+91 8240980312).";
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
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.96] transition-[transform,box-shadow] duration-200"
        aria-label="Ask AI"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Chat Window - Uses part of screen, smaller on mobile */}
      {isOpen && (
        <div className="fixed bottom-24 left-3 right-3 md:left-auto md:right-6 md:w-[28rem] h-[50vh] md:h-[600px] max-h-[400px] md:max-h-[600px] z-50 bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300">
          {/* Header - Mobile: Larger, Desktop: Compact */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm md:text-base truncate">Shikshaq Assistant</h3>
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
                  <div 
                    className="text-sm whitespace-pre-wrap break-words [&_a]:text-primary [&_a]:underline [&_a]:font-medium [&_a]:hover:text-primary/80"
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        let content = message.content;
                        
                        // First, sanitize to remove any potentially malicious HTML
                        // This prevents XSS attacks and malformed HTML
                        content = DOMPurify.sanitize(content, { 
                          ALLOWED_TAGS: [],
                          KEEP_CONTENT: true 
                        });
                        
                        // Convert WhatsApp links (https://wa.me/...) to clickable links
                        content = content.replace(
                          /(https:\/\/wa\.me\/[\d]+)/g, 
                          '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium">Contact us on WhatsApp →</a>'
                        );
                        
                        // If contact info is mentioned but no link present, add a WhatsApp link
                        // Only add if there's no existing WhatsApp link
                        if ((content.includes('8240980312') || content.includes('WhatsApp') || content.toLowerCase().includes('contact')) && !content.includes('wa.me') && !content.includes('<a href')) {
                          const whatsappLink = getWhatsAppLink('8240980312');
                          content += `\n\n<a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium">Contact us on WhatsApp →</a>`;
                        }
                        
                        // Convert line breaks to <br> for proper rendering
                        content = content.replace(/\n/g, '<br>');
                        
                        // Final sanitization with allowed tags to prevent XSS attacks
                        // Allow only safe tags: <a> with href, target, rel attributes, and <br>
                        content = DOMPurify.sanitize(content, {
                          ALLOWED_TAGS: ['a', 'br', 'p', 'strong', 'em'],
                          ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
                          ALLOWED_URI_REGEXP: /^(https?|mailto):/i,
                        });
                        
                        return content;
                      })()
                    }} 
                  />
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
                className={`flex-1 px-3 py-2.5 md:px-4 md:py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base md:text-sm min-h-[44px] md:min-h-0${inputShaking ? ' shake' : ''}`}
                style={{ fontSize: '16px' }}
                disabled={loading}
              />
              <Button
                onClick={() => {
                  if (!input.trim() && !loading) { shakeInput(); return; }
                  handleSend();
                }}
                disabled={loading}
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

