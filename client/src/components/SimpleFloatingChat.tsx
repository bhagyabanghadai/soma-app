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
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300 hover:scale-110"
          data-testid="button-open-chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-green-700 h-8 w-8 p-0"
            data-testid="button-close-chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isUser && (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-gray-600" />
                </div>
              )}
              
              <div className="flex flex-col max-w-xs">
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.isUser
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {message.message}
                </div>
                <span
                  className={`text-xs text-gray-500 mt-1 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.isUser && (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 rounded-bl-sm">
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
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your farm..."
              className="flex-1 text-sm"
              disabled={isTyping}
              data-testid="input-chat-message"
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isTyping}
              className="bg-green-600 hover:bg-green-700 px-3 py-2"
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