import React from "react";
import { Sparkle, FlowerIcon, Star, Heart, CloudSun, Music } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const BackgroundDecoration: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static background elements */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`static-${i}`}
          className="absolute opacity-30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
          }}
        >
          {i % 4 === 0 ? (
            <div className={`${theme === 'dark' ? 'text-pink-300' : 'text-pink-500'} text-xl`}>✦</div>
          ) : i % 4 === 1 ? (
            <div className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'} text-sm`}>✧</div>
          ) : i % 4 === 2 ? (
            <div className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} text-lg`}>✴</div>
          ) : (
            <div className={`${theme === 'dark' ? 'bg-purple-300' : 'bg-purple-500'} h-1.5 w-1.5 rounded-full`}></div>
          )}
        </div>
      ))}
      
      {/* Static glow spots */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`glow-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${30 + Math.random() * 100}px`,
            height: `${30 + Math.random() * 100}px`,
            background: `radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(79,70,229,0.05) 70%, transparent 100%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
          }}
        ></div>
      ))}
      
      {/* Static nebula effect */}
      {[...Array(2)].map((_, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${150 + Math.random() * 200}px`,
            height: `${150 + Math.random() * 200}px`,
            background: `radial-gradient(circle, rgba(216,180,254,0.3) 0%, rgba(129,140,248,0.1) 50%, transparent 80%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(20px)',
            transform: `rotate(${Math.random() * 360}deg)`,
            zIndex: 0,
          }}
        ></div>
      ))}
    </div>
  );
};

export default BackgroundDecoration;