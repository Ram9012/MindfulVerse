import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Settings, Menu, ChevronLeft, BookOpen, LogOut } from "lucide-react";
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

const TherapistSidebar: React.FC = () => {
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
            <h2 className="text-2xl font-bold text-wellness-purple">Therapist Portal</h2>
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
          {/* Only show Dashboard and Sessions for therapists */}
          <SidebarItem 
            icon={<Home />} 
            label={collapsed ? "" : "Dashboard"} 
            href="/" 
            active={currentPath === "/" || currentPath === "/dashboard"} 
          />
          <SidebarItem 
            icon={<Calendar />} 
            label={collapsed ? "" : "Sessions"} 
            href="/sessions" 
            active={currentPath.includes("/sessions")} 
          />
          <SidebarItem 
            icon={<BookOpen />} 
            label={collapsed ? "" : "Research"} 
            href="/research" 
            active={currentPath.includes("/research")} 
          />
        </div>

        {/* Bottom section with theme toggle and logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors flex items-center gap-2"
            >
              {collapsed ? (
                <LogOut size={20} />
              ) : (
                <>
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TherapistSidebar;