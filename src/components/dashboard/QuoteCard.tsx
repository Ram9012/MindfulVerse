import React from "react";
import { useTheme } from "@/lib/theme-context";

const QuoteCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-6 shadow-md border-none ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#424973] to-[#5B6499]' 
      : 'bg-gradient-to-br from-blue-100 to-blue-200'}`}>
      <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' 
        ? 'text-[#D8DEFF]' 
        : 'text-blue-800'}`}>
        Quote of the Day
      </h3>
      <p className={`text-lg ${theme === 'dark' 
        ? 'text-[#BFC6F0]' 
        : 'text-blue-700'}`}>
        "You don't have to control your thoughts; you just have to stop letting them control you."
      </p>
      <p className={`text-lg font-semibold mt-2 ${theme === 'dark' 
        ? 'text-[#A4B0FF]' 
        : 'text-blue-600'}`}>
        –Dan Millman
      </p>
    </div>
  );
};

export default QuoteCard;