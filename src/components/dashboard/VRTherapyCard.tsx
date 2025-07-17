import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Glasses } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const VRTherapyCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-6 shadow-md border-none ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#3B3162] to-[#4F3D8B]' 
      : 'bg-gradient-to-br from-blue-100 to-indigo-200'}`}>
      <div className="flex items-start gap-4">
        <div className="text-6xl">
          <VRFace />
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#B4A2FF]' : 'text-indigo-800'}`}>
            VR Therapy
          </h3>
          <p className={`text-xl font-semibold mt-2 ${theme === 'dark' ? 'text-[#9F8BE8]' : 'text-indigo-700'}`}>
            Current Scene: Exposure Therapy - Heights
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className={`flex justify-between mb-2 text-sm ${theme === 'dark' ? 'text-indigo-200/80' : 'text-indigo-600'}`}>
          <span>Quest Progress</span>
          <span>7/10 Completed</span>
        </div>
        <Progress value={70} className={`h-3 ${theme === 'dark' ? 'bg-[#2C2447]' : 'bg-indigo-200'}`} />
      </div>

      <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'}`}>
        <h4 className={`font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>Next Quest</h4>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600'}`}>
          Bridge Walk Simulation - Level 3
        </p>
      </div>

      <Button className={`w-full mt-4 font-semibold py-6 rounded-xl text-lg ${theme === 'dark' 
        ? 'bg-[#7B68E8] hover:bg-[#6A57D7] text-white' 
        : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
        Enter VR Session
      </Button>
    </div>
  );
};

const VRFace: React.FC = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <Glasses className="text-blue-400 fill-blue-400 w-14 h-14" />
    <div className="absolute top-4 left-0 right-0 flex justify-center">
      <div className="flex space-x-3">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-900"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-900"></div>
      </div>
    </div>
    <div className="absolute top-7 left-0 right-0 flex justify-center">
      <div className="w-4 h-2 rounded-full bg-indigo-900 transform rotate-[10deg]"></div>
    </div>
  </div>
);

export default VRTherapyCard;