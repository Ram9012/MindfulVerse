import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Check } from 'lucide-react';

interface QuestItemProps {
  title: string;
  completed: boolean;
  onToggle?: () => void;
}

const QuestItem: React.FC<QuestItemProps> = ({ title, completed, onToggle }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="flex items-center gap-3 py-2 hover:bg-opacity-10 hover:bg-purple-300 rounded-lg px-2 transition-all duration-200" 
      onClick={onToggle} 
      role="button" 
      tabIndex={0} 
      style={{ cursor: 'pointer' }}
    >
      <div 
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
          ${completed 
            ? theme === 'dark' 
              ? 'bg-purple-500 border-purple-400 scale-110' 
              : 'bg-purple-600 border-purple-500 scale-110' 
            : theme === 'dark' 
              ? 'border-gray-500 bg-transparent' 
              : 'border-gray-400 bg-transparent'}`}
      >
        {completed && <Check size={16} className="text-white" />}
      </div>
      <span className={`text-lg ${completed ? (theme === 'dark' ? 'text-purple-300' : 'text-purple-700') : (theme === 'dark' ? 'text-gray-200' : 'text-gray-700')}`}>
        {title}
      </span>
    </div>
  );
};

export default QuestItem;