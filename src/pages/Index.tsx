import React from "react";
import BackgroundDecoration from "@/components/dashboard/BackgroundDecoration";
import ConditionalSidebar from "@/components/layout/ConditionalSidebar";
import ProgressCard from "@/components/dashboard/ProgressCard";
import { useSidebar } from "@/lib/sidebar-context";
import TherapySessionsCard from "@/components/dashboard/TherapySessionsCard";
import TherapyChatbotCard from "@/components/dashboard/TherapyChatbotCard";
import GamificationCard  from "@/components/dashboard/GamificationCard";
import QuoteCard  from "@/components/dashboard/QuoteCard";

import { Sparkle, Star, CloudSun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

// Import animation styles
import "@/index.css";

const Dashboard = () => {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' 
      ? 'bg-gradient-to-b from-[#262133] to-[#16112a]' 
      : 'bg-gradient-to-b from-slate-100 to-blue-50'}`}>
      <BackgroundDecoration />
      <ConditionalSidebar />
      
      <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? 'ml-16' : isMobile ? 'ml-0' : 'md:ml-64'} ${collapsed ? 'max-w-[calc(100%-4rem)]' : 'max-w-[calc(100%-16rem)]'}`}>
        <div className="flex justify-between items-start mb-8 animate-fade-in relative">
          {/* Dark purple background with animated stars */}
          <div className={`absolute -inset-6 rounded-xl overflow-hidden -z-10 ${theme === 'dark' 
            ? 'bg-[#2d3142]/80' 
            : 'bg-gradient-to-r from-amber-100 to-amber-300 shadow-md'}`}>
            {/* Animated stars */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`header-star-${i}`}
                className="absolute animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                  opacity: 0.6 + Math.random() * 0.4,
                  zIndex: 1,
                }}
              >
                {i % 3 === 0 ? (
                  <Sparkle className="text-indigo-300" size={i % 2 === 0 ? 14 : 18} />
                ) : i % 3 === 1 ? (
                  <Star className="text-purple-300" size={i % 2 === 0 ? 12 : 16} />
                ) : (
                  <CloudSun className="text-pink-300" size={i % 2 === 0 ? 16 : 20} />
                )}
              </div>
            ))}
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 ${theme === 'dark' 
              ? 'bg-gradient-to-r from-[#2d3142]/50 to-[#3e4259]/60' 
              : 'bg-gradient-to-r from-amber-100/70 to-amber-300/80'}`}></div>
            
            {/* Shooting stars */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`shooting-header-${i}`}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"
                style={{
                  width: `${30 + Math.random() * 40}px`,
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 60}%`,
                  opacity: 0.8,
                  transform: `rotate(${-30 + Math.random() * 60}deg)`,
                  animation: `shootingStarAnim ${6 + Math.random() * 8}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  zIndex: 1,
                }}
              ></div>
            ))}
          </div>
          
          <div className="p-4">
            <h1 className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
              Good morning, Ramansh
            </h1>
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-600'}`}>
              Your Wellness Dashboard
            </h2>
            <p className={`text-xl mb-8 max-w-2xl ${theme === 'dark' ? 'text-amber-100/70' : 'text-amber-600'}`}>
              Track your progress and access therapy tools. We're here to support your journey to better well-being.
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
            <div className="rounded-full w-full h-full flex items-center justify-center text-2xl text-white font-semibold">
              R
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${collapsed ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 transform transition-all duration-500`}>
          <div className={`${collapsed ? 'md:col-span-1' : 'md:col-span-1'} space-y-6`}>
            <div className="hover:translate-y-[-5px] transition-all duration-300">
              <ProgressCard />
            </div>
          </div>
          <div className={`${collapsed ? 'md:col-span-2' : 'md:col-span-1 lg:col-span-2'} space-y-6`}>
            <div className="hover:translate-y-[-5px] transition-all duration-300">
              <TherapySessionsCard />
            </div>
            <div className="hover:translate-y-[-5px] transition-all duration-300">
              <GamificationCard />
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${collapsed ? 'md:grid-cols-2' : 'md:grid-cols-1 lg:grid-cols-2'} gap-6 mt-6`}>
          <div className="hover:translate-y-[-5px] transition-all duration-300">
            <TherapyChatbotCard />
          </div>
          <div className="hover:translate-y-[-5px] transition-all duration-300">
            <QuoteCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;