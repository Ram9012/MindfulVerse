import React, { useState, useEffect } from "react";
import ConditionalSidebar from "@/components/layout/ConditionalSidebar";
import { useSidebar } from "@/lib/sidebar-context";
import { useTheme } from "@/lib/theme-context";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VoiceRecorder from "@/components/sessions/VoiceRecorder";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { 
  Calendar, 
  Clock, 
  Star, 
  Sparkles, 
  MessageSquare, 
  Lightbulb, 
  FileText, 
  User, 
  Heart, 
  Brain, 
  Activity, 
  Zap,
  BarChart2,
  Mic,
  Square
} from "lucide-react";

interface TranscriptEntry {
  // Common fields
  speaker: string;
  // Different possible field names for the transcript text
  utterance?: string;
  text?: string;
  content?: string;
  // Optional fields for analysis
  index?: number;
  timestamp?: string;
  emotions?: Array<{ label: string; score: number }>;
  themes?: string[];
  distortions?: string[];
}

interface SessionData {
  sessionMeta: {
    sessionId: string;
    patientId: string;
    date: string;
    summary: string;
  };
  // Transcript can be in different formats depending on the source
  transcript: Array<TranscriptEntry>;
  // Raw transcription text if structured format is not available
  transcription?: string;
  // Optional conversation field that might be returned by Gemini
  conversation?: Array<TranscriptEntry>;
  // Analysis data
  emotionTimeline: EmotionData[];
  themesSummary: Record<string, number>;
  distortionSummary: Record<string, number>;
  // Additional fields that might be in the Gemini response
  summary?: string;
}

interface EmotionData {
  label: string;
  data: number[];
}

interface PatientSession {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  duration: number;
  status: string;
}

