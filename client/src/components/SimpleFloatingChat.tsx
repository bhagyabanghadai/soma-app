import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const SimpleFloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      message: "Hello! I'm your SOMA AI Assistant. I can help you with farming questions, analyze your environmental data, and provide agricultural insights. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    
    // Add user message
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
      // Get current location and environmental context if available
      const storedLocation = localStorage.getItem('soma-dashboard-location');
      const farmProfile = localStorage.getItem('soma-farm-profile');
      
      let contextData = {};
      if (storedLocation) {
        try {
          const location = JSON.parse(storedLocation);
          contextData = {
            location: {
              coordinates: { lat: location.latitude, lon: location.longitude },
              locationName: location.locationName
            }
          };
        } catch (error) {
          console.log('Could not parse location data');
        }
      }

      if (farmProfile) {
        try {
          const profile = JSON.parse(farmProfile);
          contextData = { ...contextData, farmProfile: profile };
        } catch (error) {
          console.log('Could not parse farm profile');
        }
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: messageText,
          context: contextData
        }),
      });

      let aiResponseText = "I'm here to help with your farming questions. Please let me know what specific information you need.";

      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.response || aiResponseText;
      } else {
        throw new Error(`Server responded with status ${response.status}`);
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
        message: "I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {/* Chat Bubble */}
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            data-testid="button-open-chat"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </Button>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col border border-gray-200 transition-all duration-300 ease-out transform scale-100"
        style={{
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-sm">SOMA AI Assistant</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs opacity-90">Online</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
            data-testid="button-close-chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isUser && (
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="flex flex-col max-w-xs">
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    message.isUser
                      ? "bg-blue-600 text-white rounded-br-md shadow-sm"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                  }`}
                >
                  {message.message}
                </div>
                <span
                  className={`text-xs text-gray-400 mt-1 px-2 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.isUser && (
                <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 rounded-bl-md shadow-sm border border-gray-100">
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

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-sm border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
              data-testid="input-chat-message"
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-2 min-w-[40px]"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleFloatingChat;