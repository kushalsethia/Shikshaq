import { createContext, useContext, useRef, ReactNode } from 'react';
import type { ChatbotHandle } from '@/components/Chatbot';

interface ChatbotContextType {
  chatbotRef: React.RefObject<ChatbotHandle> | null;
}

const ChatbotContext = createContext<ChatbotContextType>({ chatbotRef: null });

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const chatbotRef = useRef<ChatbotHandle>(null);

  return (
    <ChatbotContext.Provider value={{ chatbotRef }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  return useContext(ChatbotContext);
}

