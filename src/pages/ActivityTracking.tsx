import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/lib/theme-context";
import { Plus, Droplet, Heart, Award, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useSidebar } from "@/lib/sidebar-context";
import BackgroundDecoration from "@/components/dashboard/BackgroundDecoration";

const ActivityTracking = () => {
  const { theme } = useTheme();
  const { collapsed, isMobile } = useSidebar();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  const [journalEntries, setJournalEntries] = useState<Array<{text: string; timestamp: string}>>([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [hydrationCount, setHydrationCount] = useState(6);
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>([]);
  const [showGratitudeDialog, setShowGratitudeDialog] = useState(false);
  const [newGratitudeEntry, setNewGratitudeEntry] = useState('');

  // Handle journal entry update
  const handleJournalUpdate = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        text: journalEntry.trim(),
        timestamp: new Date().toLocaleString()
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setJournalEntry('');
    }
  };

  // Handle hydration update
  const updateHydration = (increment: boolean) => {
    setHydrationCount(prev => {
      const newCount = increment ? prev + 1 : prev - 1;
      return Math.max(0, Math.min(8, newCount));
    });
  };

  // Handle gratitude entry
  const handleGratitudeSubmit = () => {
    if (newGratitudeEntry.trim()) {
      setGratitudeEntries(prev => [...prev, newGratitudeEntry]);
      setNewGratitudeEntry('');
      setShowGratitudeDialog(false);
    }
  };
  
  // Sample mood data for the week
  const moodData = [
    { day: 'Mo', value: 40, mood: 'sad' },
    { day: 'Tu', value: 60, mood: 'neutral' },
    { day: 'W', value: 70, mood: 'happy' },
    { day: 'Th', value: 80, mood: 'happy' },
    { day: 'F', value: 50, mood: 'neutral' },
    { day: 'Sa', value: 90, mood: 'very-happy' },
    { day: 'Su', value: 85, mood: 'happy' },
  ];

  // Emoji mapping for moods
  const moodEmojis = {
    'sad': '😔',
    'neutral': '😐',
    'happy': '😊',
    'very-happy': '😄'
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-b from-[#262133] to-[#16112a]" : "bg-gradient-to-b from-slate-100 to-blue-50"}`}>


        <BackgroundDecoration />
        <Sidebar />
        
        <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? "ml-16" : isMobile ? "ml-0" : "md:ml-64"} ${collapsed ? "max-w-[calc(100%-4rem)]" : "max-w-[calc(100%-16rem)]"}`}>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-indigo-300" : "text-indigo-800"}`}>
            Activity Tracking
          </h1>
          <p className={`text-xl ${theme === "dark" ? "text-indigo-200/70" : "text-indigo-600"}`}>
            Track your daily activities and mood to improve your mental well-being
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Journal Section */}
          <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>Journal</h2>
              <div className={`flex items-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-600'}`}>
                <Calendar size={16} className="mr-2" />
                <span>Today</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-purple-500/5 p-4 rounded-xl">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className={`w-full bg-transparent border-none focus:outline-none resize-none ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} placeholder:${theme === 'dark' ? 'text-indigo-200/50' : 'text-indigo-700/50'}`}
                  rows={4}
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJournalUpdate}
                className={`flex items-center justify-center w-full py-3 rounded-lg ${theme === 'dark' ? 'bg-purple-500/20 hover:bg-purple-500/30 text-indigo-200' : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-700'} transition-all`}
              >
                <Plus size={20} className="mr-2" />
                <span>Save entry</span>
              </motion.button>
              
              {/* Journal Entries List */}
              <div className="mt-6 space-y-4 max-h-60 overflow-y-auto">
                {journalEntries.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#1E1A2E]/50' : 'bg-white/30'} backdrop-blur-sm`}
                  >
                    <p className={`${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} mb-2`}>{entry.text}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-indigo-300/70' : 'text-indigo-600/70'}`}>{entry.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Mood Check-In Section */}
          <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>Mood Check-In</h2>
              <div className={`flex items-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-600'}`}>
                <Calendar size={16} className="mr-2" />
                <span>Today</span>
              </div>
            </div>
            <div className="mb-6">
              <p className={`mb-4 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>How are you feeling today?</p>
              <div className="flex justify-between mb-6 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent p-4 rounded-xl">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <motion.button 
                    key={mood}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood)}
                    className={`text-3xl p-2 rounded-full transition-all ${selectedMood === mood ? 'bg-purple-500 bg-opacity-20 ring-2 ring-purple-500' : 'hover:bg-purple-500 hover:bg-opacity-20'}`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Mood Chart */}
            <div className="mt-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>Weekly Mood Trends</h3>
              <div className="flex items-end h-32 mb-2">
                {moodData.map((day, index) => (
                  <motion.div 
                    key={index} 
                    className="flex-1 flex flex-col items-center"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div 
                      className={`w-6 ${theme === 'dark' ? 'bg-purple-500' : 'bg-indigo-500'} rounded-t-md transition-all duration-300 hover:opacity-80`}
                      style={{ height: `${day.value}%` }}
                    ></div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-sm mt-2">
                {moodData.map((day, index) => (
                  <div key={index} className={`flex-1 text-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-600'}`}>
                    {day.day}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/10 via-purple-500/20 to-purple-500/10">
                <div className={`${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} font-medium`}>Weekly Average</div>
                <div className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'} font-bold`}>75% Positive</div>
              </div>
            </div>
          </div>

          {/* Wellness Activity Section */}
          <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>Wellness Activity</h2>
              <div className={`flex items-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-600'}`}>
                <Calendar size={16} className="mr-2" />
                <span>Today's Progress</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Hydration Tracker */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#1E1A2E]/50' : 'bg-white/30'} backdrop-blur-sm transition-all duration-300`}
              >
                <div className="flex items-center mb-2">
                  <Droplet className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mr-2`} size={24} />
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>Hydrate</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={() => updateHydration(false)}
                    className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-blue-500/20' : 'hover:bg-blue-200'}`}
                    disabled={hydrationCount === 0}
                  >-</button>
                  <p className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>{hydrationCount} / 8 glasses</p>
                  <button 
                    onClick={() => updateHydration(true)}
                    className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-blue-500/20' : 'hover:bg-blue-200'}`}
                    disabled={hydrationCount === 8}
                  >+</button>
                </div>
                <Progress value={(hydrationCount / 8) * 100} className={`h-2 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-200'}`} />
              </motion.div>
              
              {/* Gratitude Tracker */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#1E1A2E]/50' : 'bg-white/30'} backdrop-blur-sm transition-all duration-300`}
              >
                <div className="flex items-center mb-2">
                  <Heart className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} mr-2`} size={24} />
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>Gratitude</h3>
                </div>
                <div>
                  {gratitudeEntries.length > 0 && (
                    <div className="mb-2 text-sm">
                      <p className={`${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                        Latest: {gratitudeEntries[gratitudeEntries.length - 1]}
                      </p>
                    </div>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGratitudeDialog(true)}
                    className={`w-full py-2 mt-2 rounded-lg ${theme === 'dark' ? 'bg-purple-500/20 hover:bg-purple-500/30 text-indigo-200' : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-700'} transition-all`}
                  >
                    <Plus size={16} className="inline mr-1" />
                    <span>Add</span>
                  </motion.button>
                </div>
                
                {showGratitudeDialog && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-[#2A2344]' : 'bg-white'} w-96`}>
                      <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                        What are you grateful for?
                      </h4>
                      <textarea
                        value={newGratitudeEntry}
                        onChange={(e) => setNewGratitudeEntry(e.target.value)}
                        className={`w-full p-2 rounded-lg mb-4 ${theme === 'dark' ? 'bg-[#1E1A2E] text-indigo-200' : 'bg-gray-100 text-indigo-700'}`}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowGratitudeDialog(false)}
                          className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-indigo-200 hover:bg-[#1E1A2E]' : 'text-indigo-700 hover:bg-gray-100'}`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleGratitudeSubmit}
                          className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'}`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Daily Goals Section */}
          <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>Daily Goals</h2>
              <div className={`flex items-center ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-600'}`}>
                <Award size={16} className="mr-2" />
                <span>70% Complete</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Progress 
                  value={70} 
                  className={`h-4 flex-1 ${theme === 'dark' ? 'bg-[#1E1A2E]' : 'bg-indigo-100'} rounded-full`} 
                />
              </div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setMeditationCompleted(!meditationCompleted);
                // Here you would typically update backend
                console.log('Meditation completed:', !meditationCompleted);
              }}
              className={`p-4 rounded-xl mb-4 ${meditationCompleted ? 'bg-green-500/20' : theme === 'dark' ? 'bg-[#1E1A2E]/50' : 'bg-white/30'} backdrop-blur-sm transition-all duration-300 cursor-pointer`}
            >
              <div className="flex justify-between items-center">
                <span className={`${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  {meditationCompleted ? 'Meditation completed!' : 'Complete meditation session'}
                </span>
                <span className={meditationCompleted ? 'text-green-400' : theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'}>
                  {meditationCompleted ? '✓' : '★'}
                </span>
              </div>
              {meditationCompleted && (
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  Great job! You've earned points for today.
                </p>
              )}
            </motion.div>
            
            <p className={`${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600/70'}`}>Complete your meditation session to earn points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracking;