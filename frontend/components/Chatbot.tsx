'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  className?: string;
}

export default function Chatbot({ className = '' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Independent Local AI Logic (No ChatGPT/API dependencies)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking layer
      
      const text = messageText.toLowerCase();
      let responseText = "I'm not exactly sure what you mean. Could you ask about recycling, rewards, or our smart bins? (عذراً، لم أفهم تماماً. هل يمكنك الاستفسار عن إعادة التدوير، المكافآت، أو الحاويات؟)";
      let defaultSuggestions = ["How do I start recycling?", "What rewards can I earn?", "Where are the bins?"];
      
      if (text.includes('recycl') || text.includes('تدوير')) {
        responseText = "To start recycling, simply locate one of our Smart Bins, scan your QR code from your dashboard, and deposit your materials. You will instantly earn points! (للبدء بإعادة التدوير، ابحث عن حاوياتنا الذكية، امسح رمز الاستجابة السريعة، وسجل نقاطك فوراً!)";
      } else if (text.includes('reward') || text.includes('مكافأة') || text.includes('مكافآت') || text.includes('point') || text.includes('نقاط')) {
        responseText = "You can redeem your earned points in the Rewards tab to unlock exclusive discounts from our luxury partners. (يمكنك استبدال نقاطك في قسم المكافآت للحصول على خصومات حصرية من شركائنا.)";
      } else if (text.includes('bin') || text.includes('حاوية') || text.includes('موقع') || text.includes('where')) {
        responseText = "You can find all active Smart Bins by visiting the 'Smart Bins' interactive map on your dashboard. (يمكنك العثور على جميع الحاويات الذكية النشطة من خلال خريطة المواقع في لوحة التحكم.)";
      } else if (text.includes('hello') || text.includes('hi') || text.includes('مرحبا') || text.includes('السلام')) {
        responseText = "Hello there! I am the independent Luxora Assistant. How can I help you today? (مرحباً! أنا مساعد لوكسورا المستقل. كيف يمكنني مساعدتك اليوم؟)";
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot' as const,
        timestamp: new Date(),
        suggestions: defaultSuggestions,
      };

      setMessages(prev => [...prev, botMessage]);
      setSuggestions(defaultSuggestions);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error ? error.message : 'Sorry, I\'m having trouble connecting. Please try again later.',
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-luxury-primary rounded-full flex items-center justify-center text-white shadow-luxury hover:shadow-luxury-hover hover-scale relative group"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-elegant-gold rounded-full animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-dark-charcoal text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with Luxora AI
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[32rem] bg-white rounded-2xl shadow-luxury-hover flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-luxury-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
              <div>
                <h3 className="font-semibold">Luxora AI Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-luxury-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold text-luxury-primary mb-2">Hello! I'm Luxora AI</h4>
                <p className="text-sm text-luxury-secondary mb-4">
                  Ask me anything about recycling, rewards, or environmental tips!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['How do I start recycling?', 'What rewards can I earn?', 'Where are the bins?'].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-luxury-soft text-luxury-primary text-sm rounded-full hover:bg-luxury-primary hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-luxury-primary text-white'
                      : 'bg-luxury-soft text-luxury-primary'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-luxury-secondary'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-luxury-soft p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-luxury-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-luxury-primary rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-luxury-primary rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isTyping && (
            <div className="px-4 py-2 border-t border-luxury-soft">
              <p className="text-xs text-luxury-secondary mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 bg-luxury-soft text-luxury-primary text-xs rounded-full hover:bg-luxury-primary hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-luxury-soft">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-luxury-soft border border-luxury-secondary/20 rounded-full text-sm focus:outline-none focus:border-luxury-primary focus:ring-1 focus:ring-luxury-primary"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-luxury-primary text-white rounded-full flex items-center justify-center hover:bg-luxury-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
