import React from "react";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const TherapyChatbotCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-6 shadow-md border-none ${theme === 'dark' 
      ? 'bg-[#302844]/80' 
      : 'bg-gradient-to-br from-indigo-100 to-pink-100'}`}>
      <div className="flex items-start gap-4">
        <div className="text-6xl">
          <BotFace />
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>
            Therapy Chatbot
          </h3>
          <p className={`text-lg mt-1 ${theme === 'dark' ? 'text-indigo-100/70' : 'text-indigo-600'}`}>
            Talk about your day with your AI friend.
          </p>
        </div>
      </div>
      <Button className={`w-full mt-4 font-semibold py-6 rounded-xl text-lg ${theme === 'dark' 
        ? 'bg-pink-600 hover:bg-pink-700 text-white' 
        : 'bg-pink-500 hover:bg-pink-600 text-white'}`}>
        Open Chat
      </Button>
    </div>
  );
};

const BotFace: React.FC = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <Headphones className="text-purple-400 fill-purple-400 w-14 h-14" />
    <div className="absolute top-4 left-0 right-0 flex justify-center">
      <div className="flex space-x-3">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
      </div>
    </div>
    <div className="absolute top-7 left-0 right-0 flex justify-center">
      <div className="w-4 h-2 rounded-full bg-blue-900 transform rotate-[10deg]"></div>
    </div>
  </div>
);

export default TherapyChatbotCard;