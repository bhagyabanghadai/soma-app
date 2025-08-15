import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MessageCircle, X, Minimize2, Maximize2, User, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: number;
  source?: string;
}

interface FloatingChatBoxProps {
  currentLocation?: {
    latitude: number;
    longitude: number;
    locationName?: string;
  };
  environmentalData?: {
    earthData?: any;
    weatherData?: any;
    airQualityData?: any;
  };
  userProfile?: {
    cropTypes?: string[];
    farmSize?: number;
    equipment?: string[];
  };
}

const FloatingChatBox: React.FC<FloatingChatBoxProps> = ({
  currentLocation,
  environmentalData,
  userProfile
}) => {
  // Try to get location and environmental data from dashboard if not provided
  const getContextFromPage = () => {
    try {
      // This is a simple way to get context from the current page
      // In a real app, you'd use a global state management solution
      const pathname = window.location.pathname;
      return {
        currentPage: pathname,
        pageTitle: document.title,
        // Add more page-specific context as needed
        ...(pathname === '/' && {
          dashboardContext: 'User is viewing the main sustainability dashboard'
        }),
        ...(pathname.includes('soil') && {
          soilContext: 'User is viewing soil health information'
        }),
        ...(pathname.includes('water') && {
          waterContext: 'User is viewing water usage information'  
        })
      };
    } catch (error) {
      return { currentPage: '/', pageTitle: 'Soma Dashboard' };
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      message: "Hello! I'm your AI agricultural assistant. I have access to all your farm data, location, weather, soil conditions, and air quality. Ask me anything about sustainable farming practices!",
      isUser: false,
      timestamp: new Date(),
      confidence: 5,
      source: "GLM-4.5"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickSuggestions = [
    "Analyze my current farm conditions",
    "Water management recommendations", 
    "Soil health assessment",
    "Weather impact on crops",
    "Air quality farming concerns",
    "Precision agriculture advice"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
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
      // Create comprehensive context for AI with page-specific information
      const pageContext = getContextFromPage();
      const contextData = {
        location: currentLocation ? {
          coordinates: { lat: currentLocation.latitude, lon: currentLocation.longitude },
          locationName: currentLocation.locationName
        } : null,
        environmental: environmentalData,
        user: userProfile || {
          cropTypes: ["corn", "soybeans"], // Default for demo
          farmSize: 200,
          equipment: ["GPS-guided planter", "variable rate spreader"]
        },
        timestamp: new Date().toISOString(),
        pageContext
      };

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

      let aiResponseText = "";
      let confidence = 3;
      let source = "Knowledge Base";

      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.response;
        source = data.source || "Knowledge Base";
        
        // Calculate confidence based on data freshness and context
        confidence = calculateConfidence(contextData, data);
      } else {
        throw new Error(`Backend responded with status ${response.status}`);
      }

      const aiMessage: ChatMessage = {
        id: timestamp + 1,
        message: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        confidence,
        source
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: ChatMessage = {
        id: timestamp + 1,
        message: "I'm having trouble processing your request. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date(),
        confidence: 1,
        source: "Error"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const calculateConfidence = (context: any, response: any): number => {
    let score = 3;
    
    // Data freshness
    if (context.environmental?.weatherData) score += 1;
    if (context.environmental?.airQualityData) score += 1;
    if (context.location?.coordinates) score += 1;
    
    // AI source quality
    if (response.source === 'GLM-4.5') score = Math.min(5, score + 1);
    
    return Math.max(1, Math.min(5, score));
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderConfidenceStars = (confidence?: number) => {
    if (!confidence) return null;
    
    return (
      <div className="flex items-center space-x-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= confidence ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{confidence}/5</span>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-soma-green hover:bg-soma-green/90 shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {messages.length > 1 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-6 h-6 rounded-full flex items-center justify-center text-xs">
            {messages.filter(m => !m.isUser).length - 1}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[32rem]'
      }`}>
        <CardHeader className="gradient-bg text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-white text-sm">AI Farm Assistant</CardTitle>
              {!isMinimized && (
                <p className="text-green-100 text-xs">GLM 4.5 • Context-Aware</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[28rem]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.isUser ? "justify-end" : ""
                    }`}
                  >
                    {!message.isUser && (
                      <div className="w-6 h-6 bg-soma-green rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs rounded-lg p-3 ${
                        message.isUser
                          ? "bg-soma-green text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs ${
                            message.isUser ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                        {!message.isUser && message.source && (
                          <Badge variant="outline" className="text-xs">
                            {message.source}
                          </Badge>
                        )}
                      </div>
                      {!message.isUser && renderConfidenceStars(message.confidence)}
                    </div>
                    {message.isUser && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-soma-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
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
            </ScrollArea>

            {/* Quick Suggestions */}
            <div className="border-t p-3">
              <div className="flex flex-wrap gap-1 mb-3">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-xs h-6 px-2"
                    disabled={isTyping}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your farm..."
                  className="flex-1 h-8 text-sm"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-soma-green hover:bg-soma-green/90 h-8 w-8 p-0"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingChatBox;