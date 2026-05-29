import { GeminiMessage, sendGeminiMessage } from '@shared/infrastructure/gemini/client';
import { useState } from 'react';

export interface ChatMessage {
  id:        string;
  role:      'user' | 'bot';
  text:      string;
  createdAt: Date;
}

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id:        'welcome',
      role:      'bot',
      text:      '¡Hola! Soy VetBot 🐾 Tu asistente de PetAdopt. ¿En qué puedo ayudarte hoy? Puedo orientarte sobre salud, cuidados y alimentación de mascotas.',
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`, role: 'user', text, createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const history: GeminiMessage[] = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role:  m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const response = await sendGeminiMessage(history, text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`, role: 'bot', text: response, createdAt: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      setError(e.message ?? 'Error al contactar el asistente');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([{
    id: 'welcome', role: 'bot',
    text: '¡Hola! Soy VetBot 🐾 ¿En qué puedo ayudarte?',
    createdAt: new Date(),
  }]);

  return { messages, sendMessage, isLoading, error, clearChat };
}