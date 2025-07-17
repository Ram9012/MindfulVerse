import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { motion } from 'framer-motion';
import { Star, Trophy, Home } from 'lucide-react';

interface Milestone {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface JourneyRoadmapProps {
  milestones: Milestone[];
  currentPosition: number;
}

const JourneyRoadmap: React.FC<JourneyRoadmapProps> = ({ milestones, currentPosition }) => {
  const { theme } = useTheme();
  
  const starAnimation = {
    initial: { opacity: 0.2, scale: 0.8 },
    animate: {
      opacity: [0.2, 0.8, 0.2],
      scale: [0.8, 1, 0.8],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className={`relative w-full h-[600px] rounded-3xl p-8 overflow-hidden ${theme === 'dark' ? 'bg-[#0A0B1E]' : 'bg-[#1A1B3E]'}`}>
      {/* Decorative stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          variants={starAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: i * 0.2 }}
        >
          <Star className="text-yellow-200" size={Math.random() * 8 + 4} />
        </motion.div>
      ))}

      {/* Journey Title */}
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Journey</h2>

      {/* Starting point - Cozy hut */}
      <div className="absolute bottom-12 left-12">
        <Home className="text-amber-400" size={32} />
        <div className="mt-2 text-amber-400 text-sm">Start</div>
      </div>

      {/* Winding path with milestones */}
      <div className="relative h-[400px] mx-auto">
        {milestones.map((milestone, index) => {
          const isCompleted = index < currentPosition;
          const isCurrent = index === currentPosition;
          
          // Calculate position along the winding path
          const top = 320 - (index * 80);
          const left = 100 + (index % 2 === 0 ? 100 : 300);

          return (
            <div
              key={milestone.id}
              className={`absolute transition-all duration-500 ease-in-out`}
              style={{ top: `${top}px`, left: `${left}px` }}
            >
              {/* Milestone node */}
              <motion.div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full ${isCompleted ? 'bg-amber-400' : 'bg-gray-600'} ${isCurrent ? 'ring-4 ring-purple-400' : ''}`}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-dark font-bold">{milestone.id}</span>

                {/* Tooltip */}
                <div className={`absolute left-full ml-4 p-4 rounded-lg w-64 ${theme === 'dark' ? 'bg-[#1A1B3E]' : 'bg-[#2A2B4E]'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                  <h4 className="text-white font-semibold mb-2">{milestone.title}</h4>
                  <p className="text-gray-300 text-sm">{milestone.description}</p>
                </div>
              </motion.div>

              {/* Connecting line */}
              {index < milestones.length - 1 && (
                <div
                  className={`absolute w-48 h-1 ${isCompleted ? 'bg-amber-400' : 'bg-gray-600'} transform rotate-45`}
                  style={{
                    top: '24px',
                    left: '48px',
                    transformOrigin: 'left center'
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Trophy at the end */}
        {currentPosition >= milestones.length && (
          <motion.div
            className="absolute top-0 right-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Trophy className="text-amber-400" size={48} />
            <div className="mt-2 text-amber-400 text-sm text-center">Victory!</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JourneyRoadmap;