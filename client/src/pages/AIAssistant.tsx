import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiChatHistory } from "@/data/mockData";
import { 
  Lightbulb, 
  BarChart3, 
  Leaf, 
  Clock, 
  Send, 
  User,
  Bot
} from "lucide-react";

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(aiChatHistory);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    "What crops should I plant for next season?",
    "How can I improve my soil health?",
    "What are the best cover crops for my region?",
    "How do I maximize carbon sequestration?",
  ];

  const aiResponses = [
    "Based on your farm's data, I recommend implementing drip irrigation which can reduce water usage by up to 40% while maintaining optimal crop growth.",
    "For improving soil health, consider adding organic compost and implementing cover cropping. These practices can increase soil organic matter by 15-20%.",
    "The best cover crops for your region include winter rye, crimson clover, and radishes. They help with nitrogen fixation and soil structure improvement.",
    "To maximize carbon sequestration, focus on no-till farming, cover crops, and rotational grazing. These can sequester 0.5-2 tons of CO₂ per acre annually.",
    "Consider adjusting your irrigation schedule based on weather forecasts. The upcoming dry period suggests increasing water application by 20%.",
    "Your soil pH levels indicate slightly acidic conditions. Adding agricultural lime could improve nutrient availability for your crops.",
  ];

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
    if (!messageText) return;

    // Generate unique IDs using timestamp to avoid duplicates
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
      // Try to connect to Spring Boot backend
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: messageText }),
      });

      let aiResponseText;
      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.response;
      } else {
        // Fallback to local AI responses
        aiResponseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      }

      const aiMessage: ChatMessage = {
        id: timestamp + 1,
        message: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Improved error handling with proper logging
      console.warn('Backend unavailable, using local AI responses:', error);
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage: ChatMessage = {
        id: timestamp + 1,
        message: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600 mt-2">
            Get instant answers to your farming questions and personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <Card className="lg:col-span-3 overflow-hidden">
            {/* Chat Header */}
            <CardHeader className="gradient-bg text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-white">Soma AI Assistant</CardTitle>
                  <p className="text-green-100 text-sm">Your sustainable farming expert</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.isUser ? "justify-end" : ""
                      }`}
                    >
                      {!message.isUser && (
                        <div className="w-8 h-8 bg-soma-green rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                          message.isUser
                            ? "bg-soma-green text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            message.isUser ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      {message.isUser && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-soma-green rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
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
                </div>
              </ScrollArea>

              {/* Quick Suggestions */}
              <div className="border-t p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">💡 Suggested Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="text-xs"
                    >
                      {suggestion.length > 30 ? `${suggestion.substring(0, 30)}...` : suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex space-x-3"
                >
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about sustainable farming..."
                    className="flex-1 focus:ring-soma-green focus:border-soma-green"
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-soma-green hover:bg-soma-green/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Data Analysis</h3>
                    <p className="text-xs text-gray-600">
                      Analyzes your farm data to provide insights and predictions
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Leaf className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Sustainability Focus</h3>
                    <p className="text-xs text-gray-600">
                      Specialized in regenerative and sustainable farming practices
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">24/7 Available</h3>
                    <p className="text-xs text-gray-600">
                      Get instant answers and recommendations anytime
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
