import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, memo, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useSidebar } from "@/lib/sidebar-context";
// Header removed as requested
import { Sparkle, MessageCircle, Send, Bot } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// Memoized animated background component to prevent re-renders when typing in chat
const AnimatedBackground = memo(({ theme }: { theme: string }) => {
  return (
    <>
      {/* Animated floating elements */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`float-${i}`}
          className="absolute animate-float opacity-30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            zIndex: 0,
          }}
        >
          {i % 4 === 0 ? (
            <div className={`${theme === 'dark' ? 'text-pink-300' : 'text-pink-500'} text-xl`}>✦</div>
          ) : i % 4 === 1 ? (
            <div className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'} text-sm`}>✧</div>
          ) : i % 4 === 2 ? (
            <div className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} text-lg`}>✴</div>
          ) : (
            <div className={`${theme === 'dark' ? 'bg-purple-300' : 'bg-purple-500'} h-1.5 w-1.5 rounded-full`}></div>
          )}
        </div>
      ))}
      
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`shooting-star-${i}`}
          className={`absolute h-0.5 bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-indigo-300' : 'via-indigo-500'} to-transparent`}
          style={{
            width: `${30 + Math.random() * 80}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            opacity: 0.7 + Math.random() * 0.3,
            transform: `rotate(${-45 + Math.random() * 90}deg)`,
            animation: `shootingStarAnim ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            zIndex: 0,
          }}
        ></div>
      ))}
    </>
  );
});

// Memoized header component with animated stars
const ChatHeader = memo(({ theme }: { theme: string }) => {
  return (
    <div className="flex justify-between items-start mb-8 animate-fade-in relative">
      {/* Header card with animated background */}
      <div className={`absolute -inset-6 rounded-xl overflow-hidden -z-10 ${theme === 'dark' 
        ? 'bg-[#302844]/80' 
        : 'bg-gradient-to-r from-blue-100 to-purple-100 shadow-md'}`}>
        {/* Animated stars in header */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`header-star-${i}`}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              opacity: 0.6 + Math.random() * 0.4,
              zIndex: 1,
            }}
          >
            <Sparkle className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} size={i % 2 === 0 ? 14 : 18} />
          </div>
        ))}
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${theme === 'dark' 
          ? 'bg-gradient-to-r from-[#352d4d]/50 to-[#302844]/60' 
          : 'bg-gradient-to-r from-blue-100/70 to-purple-100/80'}`}></div>
      </div>
      
      <div className="p-4">
        <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>
          Therapy Chatbot
        </h1>
        <p className={`text-xl mb-4 max-w-2xl ${theme === 'dark' ? 'text-indigo-100/70' : 'text-indigo-600'}`}>
          Chat with an AI assistant trained to support your mental wellness journey.
        </p>
      </div>
      
      <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-md ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
        <MessageCircle className="text-white" size={24} />
      </div>
    </div>
  );
});

const Chatbot = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { collapsed, isMobile } = useSidebar();
  const [messages, setMessages] = useState([
    { id: 1, content: "Hey there! I'm your mental health assistant. How are you feeling today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: messages.length + 1, content: input, sender: "user" };
    setMessages([...messages, userMessage]);
    
    const userInput = input;
    setInput("");
    setIsLoading(true);

    console.log("Sending message:", userInput);
    console.log("Token:", localStorage.getItem('access_token'));

    try {
      const response = await api.sendChatMessage(userInput);
      console.log("Received response:", response);

      let responseText = response.response;
      const botResponse = {
        id: messages.length + 2,
        content: responseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse = {
        id: messages.length + 2,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the handleSendMessage function to prevent unnecessary re-renders
  const handleSendMessageCallback = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: messages.length + 1, content: input, sender: "user" };
    setMessages([...messages, userMessage]);
    
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(userInput);
      let responseText = response.response;
      const botResponse = {
        id: messages.length + 2,
        content: responseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse = {
        id: messages.length + 2,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' 
      ? 'bg-gradient-to-b from-[#262133] to-[#16112a]' 
      : 'bg-gradient-to-b from-slate-100 to-blue-50'}`}>
      <Sidebar />
      
      {/* Use memoized animated background component */}
      <AnimatedBackground theme={theme} />
      
      <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? 'ml-16' : isMobile ? 'ml-0' : 'md:ml-64'} ${collapsed ? 'max-w-[calc(100%-4rem)]' : 'max-w-[calc(100%-16rem)]'}`}>
        {/* Use memoized header component */}
        <ChatHeader theme={theme} />
        
        <Card className={`rounded-3xl shadow-xl border-none overflow-hidden ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#302844]/90 to-[#372F55]/90 text-white' 
          : 'bg-white/90 text-gray-800'}`}>
          <CardContent className="p-0 flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "bot" && (
                      <div className="mr-2 flex items-start pt-2">
                        <div className={`rounded-full p-1.5 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
                          <Bot size={16} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${message.sender === "user"
                        ? theme === 'dark' 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : theme === 'dark'
                          ? 'bg-[#3A3359] text-indigo-100' 
                          : 'bg-indigo-100 text-indigo-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="mr-2 flex items-start pt-2">
                      <div className={`rounded-full p-1.5 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
                        <Bot size={16} className="text-white" />
                      </div>
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${theme === 'dark' 
                      ? 'bg-[#3A3359] text-indigo-100' 
                      : 'bg-indigo-100 text-indigo-900'}`}>
                      <span className="inline-block animate-pulse">...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <CardFooter className={`p-4 border-t ${theme === 'dark' ? 'border-indigo-900/30' : 'border-indigo-100'}`}>
              <form onSubmit={handleSendMessageCallback} className="flex items-center gap-2 w-full">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 ${theme === 'dark' 
                    ? 'bg-[#2C2447] border-indigo-900/30 text-white placeholder:text-indigo-300/50' 
                    : 'bg-indigo-50 border-indigo-200 text-indigo-900 placeholder:text-indigo-400'}`}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className={`rounded-full w-12 h-12 p-0 ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <Send size={18} className="text-white" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;