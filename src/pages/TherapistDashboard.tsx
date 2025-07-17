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
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkle, 
  Star, 
  CloudSun, 
  Users, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  BarChart, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  UserRound,
  MessageSquare,
  CalendarDays,
  Timer
} from "lucide-react";

interface PatientData {
  id: string;
  name: string;
  lastSession: string;
  totalSessions: number;
  progress: number;
}

const TherapistDashboard = () => {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app, this would be fetched from an API
    const mockPatients = [
      {
        id: "patient001",
        name: "Rahul Sharma",
        lastSession: "2025-05-01",
        totalSessions: 8,
        progress: 75,
      },
      {
        id: "patient002",
        name: "Priya Patel",
        lastSession: "2025-04-28",
        totalSessions: 5,
        progress: 60,
      },
      {
        id: "patient003",
        name: "Arjun Singh",
        lastSession: "2025-04-25",
        totalSessions: 12,
        progress: 85,
      },
      {
        id: "patient004",
        name: "Neha Gupta",
        lastSession: "2025-05-02",
        totalSessions: 3,
        progress: 40,
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${theme === 'dark' 
        ? 'bg-gradient-to-b from-[#262133] to-[#16112a]' 
        : 'bg-gradient-to-b from-slate-100 to-blue-50'}`}
    >
      <ConditionalSidebar />
      
      <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${collapsed ? 'ml-16' : isMobile ? 'ml-0' : 'md:ml-64'} ${collapsed ? 'max-w-[calc(100%-4rem)]' : 'max-w-[calc(100%-16rem)]'}`}>
        <div className="flex justify-between items-start mb-8 animate-fade-in relative">
          {/* Dark purple background with animated stars */}
          <div className={`absolute -inset-6 rounded-xl overflow-hidden -z-10 ${theme === 'dark' 
            ? 'bg-[#2d3142]/80' 
            : 'bg-gradient-to-r from-indigo-100 to-purple-200 shadow-md'}`}>
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
                  <Sparkle className={theme === 'dark' ? "text-indigo-300" : "text-indigo-500"} size={i % 2 === 0 ? 14 : 18} />
                ) : i % 3 === 1 ? (
                  <Star className={theme === 'dark' ? "text-purple-300" : "text-purple-500"} size={i % 2 === 0 ? 12 : 16} />
                ) : (
                  <CloudSun className={theme === 'dark' ? "text-pink-300" : "text-pink-500"} size={i % 2 === 0 ? 16 : 20} />
                )}
              </div>
            ))}
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 ${theme === 'dark' 
              ? 'bg-gradient-to-r from-[#2d3142]/50 to-[#3e4259]/60' 
              : 'bg-gradient-to-r from-indigo-100/70 to-purple-200/80'}`}></div>
          </div>
          
          <div className="p-4">
            <h1 className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
              Therapist Dashboard
            </h1>
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-600'}`}>
              Patient Management
            </h2>
            <p className={`text-xl mb-8 max-w-2xl ${theme === 'dark' ? 'text-indigo-200/70' : 'text-indigo-600'}`}>
              Monitor your patients' progress and access their therapy sessions.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm h-full`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                  <Users className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
                </div>
                <h3 className="text-3xl font-bold">{patients.length}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Active Patients</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm h-full`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <CalendarDays className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
                </div>
                <h3 className="text-3xl font-bold">24</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Sessions This Month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm h-full`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-pink-900/50' : 'bg-pink-100'}`}>
                  <Timer className={`h-6 w-6 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`} />
                </div>
                <h3 className="text-3xl font-bold">36</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Hours of Therapy</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm h-full`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'}`}>
                  <Activity className={`h-6 w-6 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
                </div>
                <h3 className="text-3xl font-bold">68%</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Average Progress</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Patients Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <CardTitle>Patients Overview</CardTitle>
              </div>
              <CardDescription>Summary of all your patients</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}>
                  <Table>
                    <TableHeader className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Last Session</TableHead>
                        <TableHead>Total Sessions</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient, index) => (
                        <motion.tr 
                          key={patient.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/50') : ''}`}
                        >
                          <TableCell className="font-mono text-xs">{patient.id}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                                <UserRound className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
                              </div>
                              {patient.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(patient.lastSession).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>
                              {patient.totalSessions}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  patient.progress >= 75 ? 'bg-green-500' : 
                                  patient.progress >= 50 ? 'bg-blue-500' : 
                                  'bg-amber-500'
                                }`}
                                style={{ width: `${patient.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {patient.progress}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${
                              patient.progress >= 75 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : patient.progress >= 50
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {patient.progress >= 75 ? 'Excellent' : patient.progress >= 50 ? 'Good' : 'Needs Support'}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className={`pt-0 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
              <Button variant="ghost" className="ml-auto">
                <span>View All Patients</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Recent Sessions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <CardTitle>Recent Sessions</CardTitle>
              </div>
              <CardDescription>Latest therapy sessions conducted</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.slice(0, 3).map((patient, index) => (
                    <motion.div 
                      key={`session-${patient.id}`} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/70' : 'bg-slate-100'}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                            <UserRound className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
                          </div>
                          <h3 className="font-semibold">{patient.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(patient.lastSession).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1 rounded-full ${
                          patient.progress >= 75 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                            : patient.progress >= 50
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {patient.progress >= 75 ? <CheckCircle2 size={14} /> : patient.progress >= 50 ? <Activity size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <span className="text-xs">
                          {patient.progress >= 75 ? "Showing excellent progress" : 
                           patient.progress >= 50 ? "Making steady progress" : "Needs additional support"}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-3`}>
                        Session focused on cognitive behavioral techniques and mindfulness exercises.
                      </p>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`w-full justify-between ${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/20' : 'text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100'}`}
                        asChild
                      >
                        <a href={`/sessions?patient=${patient.id}`}>
                          <span>View detailed session notes</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className={`pt-0 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
              <Button variant="ghost" className="ml-auto">
                <span>View All Sessions</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TherapistDashboard;