import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { SidebarProvider } from "./lib/sidebar-context";
import { ThemeProvider } from "./lib/theme-context";
import { createContext, useContext, useState, ReactNode } from 'react';

import PatientDashboard from "./pages/Index";
import TherapistDashboard from "./pages/TherapistDashboard";
import RewardStore from "./pages/RewardStore";
import PatientSessions from "./pages/Sessions";
import TherapistSessions from "./pages/TherapistSessions";
import Chatbot from "./pages/Chatbot";
import Relaxation from "./pages/Relaxation";
import Community from "./pages/Community";
import VRTherapy from "./pages/VRTherapy";
import ActivityTracking from "./pages/ActivityTracking";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Research from "./pages/Research";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// AppRoutes component that uses the useAuth hook
const AppRoutes = () => {
  const auth = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          {auth.userType === 'therapist' ? <TherapistDashboard /> : <PatientDashboard />}
        </ProtectedRoute>
      } />
      <Route path="/reward-store" element={<ProtectedRoute><RewardStore /></ProtectedRoute>} />
      <Route path="/sessions" element={
        <ProtectedRoute>
          {auth.userType === 'therapist' ? <TherapistSessions /> : <PatientSessions />}
        </ProtectedRoute>
      } />
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="/relaxation" element={<ProtectedRoute><Relaxation /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/VRTherapy" element={<ProtectedRoute><VRTherapy /></ProtectedRoute>} />
      <Route path="/activity-tracking" element={<ProtectedRoute><ActivityTracking /></ProtectedRoute>} />
      <Route path="/research" element={
        <ProtectedRoute>
          {auth.userType === 'therapist' ? <Research /> : <Navigate to="/" />}
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const queryClient = new QueryClient();
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
