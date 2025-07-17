import React from "react";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "./Sidebar";
import TherapistSidebar from "./TherapistSidebar";

const ConditionalSidebar: React.FC = () => {
  const { userType } = useAuth();

  // Render the appropriate sidebar based on user type
  return userType === 'therapist' ? <TherapistSidebar /> : <Sidebar />;
};

export default ConditionalSidebar;