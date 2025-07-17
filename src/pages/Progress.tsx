import React, { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { useSidebar } from "@/lib/sidebar-context";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Gift, 
  Award, 
  Star, 
  Check, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Calendar, 
  Zap, 
  Coffee,
  Headphones,
  ShoppingBag,
  Ticket,
  Utensils,
  BookMarked
} from "lucide-react";
import { motion } from "framer-motion";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackgroundDecoration from "@/components/dashboard/BackgroundDecoration";

// Define interfaces for our data
interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'milestone';
  icon: React.ReactNode;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image: string;
  category: 'digital' | 'physical' | 'experience';
  available: boolean;
  featured?: boolean;
  icon: React.ReactNode;
}

const RewardStore = () => {
  const { theme } = useTheme();
  const { collapsed, isMobile } = useSidebar();
  const [userPoints, setUserPoints] = useState(750);
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards'>('tasks');
  const [activeTaskCategory, setActiveTaskCategory] = useState<'daily' | 'weekly' | 'milestone'>('daily');
  const [activeRewardCategory, setActiveRewardCategory] = useState<'all' | 'digital' | 'physical' | 'experience'>('all');
  
  // Sample task data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task1',
      title: 'Complete Daily Meditation',
      description: 'Practice mindfulness meditation for at least 5 minutes',
      points: 50,
      completed: false,
      category: 'daily',
      icon: <Sparkles size={20} />
    },
    {
      id: 'task2',
      title: 'Journal Entry',
      description: 'Write about your thoughts and feelings today',
      points: 30,
      completed: true,
      category: 'daily',
      icon: <BookOpen size={20} />
    },
    {
      id: 'task3',
      title: 'Mood Check-in',
      description: 'Record your mood at least once today',
      points: 20,
      completed: false,
      category: 'daily',
      icon: <Heart size={20} />
    },
    {
      id: 'task4',
      title: 'Complete 3 Daily Tasks',
      description: 'Finish three daily wellness activities this week',
      points: 100,
      completed: false,
      category: 'weekly',
      icon: <Check size={20} />
    },
    {
      id: 'task5',
      title: 'Attend Therapy Session',
      description: 'Participate in your scheduled therapy session',
      points: 150,
      completed: true,
      category: 'weekly',
      icon: <Calendar size={20} />
    },
    {
      id: 'task6',
      title: 'Practice New Skill',
      description: 'Use a new coping skill you learned in therapy',
      points: 80,
      completed: false,
      category: 'weekly',
      icon: <Zap size={20} />
    },
    {
      id: 'task7',
      title: 'One Month Streak',
      description: 'Use the app for 30 consecutive days',
      points: 500,
      completed: false,
      category: 'milestone',
      icon: <Award size={20} />
    },
    {
      id: 'task8',
      title: 'Complete CBT Module',
      description: 'Finish the cognitive behavioral therapy learning module',
      points: 300,
      completed: false,
      category: 'milestone',
      icon: <BookMarked size={20} />
    }
  ]);
  
  // Sample rewards data
  const rewards: Reward[] = [
    {
      id: 'reward1',
      title: 'Premium Meditation Pack',
      description: 'Unlock 10 premium guided meditation sessions',
      pointsCost: 200,
      image: '/meditation.jpg',
      category: 'digital',
      available: true,
      icon: <Headphones size={20} />
    },
    {
      id: 'reward2',
      title: '$5 Coffee Gift Card',
      description: 'Digital gift card for your favorite coffee shop',
      pointsCost: 500,
      image: '/coffee.jpg',
      category: 'digital',
      available: true,
      featured: true,
      icon: <Coffee size={20} />
    },
    {
      id: 'reward3',
      title: 'Wellness Journal',
      description: 'Beautiful physical journal for tracking your wellness journey',
      pointsCost: 1000,
      image: '/journal.jpg',
      category: 'physical',
      available: true,
      icon: <BookOpen size={20} />
    },
    {
      id: 'reward4',
      title: 'Self-Care Package',
      description: 'Box of wellness items delivered to your door',
      pointsCost: 2000,
      image: '/selfcare.jpg',
      category: 'physical',
      available: true,
      featured: true,
      icon: <ShoppingBag size={20} />
    },
    {
      id: 'reward5',
      title: 'Movie Tickets',
      description: 'Two tickets to see a movie of your choice',
      pointsCost: 1500,
      image: '/movie.jpg',
      category: 'experience',
      available: true,
      icon: <Ticket size={20} />
    },
    {
      id: 'reward6',
      title: 'Restaurant Gift Card',
      description: '$25 gift card to a local restaurant',
      pointsCost: 2500,
      image: '/restaurant.jpg',
      category: 'experience',
      available: true,
      icon: <Utensils size={20} />
    }
  ];
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCompletedState = !task.completed;
          
          // Add or subtract points based on completion state
          if (newCompletedState) {
            setUserPoints(prev => prev + task.points);
          } else {
            setUserPoints(prev => prev - task.points);
          }
          
          return { ...task, completed: newCompletedState };
        }
        return task;
      })
    );
  };
  
  // Redeem a reward
  const redeemReward = (reward: Reward) => {
    if (userPoints >= reward.pointsCost) {
      setUserPoints(prev => prev - reward.pointsCost);
      // In a real app, this would trigger an API call to process the reward
      alert(`Congratulations! You've redeemed: ${reward.title}`);
    } else {
      alert("You don't have enough points for this reward.");
    }
  };
  
  // Filter tasks by category
  const filteredTasks = tasks.filter(task => task.category === activeTaskCategory);
  
  // Filter rewards by category
  const filteredRewards = activeRewardCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === activeRewardCategory);
  
  // Calculate completion percentages
  const dailyTasksCompleted = tasks.filter(t => t.category === 'daily' && t.completed).length;
  const dailyTasksTotal = tasks.filter(t => t.category === 'daily').length;
  const dailyCompletionPercentage = (dailyTasksCompleted / dailyTasksTotal) * 100;
  
  const weeklyTasksCompleted = tasks.filter(t => t.category === 'weekly' && t.completed).length;
  const weeklyTasksTotal = tasks.filter(t => t.category === 'weekly').length;
  const weeklyCompletionPercentage = (weeklyTasksCompleted / weeklyTasksTotal) * 100;
  
  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-b from-[#262133] to-[#16112a]" : "bg-gradient-to-b from-slate-100 to-blue-50"}`}>
      <BackgroundDecoration />
      <Sidebar />
      
      <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? "ml-16" : isMobile ? "ml-0" : "md:ml-64"} ${collapsed ? "max-w-[calc(100%-4rem)]" : "max-w-[calc(100%-16rem)]"}`}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-indigo-300" : "text-indigo-800"}`}>
                Rewards Store
              </h1>
              <p className={`text-xl ${theme === "dark" ? "text-indigo-200/70" : "text-indigo-600"}`}>
                Complete tasks, earn points, and redeem rewards
              </p>
            </div>
            
            {/* Points Display */}
            <div className={`mt-4 md:mt-0 flex items-center ${theme === "dark" ? "bg-[#2A2344]/50" : "bg-white/50"} backdrop-blur-sm p-3 rounded-xl shadow-lg`}>
              <div className="mr-3">
                <Star className={`${theme === "dark" ? "text-amber-300" : "text-amber-500"}`} size={28} />
              </div>
              <div>
                <p className={`text-sm ${theme === "dark" ? "text-indigo-200/70" : "text-indigo-600/70"}`}>Your Points</p>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-amber-300" : "text-amber-600"}`}>{userPoints}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-indigo-500/20">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 font-medium text-lg ${activeTab === 'tasks' 
              ? `border-b-2 ${theme === "dark" ? "border-indigo-400 text-indigo-300" : "border-indigo-600 text-indigo-700"}` 
              : `${theme === "dark" ? "text-indigo-200/70" : "text-indigo-600/70"}`
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-3 font-medium text-lg ${activeTab === 'rewards' 
              ? `border-b-2 ${theme === "dark" ? "border-indigo-400 text-indigo-300" : "border-indigo-600 text-indigo-700"}` 
              : `${theme === "dark" ? "text-indigo-200/70" : "text-indigo-600/70"}`
            }`}
          >
            Rewards
          </button>
        </div>
        
        {/* Tasks Section */}
        {activeTab === 'tasks' && (
          <div>
            {/* Task Category Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTaskCategory('daily')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTaskCategory === 'daily' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                Daily Tasks
              </button>
              <button
                onClick={() => setActiveTaskCategory('weekly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTaskCategory === 'weekly' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                Weekly Tasks
              </button>
              <button
                onClick={() => setActiveTaskCategory('milestone')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTaskCategory === 'milestone' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                Milestones
              </button>
            </div>
            
            {/* Progress Overview */}
            {activeTaskCategory !== 'milestone' && (
              <div className={`mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  {activeTaskCategory === 'daily' ? 'Daily' : 'Weekly'} Progress
                </h3>
                <div className="mb-2">
                  <ProgressBar 
                    value={(activeTaskCategory === 'daily' ? dailyCompletionPercentage : weeklyCompletionPercentage) / 100} 
                    className={`h-3 ${theme === 'dark' ? 'bg-[#1E1A2E]' : 'bg-indigo-100'}`} 
                  />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600/70'}`}>
                  {activeTaskCategory === 'daily' 
                    ? `${dailyTasksCompleted} of ${dailyTasksTotal} daily tasks completed` 
                    : `${weeklyTasksCompleted} of ${weeklyTasksTotal} weekly tasks completed`}
                </p>
              </div>
            )}
            
            {/* Task List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg transition-all`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                      {task.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'} ${task.completed ? 'line-through opacity-70' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge variant={theme === 'dark' ? "outline" : "secondary"} className={`ml-2 ${theme === 'dark' ? 'text-amber-300 border-amber-300/30' : 'bg-amber-100 text-amber-700'}`}>
                          {task.points} pts
                        </Badge>
                      </div>
                      <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600/70'} ${task.completed ? 'line-through opacity-70' : ''}`}>
                        {task.description}
                      </p>
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          task.completed
                            ? theme === 'dark'
                              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                            : theme === 'dark'
                              ? 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        {task.completed ? (
                          <>
                            <Check size={16} className="mr-1.5" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock size={16} className="mr-1.5" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Rewards Section */}
        {activeTab === 'rewards' && (
          <div>
            {/* Reward Category Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveRewardCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeRewardCategory === 'all' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                All Rewards
              </button>
              <button
                onClick={() => setActiveRewardCategory('digital')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeRewardCategory === 'digital' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                Digital
              </button>
              <button
                onClick={() => setActiveRewardCategory('physical')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeRewardCategory === 'physical' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                Physical
              </button>
              <button
                onClick={() => setActiveRewardCategory('experience')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeRewardCategory === 'experience' 
                    ? theme === "dark" 
                      ? "bg-indigo-500/30 text-indigo-200" 
                      : "bg-indigo-100 text-indigo-700"
                    : theme === "dark" 
                      ? "bg-[#2A2344]/30 text-indigo-200/70 hover:bg-indigo-500/20" 
                      : "bg-white/50 text-indigo-600/70 hover:bg-indigo-100/50"
                }`}
              >
                Experiences
              </button>
            </div>
            
            {/* Featured Rewards */}
            {activeRewardCategory === 'all' && (
              <div className="mb-8">
                <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  Featured Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.filter(reward => reward.featured).map(reward => (
                    <motion.div
                      key={reward.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg transition-all border-2 ${theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200'}`}
                    >
                      <div className="flex">
                        <div className={`p-4 rounded-xl mr-4 ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                              {reward.title}
                            </h3>
                            <Badge variant="outline" className={`ml-2 ${theme === 'dark' ? 'text-amber-300 border-amber-300/30' : 'text-amber-700 border-amber-300'}`}>
                              Featured
                            </Badge>
                          </div>
                          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600/70'}`}>
                            {reward.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                              {reward.pointsCost} points
                            </span>
                            <Button
                              onClick={() => redeemReward(reward)}
                              disabled={userPoints < reward.pointsCost}
                              className={`${theme === 'dark' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'} transition-all`}
                            >
                              Redeem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredRewards.map(reward => (
                <motion.div
                  key={reward.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#2A2344]/50' : 'bg-white/50'} backdrop-blur-sm shadow-lg transition-all`}
                >
                  <div className={`p-3 rounded-lg mb-3 inline-block ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                    {reward.icon}
                  </div>
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                    {reward.title}
                  </h3>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600/70'}`}>
                    {reward.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                      {reward.pointsCost} points
                    </span>
                    <Button
                      onClick={() => redeemReward(reward)}
                      disabled={userPoints < reward.pointsCost}
                      variant={theme === 'dark' ? "outline" : "secondary"}
                      className={`${userPoints >= reward.pointsCost 
                        ? theme === 'dark' 
                          ? 'border-indigo-400 text-indigo-200 hover:bg-indigo-500/20' 
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                        : 'opacity-50'}`}
                    >
                      {userPoints >= reward.pointsCost ? "Redeem" : "Not Enough Points"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardStore;
