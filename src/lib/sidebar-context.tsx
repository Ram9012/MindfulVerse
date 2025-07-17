import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
  collapsed: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the existing useIsMobile hook to detect mobile devices
  const isMobileDevice = useIsMobile();
  
  // Initialize collapsed state based on device type
  const [collapsed, setCollapsed] = useState<boolean>(isMobileDevice);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice);

  // Update isMobile state when device type changes
  useEffect(() => {
    setIsMobile(isMobileDevice);
    
    // Auto-collapse sidebar on mobile devices
    if (isMobileDevice && !collapsed) {
      setCollapsed(true);
    }
  }, [isMobileDevice, collapsed]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, isMobile, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};