import React from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "@/lib/theme-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex min-h-screen ${theme === 'light' ? 'bg-wellness-background' : 'bg-black'}`}>
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;