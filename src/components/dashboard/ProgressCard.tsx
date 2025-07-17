import React from "react";
import ProgressCircle from "./ProgressCircle";
import { Sparkle } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const ProgressCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-8 shadow-md border-none relative overflow-hidden ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#374673] to-[#485E9A]' 
      : 'bg-gradient-to-br from-blue-200 to-blue-300'}`}>
      <div className="flex flex-col items-center">
        <ProgressCircle percentage={75} />
        <h3 className={`text-3xl font-bold mt-4 ${theme === 'dark' ? 'text-[#D8DEFF]' : 'text-blue-900'}`}>
          Quest Completion 
        </h3>
        <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-[#BFC6F0]' : 'text-blue-700'}`}>75% of weekly quests completed</p>
      </div>
      
      {/* Decorative stars with improved animations */}
      <div className={`absolute top-8 right-8 ${theme === 'dark' ? 'text-[#9DB3FF]' : 'text-blue-500'} animate-pulse-light`}>
        <Sparkle size={24} />
      </div>
      <div className={`absolute bottom-8 left-10 ${theme === 'dark' ? 'text-[#7A8FE0]' : 'text-blue-400'} animate-pulse-light`} 
        style={{ animationDelay: "1s" }}>
        <Sparkle size={24} />
      </div>
    </div>
  );
};

export default ProgressCard;