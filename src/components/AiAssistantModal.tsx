import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { askSevaAssistant } from '../services/geminiService';

interface AiAssistantModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  language,
  isOpen,
  onClose
}) => {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: language === 'bn' 
        ? 'নমস্কার! আমি সেবা সহকারী AI। লক্ষ্মীর ভাণ্ডার, স্বাস্থ্য সাথী, বার্ধক্য ভাতা বা যেকোনো সরকারি প্রকল্পের তথ্য ও নথিপত্রের প্রশ্ন আমাকে জিজ্ঞাসা করতে পারেন।'
        : 'Namaste! I am the Seva AI Advisor. Ask me anything regarding West Bengal government schemes, eligibility criteria, or document checklists.'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const aiReply = await askSevaAssistant(userText, language);
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: language === 'bn' 
          ? 'লক্ষ্মীর ভাণ্ডার প্রকল্পের জন্য ২৫-৬০ বছর বয়সী সকল মহিলা আবেদন করতে পারেন। প্রয়োজনীয় নথি: আধার কার্ড, স্বাস্থ্য সাথী কার্ড, ও এসসি/এসটি সার্টিফিকেট (যদি থাকে)।'
          : 'For Lakshmir Bhandar scheme, women aged 25-60 yrs are eligible. Required documents: Aadhaar card, Swasthya Sathi card, Bank Passbook copy, and SC/ST certificate if applicable.'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Seva Assistant AI</h3>
              <span className="text-[10px] text-indigo-400 font-mono">Gemini AI Scheme Advisor</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div 
                className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-indigo-600 text-white font-medium' 
                    : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 text-neutral-400 text-xs font-mono items-center">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing scheme guidelines...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-3 border-t border-neutral-800 flex items-center gap-2">
          <input 
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={language === 'bn' ? 'যেকোনো সরকারি বিষয় জিজ্ঞাসা করুন...' : 'Ask about Lakshmir Bhandar, Swasthya Sathi eligibility or required docs...'}
            className="flex-1 bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-500"
          />
          <button 
            type="submit"
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
