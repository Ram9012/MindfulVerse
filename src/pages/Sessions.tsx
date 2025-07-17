import React, { useEffect, useState } from "react";
import { BookOpen, Sparkles, MessageSquare, Footprints, Lightbulb, BookOpenText, FileText, Leaf, Calendar, Clock, Star, CloudSun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import ConditionalSidebar from "@/components/layout/ConditionalSidebar";
import { useSidebar } from "@/lib/sidebar-context";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EmotionData {
  label: string;
  data: number[];
}

interface SessionData {
  sessionMeta: {
    sessionId: string;
    patientId: string;
    date: string;
    summary: string;
  };
  transcript: Array<{
    index: number;
    speaker: string;
    utterance: string;
    emotions: Array<{ label: string; score: number }>;
    themes: string[];
    distortions: string[];
  }>;
  emotionTimeline: EmotionData[];
  themesSummary: Record<string, number>;
  distortionSummary: Record<string, number>;
}

const Sessions = () => {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/session-dashboard');
        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        console.error('Error fetching session data:', err);
        // Fallback to using the JSON file directly
        try {
          const response = await fetch('/session_dashboard_output.json');
          const data = await response.json();
          setSessionData(data);
        } catch (fallbackErr) {
          console.error('Error loading fallback data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  // Generate reflection prompts based on session data
  const generateReflectionPrompts = () => {
    if (!sessionData) return [];
    
    const emotions = [];
    sessionData.emotionTimeline.forEach(emotion => {
      if (emotion.data.some(score => score > 0.5)) {
        emotions.push(emotion.label);
      }
    });
    
    const themes = Object.keys(sessionData.themesSummary || {});
    
    const prompts = [];
    
    // Add theme-based prompts
    if (themes.includes('self-esteem')) {
      prompts.push("You reflected on your self-worth today.");
    }
    
    if (themes.includes('hope')) {
      prompts.push("You expressed feelings of hope.");
    }
    
    if (themes.includes('fatigue')) {
      prompts.push("You mentioned feeling tired lately.");
    }
    
    // Add emotion-based prompts
    if (emotions.includes('joy')) {
      prompts.push("You shared moments of joy.");
    }
    
    if (emotions.includes('sadness')) {
      prompts.push("You expressed some sadness today.");
    }
    
    // Add cognitive distortion prompts if available
    if (sessionData.distortionSummary) {
      const distortions = Object.keys(sessionData.distortionSummary);
      if (distortions.includes('overgeneralization')) {
        prompts.push("We discussed how to challenge all-or-nothing thinking.");
      }
      if (distortions.includes('catastrophizing')) {
        prompts.push("We explored ways to manage worry about future events.");
      }
    }
    
    // Ensure we have at least a few prompts
    if (prompts.length < 2) {
      prompts.push("You shared your thoughts openly today.");
      prompts.push("We had a meaningful conversation.");
    }
    
    return prompts;
  };

  // Extract session themes
  const getSessionThemes = () => {
    if (!sessionData?.themesSummary) return [];
    
    return Object.keys(sessionData.themesSummary).map(theme => ({
      name: theme,
      count: sessionData.themesSummary[theme]
    })).sort((a, b) => b.count - a.count).slice(0, 5);
  };

  // Generate conversation highlights based on actual transcript data
  const getConversationHighlights = () => {
    if (!sessionData?.transcript) return [];
    
    const highlights = [];
    
    // Look for patient statements with strong emotions or themes
    const patientStatements = sessionData.transcript.filter(entry => 
      entry.speaker === 'patient' && 
      ((entry.emotions && entry.emotions.some(e => e.score > 0.5)) || 
       (entry.themes && entry.themes.length > 0))
    );
    
    if (patientStatements.length > 0) {
      // Process each patient statement to generate highlights
      patientStatements.forEach(statement => {
        const mainEmotion = statement.emotions && statement.emotions.length > 0 
          ? statement.emotions.sort((a, b) => b.score - a.score)[0] 
          : null;
          
        const mainTheme = statement.themes && statement.themes.length > 0 
          ? statement.themes[0] 
          : null;
        
        // Create highlights based on the actual content of the statement
        if (statement.utterance.includes("mess up") || statement.utterance.includes("failing")) {
          highlights.push("We discussed your feelings about perceived failures.");
        } else if (statement.utterance.includes("hopeful")) {
          highlights.push("You shared what gives you hope.");
        } else if (mainEmotion && mainEmotion.label === 'sadness' && mainEmotion.score > 0.6) {
          highlights.push("You expressed feeling tired and overwhelmed.");
        } else if (mainEmotion && mainEmotion.label === 'joy' && mainEmotion.score > 0.6) {
          highlights.push("We explored sources of joy and optimism in your life.");
        } else if (mainTheme === 'self-esteem') {
          highlights.push("We discussed ways to build your self-confidence.");
        } else if (mainTheme === 'fatigue') {
          highlights.push("You shared your experiences with feeling tired.");
        } else if (mainTheme === 'hope') {
          highlights.push("We talked about nurturing hope in challenging times.");
        }
      });
    }
    
    // Remove duplicate highlights
    const uniqueHighlights = [...new Set(highlights)];
    
    // Add default highlights if we don't have enough
    if (uniqueHighlights.length < 2) {
      if (!uniqueHighlights.some(h => h.includes("hope"))) {
        uniqueHighlights.push("We discussed what gives you a sense of optimism.");
      }
      if (!uniqueHighlights.some(h => h.includes("tired") || h.includes("exhausted"))) {
        uniqueHighlights.push("You talked about feeling exhausted recently.");
      }
    }
    
    return uniqueHighlights;
  };

  // Get psychoeducation modules based on session data
  const getPsychoEducationModules = () => {
    if (!sessionData) return [
      { title: "Understanding anxiety", icon: <BookOpen className="h-6 w-6 text-blue-400" /> },
      { title: "Why we react the way we do", icon: <BookOpenText className="h-6 w-6 text-rose-400" /> }
    ];
    
    const modules = [];
    
    // Add modules based on themes and distortions in the session
    if (sessionData.distortionSummary && Object.keys(sessionData.distortionSummary).includes('overgeneralization')) {
      modules.push({ 
        title: "Challenging all-or-nothing thinking", 
        icon: <BookOpen className="h-6 w-6 text-blue-400" /> 
      });
    }
    
    if (sessionData.distortionSummary && Object.keys(sessionData.distortionSummary).includes('catastrophizing')) {
      modules.push({ 
        title: "Managing worry about future events", 
        icon: <BookOpenText className="h-6 w-6 text-rose-400" /> 
      });
    }
    
    if (sessionData.themesSummary && Object.keys(sessionData.themesSummary).includes('self-esteem')) {
      modules.push({ 
        title: "Building self-worth and confidence", 
        icon: <Lightbulb className="h-6 w-6 text-yellow-400" /> 
      });
    }
    
    // Ensure we have at least two modules
    if (modules.length < 2) {
      modules.push({ 
        title: "Understanding emotions", 
        icon: <BookOpen className="h-6 w-6 text-blue-400" /> 
      });
    }
    
    return modules;
  };

  // Get next suggested practice based on session data
  const getNextPractice = () => {
    if (!sessionData) return "Take 5 minutes today to think about what made you smile this week.";
    
    // Determine practice based on themes and emotions
    const themes = Object.keys(sessionData.themesSummary || {});
    const emotions = [];
    
    sessionData.emotionTimeline.forEach(emotion => {
      if (emotion.data.some(score => score > 0.5)) {
        emotions.push(emotion.label);
      }
    });
    
    if (themes.includes('hope')) {
      return "Write down three things that gave you hope this week, no matter how small.";
    }
    
    if (emotions.includes('sadness') && themes.includes('fatigue')) {
      return "Try a 5-minute mindfulness exercise when you're feeling overwhelmed.";
    }
    
    if (sessionData.distortionSummary && Object.keys(sessionData.distortionSummary).includes('overgeneralization')) {
      return "When you catch yourself thinking in absolutes, try to find one exception to your thought.";
    }
    
    return "Take 5 minutes today to think about what made you smile this week.";
  };

  const reflectionPrompts = generateReflectionPrompts();
  const sessionThemes = getSessionThemes();
  const conversationHighlights = getConversationHighlights();
  const psychoEducationModules = getPsychoEducationModules();
  const nextPractice = getNextPractice();

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' ? 'bg-gradient-to-b from-[#262133] to-[#16112a]' : 'bg-gradient-to-b from-slate-100 to-blue-50'
    }`}>
      <ConditionalSidebar />
      <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? 'ml-16' : isMobile ? 'ml-0' : 'md:ml-64'} ${collapsed ? 'max-w-[calc(100%-4rem)]' : 'max-w-[calc(100%-16rem)]'}`}>
        <div className="flex justify-between items-start mb-8 animate-fade-in relative">
          {/* Dark background with animated stars */}
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
                  <Sparkles className="text-indigo-300" size={i % 2 === 0 ? 14 : 18} />
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
          </div>
          
          <div className="p-4">
            <h1 className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
              Session Insights
            </h1>
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-600'}`}>
              Your Therapy Journey
            </h2>
            <p className={`text-xl mb-8 max-w-2xl ${theme === 'dark' ? 'text-amber-100/70' : 'text-amber-600'}`}>
              Track your progress and explore insights from your therapy sessions.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sessionData ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6 auto-rows-auto">
              {/* Next Therapy Session */}
              <Card className="border-0 shadow-md bg-opacity-20 backdrop-blur-sm bg-slate-900 text-white">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle>Your Next Session</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500 flex items-center justify-center mr-3 sm:mr-4">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">Therapy with Dr. Sharma</h3>
                        <p className="text-slate-300 text-xs sm:text-sm">Individual Session</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="bg-slate-700 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-indigo-400" />
                          <span className="text-xs sm:text-sm text-slate-300">Date</span>
                        </div>
                        <p className="font-medium text-sm sm:text-base">May 15, 2025</p>
                      </div>
                      
                      <div className="bg-slate-700 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center mb-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-indigo-400" />
                          <span className="text-xs sm:text-sm text-slate-300">Time</span>
                        </div>
                        <p className="font-medium text-sm sm:text-base">2:00 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm py-1 h-auto sm:h-9">
                        Confirm Session
                      </Button>
                      <Button variant="outline" className="border-white/20 hover:bg-white/10 text-xs sm:text-sm py-1 h-auto sm:h-9">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What We Talked About */}
              <Card className="border-0 shadow-md bg-opacity-20 backdrop-blur-sm bg-slate-900 text-white">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <CardTitle>What We Talked About</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversationHighlights.map((highlight, index) => (
                      <p key={index} className="text-base">{highlight}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Therapist's Insights */}
                <Card className="border-0 shadow-md bg-opacity-20 backdrop-blur-sm bg-slate-900 text-white">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      <CardTitle>Therapist's Insights</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base italic">"This week we'll emphasize positive emotions and continue building on your strengths."</p>
                  </CardContent>
                </Card>

                {/* Learn About Yourself */}
                <Card className="border-0 shadow-md bg-opacity-20 backdrop-blur-sm bg-slate-900 text-white">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpenText className="h-5 w-5" />
                      <CardTitle>Learn About Yourself</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {psychoEducationModules.map((module, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                          {module.icon}
                          <span>{module.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Session Summary */}
              <Card className="border-0 shadow-md bg-opacity-20 backdrop-blur-sm bg-slate-900 text-white">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle>Session Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {sessionData.sessionMeta.summary ? 
                      // Display a condensed version of the summary if it's too long
                      sessionData.sessionMeta.summary.length > 300 ? 
                        sessionData.sessionMeta.summary.substring(0, 300) + "..." : 
                        sessionData.sessionMeta.summary
                      : 
                      "In our session, we explored your recent feelings of exhaustion and discussed how you find hope in certain aspects of your life. You showed courage in reflecting on what matters to you. Remember that each step you take, no matter how small, is progress on your journey toward well-being."}
                  </p>
                </CardContent>
              </Card>

              {/* Next Suggested Practice */}
              <Card className="border-0 shadow-md bg-opacity-20 backdrop-blur-sm bg-slate-900 text-white">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    <CardTitle>Next Suggested Practice</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{nextPractice}</p>
                  <Button variant="outline" className="mt-4 border-white/20 hover:bg-white/10">
                    Set a reminder
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Session Data</CardTitle>
                <CardDescription>No session data is currently available.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
 
 
  );
};

export default Sessions;