const TherapistSessions = () => {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [patientSessions, setPatientSessions] = useState<PatientSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recordingError, setRecordingError] = useState<string>("");
  const [recordingSuccess, setRecordingSuccess] = useState<string>("");
  const [showRecorder, setShowRecorder] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('Current session data:', sessionData);
  }, [sessionData]);

  useEffect(() => {
    // Mock data for patient sessions
    const mockSessions = [
      {
        id: "abc123",
        patientId: "patient001",
        patientName: "Rahul Sharma",
        date: "2025-05-01",
        duration: 45,
        status: "completed",
      },
      {
        id: "def456",
        patientId: "patient002",
        patientName: "Priya Patel",
        date: "2025-04-28",
        duration: 30,
        status: "completed",
      },
      {
        id: "ghi789",
        patientId: "patient003",
        patientName: "Arjun Singh",
        date: "2025-04-25",
        duration: 60,
        status: "completed",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setPatientSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (selectedSession) {
        setLoading(true);
        try {
          // In a real app, this would be a fetch call with the selected session ID
          // For now, we'll use the sample data
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
      }
    };

    fetchSessionData();
  }, [selectedSession]);

  // Transform emotion timeline data for the chart
  const transformedData = sessionData?.emotionTimeline?.[0]?.data.map((_, index) => ({
    name: `Statement ${index + 1}`,
    ...Object.fromEntries(
      sessionData.emotionTimeline.map(emotion => [
        emotion.label,
        emotion.data[index]
      ])
    )
  })) ?? [];

  const getEmotionColor = (emotion: string) => {
    const colors = {
      sadness: "#3B82F6", // blue
      anger: "#EF4444",   // red
      joy: "#10B981",     // green
      love: "#EC4899",    // pink
      fear: "#6B7280",    // gray
      surprise: "#F59E0B" // amber
    };
    return colors[emotion as keyof typeof colors] || "#6B7280";
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-b from-[#262133] to-[#16112a]' : 'bg-gradient-to-b from-slate-100 to-blue-50'}`}
    >
      <ConditionalSidebar />
      <main
        className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? 'ml-16' : isMobile ? 'ml-0' : 'md:ml-64'} ${collapsed ? 'max-w-[calc(100%-4rem)]' : 'max-w-[calc(100%-16rem)]'}`}
      >
        {/* Header Section with animated background */}
        <div className="flex flex-col gap-8 animate-fade-in relative">
          <div className="flex justify-between items-start relative">
            {/* Dark background with animated elements */}
            <div className={`absolute -inset-6 rounded-xl overflow-hidden -z-10 ${theme === 'dark' 
              ? 'bg-[#2d3142]/80' 
              : 'bg-gradient-to-r from-purple-100 to-indigo-200 shadow-md'}`}>
            {/* Animated elements */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`header-element-${i}`}
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
                  <Sparkles className={theme === 'dark' ? "text-indigo-300" : "text-indigo-400"} size={i % 2 === 0 ? 14 : 18} />
                ) : i % 3 === 1 ? (
                  <Star className={theme === 'dark' ? "text-purple-300" : "text-purple-400"} size={i % 2 === 0 ? 12 : 16} />
                ) : (
                  <Activity className={theme === 'dark' ? "text-pink-300" : "text-pink-400"} size={i % 2 === 0 ? 16 : 20} />
                )}
              </div>
            ))}
          </div>  
            {/* Gradient overlay */}
            <div className={`absolute inset-0 ${theme === 'dark' 
              ? 'bg-gradient-to-r from-[#2d3142]/50 to-[#3e4259]/60' 
              : 'bg-gradient-to-r from-purple-100/70 to-indigo-200/80'}`}></div>
          </div>
          
          <div className="p-4">
            <h1 className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
              Patient Sessions
            </h1>
            <p className={`text-xl mb-8 max-w-2xl ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600'}`}>
              Track patient progress and analyze session insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Sessions List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1">
            
            {/* Voice Recording Section - Moved to top */}
            <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm mb-6`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <CardTitle>Session Recording</CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowRecorder(!showRecorder)}
                    className={theme === 'dark' ? 'text-indigo-300 border-indigo-700' : 'text-indigo-600 border-indigo-300'}
                  >
                    {showRecorder ? 'Hide Recorder' : 'Show Recorder'}
                  </Button>
                </div>
                <CardDescription>Record and analyze therapy sessions with Gemini 1.5 Pro</CardDescription>
              </CardHeader>
              {showRecorder && (
                <CardContent>
                  {recordingError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{recordingError}</AlertDescription>
                    </Alert>
                  )}
                  {recordingSuccess && (
                    <Alert className="mb-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      <AlertDescription>{recordingSuccess}</AlertDescription>
                    </Alert>
                  )}
                  <VoiceRecorder 
                    onTranscriptionComplete={(data) => {
                      console.log('Transcription complete - raw data:', data);
                      
                      // Use the data directly from the Gemini transcription service
                      // The backend already processes with Gemini 1.5 Pro and the classification model
                      console.log('Raw data from voice recorder:', JSON.stringify(data, null, 2));
                      
                      // Log the raw data structure from Gemini
                      console.log('Raw Gemini transcription data:', JSON.stringify(data, null, 2));
                      
                      // Create a properly structured SessionData object
                      const processedData: SessionData = {
                        sessionMeta: data.sessionMeta || {
                          sessionId: 'new-recording-' + Date.now(),
                          patientId: 'current-patient',
                          date: new Date().toISOString(),
                          summary: data.summary || 'Session summary not available'
                        },
                        // Handle different possible transcript formats from Gemini
                        transcript: data.structured_transcript || data.transcript || 
                                   (data.conversation ? data.conversation : []),
                        emotionTimeline: data.emotionTimeline || [],
                        themesSummary: data.themesSummary || {},
                        distortionSummary: data.distortionSummary || {}
                      };
                      
                      // Ensure we have a unique session ID
                      processedData.sessionMeta.sessionId = 'new-recording-' + Date.now();
                      
                      // If the transcript is empty but we have raw text, create a simple transcript
                      if ((!processedData.transcript || processedData.transcript.length === 0) && data.transcription) {
                        processedData.transcript = [
                          {
                            speaker: 'Patient',
                            text: data.transcription,
                            timestamp: new Date().toISOString()
                          }
                        ];
                      }
                      
                      console.log('Processed session data:', processedData);
                      
                      // Set the data and update UI state
                      setSessionData(processedData);
                      setSelectedSession('new-recording');
                      setShowRecorder(false);
                      
                      // Show success message
                      setRecordingError(""); // Clear any existing errors
                      setRecordingSuccess("Recording processed successfully with Gemini 1.5 Pro! View the analysis below.");
                      
                      // Force a re-render by setting loading briefly
                      setLoading(true);
                      setTimeout(() => setLoading(false), 100);
                    }}
                    onError={(error) => {
                      console.error('Recording error:', error);
                      setRecordingError(error);
                    }}
                  />
                </CardContent>
              )}  
            </Card>
            
            {/* All Sessions Card */}
            <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <CardTitle>All Sessions</CardTitle>
                </div>
                <CardDescription>Select a session to view details</CardDescription>
              </CardHeader>
              <CardContent>
                {loading && !patientSessions.length ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {patientSessions.map((session, index) => (
                      <motion.div 
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${selectedSession === session.id 
                          ? (theme === 'dark' ? 'bg-indigo-900/50 border-l-4 border-indigo-500' : 'bg-indigo-100 border-l-4 border-indigo-500') 
                          : (theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-100 hover:bg-slate-200')
                        }`}
                        onClick={() => handleSessionSelect(session.id)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{session.patientName}</h3>
                          <Badge className={`${
                            session.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {session.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {session.duration} minutes
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Session Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : sessionData ? (
              <div className="grid gap-6">
                {/* Session Meta Information */}
                <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <CardTitle>Session Information</CardTitle>
                    </div>
                    <CardDescription>Session details and metadata</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <p className="text-sm font-medium">Session ID</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{sessionData.sessionMeta.sessionId}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <p className="text-sm font-medium">Patient ID</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{sessionData.sessionMeta.patientId}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <p className="text-sm font-medium">Date</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{new Date(sessionData.sessionMeta.date).toLocaleDateString()}</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="transcript" className="w-full">
                  <TabsList className={`grid w-full grid-cols-3 p-1 ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}>
                    <TabsTrigger value="transcript" className={`data-[state=active]:${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-200' : 'bg-white text-indigo-700'}`}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Transcript</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="emotions" className={`data-[state=active]:${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-200' : 'bg-white text-indigo-700'}`}>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        <span>Emotions</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="themes" className={`data-[state=active]:${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-200' : 'bg-white text-indigo-700'}`}>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        <span>Themes</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="transcript">
                    <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <CardTitle>Session Transcript</CardTitle>
                        </div>
                        <CardDescription>Conversation with emotional analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                          {sessionData.transcript && sessionData.transcript.map((entry, index) => (
                            <motion.div 
                              key={`transcript-entry-${index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`p-4 rounded-lg ${
                                (entry.speaker === 'patient' || entry.speaker === 'Patient' || entry.speaker?.toLowerCase().includes('patient')) 
                                  ? theme === 'dark' ? 'bg-slate-800/70 border-l-4 border-indigo-500' : 'bg-slate-100 border-l-4 border-indigo-500' 
                                  : theme === 'dark' ? 'bg-slate-800/30 border-l-4 border-green-500' : 'bg-white border-l-4 border-green-500'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1 rounded-full ${
                                  (entry.speaker === 'patient' || entry.speaker === 'Patient' || entry.speaker?.toLowerCase().includes('patient'))
                                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                    : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {(entry.speaker === 'patient' || entry.speaker === 'Patient' || entry.speaker?.toLowerCase().includes('patient')) ? <User size={14} /> : <User size={14} />}
                                </div>
                                <strong className="capitalize">{entry.speaker || 'Unknown'}</strong>
                              </div>
                              <p className="mb-2">{entry.utterance || entry.text || entry.content || ''}</p>
                              {entry.emotions && entry.emotions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {entry.emotions.map((emotion, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 rounded-full"
                                      style={{
                                        backgroundColor: theme === 'dark' 
                                          ? `${getEmotionColor(emotion.label)}33` 
                                          : `${getEmotionColor(emotion.label)}22`,
                                        color: getEmotionColor(emotion.label)
                                      }}
                                    >
                                      {emotion.label} ({(emotion.score * 100).toFixed(1)}%)
                                    </span>
                                  ))}
                                </div>
                              )}
                              {entry.themes && entry.themes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {entry.themes.map((theme, idx) => (
                                    <span
                                      key={idx}
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                                      }`}
                                    >
                                      #{theme}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="emotions">
                    <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Heart className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <CardTitle>Emotion Timeline</CardTitle>
                        </div>
                        <CardDescription>Emotional progression throughout the session</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                                borderRadius: '0.5rem',
                              }} 
                            />
                            {sessionData.emotionTimeline.map((emotion) => (
                              <Area
                                key={emotion.label}
                                type="monotone"
                                dataKey={emotion.label}
                                stackId="1"
                                stroke={getEmotionColor(emotion.label)}
                                fill={getEmotionColor(emotion.label)}
                                opacity={0.7}
                              />
                            ))}
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="themes">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sessionData.themesSummary && Object.keys(sessionData.themesSummary).length > 0 && (
                        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Lightbulb className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                              <CardTitle>Themes</CardTitle>
                            </div>
                            <CardDescription>Identified themes in the session</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}>
                              <Table>
                                <TableHeader className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}>
                                  <TableRow>
                                    <TableHead>Theme</TableHead>
                                    <TableHead>Occurrences</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(sessionData.themesSummary).map(([theme, count], index) => (
                                    <motion.tr 
                                      key={theme}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/50') : ''}`}
                                    >
                                      <TableCell className="capitalize font-medium">{theme}</TableCell>
                                      <TableCell>
                                        <Badge className={`${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>
                                          {count}
                                        </Badge>
                                      </TableCell>
                                    </motion.tr>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {sessionData.distortionSummary && Object.keys(sessionData.distortionSummary).length > 0 && (
                        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Brain className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                              <CardTitle>Cognitive Distortions</CardTitle>
                            </div>
                            <CardDescription>Identified cognitive patterns</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}>
                              <Table>
                                <TableHeader className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}>
                                  <TableRow>
                                    <TableHead>Distortion</TableHead>
                                    <TableHead>Occurrences</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(sessionData.distortionSummary).map(([distortion, count], index) => (
                                    <motion.tr 
                                      key={distortion}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/50') : ''}`}
                                    >
                                      <TableCell className="capitalize font-medium">{distortion}</TableCell>
                                      <TableCell>
                                        <Badge className={`${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>
                                          {count}
                                        </Badge>
                                      </TableCell>
                                    </motion.tr>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Session Summary */}
                {sessionData.sessionMeta.summary && sessionData.sessionMeta.summary !== "Summary could not be generated. Please check the Gemini API key or input." && (
                  <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <CardTitle>Session Summary</CardTitle>
                      </div>
                      <CardDescription>AI-generated insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}
                      >
                        <p className="whitespace-pre-line">{sessionData.sessionMeta.summary}</p>
                      </motion.div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm h-64 flex items-center justify-center`}>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <BarChart2 className={`h-12 w-12 mx-auto ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <CardTitle className="mb-2">No Session Selected</CardTitle>
                  <CardDescription>Please select a session from the list to view details</CardDescription>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TherapistSessions;