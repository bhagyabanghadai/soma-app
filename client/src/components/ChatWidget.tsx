import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      message: "🌱 Welcome! I'm SOMA, your smart farming assistant. I can help you with soil health, irrigation, weather insights, and sustainable farming practices. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const messageText = inputMessage.trim();
    if (!messageText) return;

    const timestamp = Date.now();
    
    const userMessage: ChatMessage = {
      id: timestamp,
      message: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: messageText,
          context: {}
        }),
      });

      let aiResponseText = "I'm here to help with your farming questions. Please let me know what you need.";

      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.response || aiResponseText;
      }

      const aiMessage: ChatMessage = {
        id: timestamp + 1,
        message: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: timestamp + 1,
        message: "I'm having trouble right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white rounded-full p-4 shadow-lg hover:shadow-xl flex items-center justify-center group"
          data-testid="chat-open-button"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium whitespace-nowrap">
            🌾 Chat with SOMA
          </span>
        </button>
      ) : (
          <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border">
            <div className="bg-green-600 text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <div>
                  <span className="font-bold text-lg">SOMA</span>
                  <div className="text-xs opacity-90">Smart Farming Assistant</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-700 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.isUser
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-800 shadow-sm border-l-4 border-l-green-500"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about farming, soil, weather..."
                  className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isTyping}
                />
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700 rounded-full p-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default ChatWidget;