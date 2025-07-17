import React from "react";
import { Star, Smile } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/lib/theme-context";

const GamificationCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-6 shadow-md border-none ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#372F55] to-[#4A3A77]' 
      : 'bg-gradient-to-br from-purple-100 to-purple-300'}`}>
      <div className="flex items-start gap-4">
        <div className="text-6xl text-yellow-400">
          <StarFace />
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#E3C2FF]' : 'text-purple-900'}`}>
            Ramansh's Journey
          </h3>
          <p className={`text-xl font-semibold mt-2 ${theme === 'dark' ? 'text-[#C9A6F0]' : 'text-purple-700'}`}>Level 3 • Explorer</p>
        </div>
      </div>
      <div className="mt-4">
        <div className={`flex justify-between mb-1 text-sm ${theme === 'dark' ? 'text-indigo-100/80' : 'text-purple-800'}`}>
          <span>Progress to Level 4</span>
          <span>80%</span>
        </div>
        <Progress value={80} className={`h-5 ${theme === 'dark' ? 'bg-[#2C2447]' : 'bg-purple-200'}`} />
      </div>
    </div>
  );
};

const StarFace: React.FC = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <Star className="text-yellow-400 fill-yellow-400 w-14 h-14" />
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

export default GamificationCard;