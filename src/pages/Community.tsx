
import { Header } from "@/components/layout/Header";
import  Sidebar  from "@/components/layout/Sidebar";
import { CommunitySection } from "@/components/sessions/CommunitySection";
import { UserPlus, PartyPopper, Heart } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-20 p-8">
        <div className="rounded-xl bg-gradient-to-br from-amber/20 to-violet/20 p-6 shadow-lg border border-white/10">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-white mr-3">Community</h2>
            <PartyPopper className="h-6 w-6 text-amber animate-pulse" />
          </div>
          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-2">
              Connect with others on their mental health journey, share experiences, and participate in group discussions.
            </p>
            <Heart className="h-5 w-5 text-red-400" fill="#f87171" />
          </div>
          
          <div className="p-3 mb-6 rounded-lg bg-amber/10 border border-amber/20 flex items-center">
            <UserPlus className="h-5 w-5 text-amber mr-2" />
            <p className="text-amber text-sm">You're never alone on this journey! We're all in this together! 🤗</p>
          </div>
          
          <CommunitySection />
        </div>
      </main>
    </div>
  );
};

export default Community;
