
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, DailyPlan } from '../types';
import { Icons } from './Icons';
import { Button } from './ui/Button';
import { askNutri } from '../services/geminiService';

interface ChatTabProps {
  profile: UserProfile;
  plan: DailyPlan | null;
}

export const ChatTab: React.FC<ChatTabProps> = ({ profile, plan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Olá! Sou seu NutriGPT. Vi que seu objetivo é ${profile.goal.toLowerCase()}. Como posso ajudar com sua dieta ou treino hoje?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askNutri(profile, plan, userMsg.content);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Desculpe, tive um erro de conexão. Pode repetir?",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-100 bg-primary-50/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
            <Icons.ChatBubble className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Nutri Chat</h2>
            <p className="text-xs text-gray-500">Tire suas dúvidas com a IA</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} className="!px-3">
            <Icons.ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
