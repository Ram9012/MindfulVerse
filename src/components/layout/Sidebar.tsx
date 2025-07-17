import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Settings, BarChart2, MessageCircle, Heart, Menu, ChevronLeft, Users, Glasses, Activity, LogOut } from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active }) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/10"
      }`}
    >
      <div className="text-xl">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { collapsed, toggleSidebar, isMobile } = useSidebar();
  const { theme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile toggle button - fixed position */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-wellness-purple text-white rounded-md shadow-md hover:bg-wellness-navy focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40 ${
          collapsed ? "w-16" : "w-64"
        } ${isMobile && collapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Logo and Toggle Button Section */}
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-2xl font-bold text-wellness-purple">MindfulVerse</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 bg-wellness-purple text-white rounded-md shadow-md hover:bg-wellness-navy focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={collapsed ? 16 : 24} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={<Home />} 
            label={collapsed ? "" : "Dashboard"} 
            href="/" 
            active={currentPath === "/" || currentPath === "/dashboard"} 
          />
          <SidebarItem 
            icon={<MessageCircle />} 
            label={collapsed ? "" : "Chat"} 
            href="/Chatbot" 
            active={currentPath.includes("/Chatbot")} 
          />
          <SidebarItem 
            icon={<Calendar />} 
            label={collapsed ? "" : "Sessions"} 
            href="/sessions" 
            active={currentPath.includes("/sessions")} 
          />
          
          <SidebarItem 
            icon={<Glasses />} 
            label={collapsed ? "" : "VR Therapy"} 
            href="/VRTherapy" 
            active={currentPath.includes("/VRTherapy")} 
          />

          <SidebarItem 
            icon={<Activity />} 
            label={collapsed ? "" : "Activity Tracking"} 
            href="/activity-tracking" 
            active={currentPath.includes("/activity-tracking")} 
          />

          <SidebarItem 
            icon={<BarChart2 />} 
            label={collapsed ? "" : "Reward Store"} 
            href="/reward-store" 
            active={currentPath.includes("/reward-store")} 
          />
                
          <SidebarItem 
            icon={<Heart />} 
            label={collapsed ? "" : "Relaxation"} 
            href="/relaxation" 
            active={currentPath.includes("/relaxation")} 
          /> 
          <SidebarItem 
            icon={<Users />} 
            label={collapsed ? "" : "Community"} 
            href="/community" 
            active={currentPath.includes("/community")} 
          />
        </div>
        
        <div className="px-3 py-4 border-t border-sidebar-border">
          <SidebarItem 
            icon={<Settings />} 
            label={collapsed ? "" : "Settings"} 
            href="/settings" 
            active={currentPath.includes("/settings")} 
          />
          <div 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 mt-2 rounded-lg transition-colors cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent/10`}
          >
            <div className="text-xl"><LogOut /></div>
            {!collapsed && <span className="font-medium">Logout</span>}
          </div>
          {!collapsed && (
            <div className="mt-4 px-4 py-2 flex items-center justify-between">
              <span className="font-medium text-sidebar-foreground">Theme</span>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;