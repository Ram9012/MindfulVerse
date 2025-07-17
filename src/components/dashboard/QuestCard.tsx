import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Check } from 'lucide-react';

interface Quest {
  id: number;
  title: string;
  completed: boolean;
}

interface QuestCardProps {
  quests: Quest[];
  onQuestToggle?: (id: number) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quests, onQuestToggle }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl p-6 shadow-md border-none ${theme === 'dark' 
      ? 'bg-gradient-to-br from-[#372F55] to-[#4A3A77]' 
      : 'bg-gradient-to-br from-purple-100 to-purple-300'}`}>
      <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-[#E3C2FF]' : 'text-purple-900'}`}>
        Your Quests
      </h3>
      <div className="space-y-3">
        {quests.map((quest) => (
          <div 
            key={quest.id}
            className={`p-4 rounded-xl transition-all duration-200 ${theme === 'dark' 
              ? 'bg-[#2D2A4A] hover:bg-[#332E54]' 
              : 'bg-purple-200 hover:bg-purple-300'}`}
            onClick={() => onQuestToggle && onQuestToggle(quest.id)}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-8 h-8 rounded-lg border-3 flex items-center justify-center transition-all duration-200 shadow-sm
                  ${quest.completed 
                    ? theme === 'dark' 
                      ? 'bg-purple-500 border-purple-400 scale-110' 
                      : 'bg-purple-600 border-purple-500 scale-110' 
                    : theme === 'dark' 
                      ? 'border-gray-400 bg-[#3D3760]' 
                      : 'border-gray-500 bg-white'}`}
              >
                {quest.completed && <Check size={20} className="text-white" />}
              </div>
              <span className={`text-lg font-medium ${quest.completed 
                ? (theme === 'dark' ? 'text-purple-300' : 'text-purple-700') 
                : (theme === 'dark' ? 'text-gray-200' : 'text-gray-700')}`}
              >
                {quest.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestCard;