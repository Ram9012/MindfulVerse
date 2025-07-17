import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const TherapySessionCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-6 shadow-md border-none ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#554177] to-[#7B5BA8]' 
      : 'bg-gradient-to-br from-purple-100 to-purple-200'}`}>
      <div className="flex items-start gap-4">
        <div className="text-6xl">
          <HeartFace />
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#E3C2FF]' : 'text-purple-800'}`}>
            Therapy Sessions
          </h3>
          <p className={`text-xl font-semibold mt-2 ${theme === 'dark' ? 'text-[#C9A6F0]' : 'text-purple-700'}`}>April 30 at 2:00 PM</p>
          <p className={`text-lg ${theme === 'dark' ? 'text-indigo-100/80' : 'text-purple-600'}`}>Session with Dr. Sarah Johnson</p>
        </div>
      </div>
      <Button className={`w-full mt-6 font-semibold py-6 rounded-xl text-lg ${theme === 'dark' 
        ? 'bg-[#9C6BDB] hover:bg-[#8A59CB] text-white' 
        : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
        View Details
      </Button>
    </div>
  );
};

const HeartFace: React.FC = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <Heart className="text-red-400 fill-red-400 w-14 h-14" />
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

export default TherapySessionCard;