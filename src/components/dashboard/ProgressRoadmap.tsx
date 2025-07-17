import React from 'react';
import { useTheme } from '@/lib/theme-context';
import QuestCard from './QuestCard';
import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';

interface Quest {
  id: number;
  title: string;
  completed: boolean;
}

interface ProgressRoadmapProps {
  currentLevel: number;
  quests: Quest[];
  onQuestToggle?: (id: number) => void;
}

const ProgressRoadmap: React.FC<ProgressRoadmapProps> = ({ currentLevel, quests, onQuestToggle }) => {
  const { theme } = useTheme();
  
  // Calculate character position based on current level
  const getCharacterPosition = (level: number) => {
    switch(level) {
      case 1: return { bottom: '250px', left: '100px' };
      case 2: return { bottom: '150px', left: '250px' };
      case 3: return { bottom: '135px', left: '425px' }; // Adjusted position for level 3
      case 4: return { bottom: '150px', left: '550px' };
      case 5: return { bottom: '250px', left: '700px' };
      default: return { bottom: '200px', left: '400px' }; // Updated default position
    };
  };
  
  // Animation variants for decorative elements
  const pulseAnimation = {
    initial: { opacity: 0.4, scale: 0.9 },
    animate: { 
      opacity: 0.7, 
      scale: 1.1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 2
      }
    }
  };
  
  const characterPosition = getCharacterPosition(currentLevel);

  return (
    <div className={`rounded-3xl p-6 shadow-md border-none relative overflow-hidden ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#2D2A4A] to-[#4A3A77]' 
      : 'bg-gradient-to-br from-indigo-100 to-purple-200'}`}>
      
      {/* Decorative elements */}
      <motion.div 
        className={`absolute top-6 right-6 ${theme === 'dark' ? 'text-[#9D7FBD]' : 'text-purple-400'}`}
        variants={pulseAnimation}
        initial="initial"
        animate="animate"
      >
        <Sparkle size={24} />
      </motion.div>
      
      <motion.div 
        className={`absolute bottom-12 left-12 ${theme === 'dark' ? 'text-[#7A6A9E]' : 'text-purple-300'}`}
        variants={pulseAnimation}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "1s" }}
      >
        <Sparkle size={20} />
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Quests Section */}
        <div className="w-full md:w-1/3">
          <QuestCard 
            quests={quests}
            onQuestToggle={onQuestToggle}
          />
        </div>
        
        {/* Roadmap Visualization */}
        <div className="w-full md:w-2/3 relative">
          <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-[#E3C2FF]' : 'text-purple-900'}`}>
            Your Progress Journey
          </h3>
          <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
            {/* Enhanced Roadmap SVG */}
            <img 
              src="/roadmap-enhanced.svg" 
              alt="Progress Roadmap" 
              className="w-full h-auto" 
            />
            
            {/* Character at current level with animation */}
            <motion.div 
              className="absolute" 
              style={{ 
                bottom: characterPosition.bottom, 
                left: characterPosition.left, 
                transform: 'translateX(-50%)' 
              }}
              initial={{ y: 0 }}
              animate={{ y: -3 }} // Reduced floating amplitude for gentler movement
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 2.5, // Slightly slower animation for gentler floating
                ease: "easeInOut"
              }}
            >
              <img 
                src="/character-enhanced.svg" 
                alt="Character" 
                className="h-[120px] w-auto drop-shadow-lg" 
              />
              
              {/* Character level indicator */}
              <motion.div 
                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-white text-sm font-bold
                  ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-700'}`}
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1.5 
                }}
              >
                Lvl {currentLevel}
              </motion.div>
            </motion.div>
            
            {/* Level Labels */}
            <div className="absolute bottom-0 left-0 w-full px-4 py-2 flex justify-between">
              <div className={`text-sm font-medium ${currentLevel >= 1 
                ? (theme === 'dark' ? 'text-purple-300' : 'text-purple-700') 
                : (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}`}>
                Beginner
              </div>
              <div className={`text-sm font-medium ${currentLevel >= 3 
                ? (theme === 'dark' ? 'text-purple-300' : 'text-purple-700') 
                : (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}`}>
                Intermediate
              </div>
              <div className={`text-sm font-medium ${currentLevel >= 5 
                ? (theme === 'dark' ? 'text-purple-300' : 'text-purple-700') 
                : (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}`}>
                Advanced
              </div>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="mt-4 flex justify-between items-center px-2">
            <div className="text-center p-2 rounded-lg transition-all duration-200 hover:bg-opacity-10 hover:bg-purple-500">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Level</div>
              <div className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>{currentLevel}</div>
            </div>
            <div className="text-center p-2 rounded-lg transition-all duration-200 hover:bg-opacity-10 hover:bg-purple-500">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Quests Completed</div>
              <div className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                {quests.filter(q => q.completed).length}/{quests.length}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg transition-all duration-200 hover:bg-opacity-10 hover:bg-purple-500">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Next Level</div>
              <div className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>{currentLevel + 1}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRoadmap;