
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

export function Header() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const userName = user?.username || "User";
  const currentTime = new Date();
  const hours = currentTime.getHours();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    return "Good morning";
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.username) return "U";
    return user.username.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className={`fixed left-64 right-0 top-0 z-10 flex h-20 items-center justify-between border-b px-8 ${theme === 'dark' ? 'border-white/10 bg-black' : 'border-gray-200 bg-white'}`}>
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{getGreeting()},</span> {userName}
      </h1>
      <div className="flex items-center gap-4">
        <button className={`relative transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-violet"></span>
        </button>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.profile_picture ? `${user.profile_picture}` : "/placeholder.svg"} alt={userName} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <span className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userName}</span>
      </div>
    </header>
  );
}
