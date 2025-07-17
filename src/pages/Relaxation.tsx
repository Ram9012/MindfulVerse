
import { Header } from "@/components/layout/Header";
import  Sidebar  from "@/components/layout/Sidebar";
import { RelaxationGuidance } from "@/components/sessions/RelaxationGuidance";
import { CloudSun, Stars, Moon } from "lucide-react";

const Relaxation = () => {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-20 p-8">
        <div className="rounded-xl bg-gradient-to-br from-teal/20 to-violet/20 p-6 shadow-lg border border-white/10">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-white mr-3">Relaxation & Meditation</h2>
            <Stars className="h-6 w-6 text-amber animate-pulse" />
          </div>
          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-2">
              Guided meditations and relaxation techniques to help you find peace and calm.
            </p>
            <CloudSun className="h-5 w-5 text-teal" />
          </div>
          
          <div className="p-3 mb-6 rounded-lg bg-violet/10 border border-violet/20 flex items-center">
            <Moon className="h-5 w-5 text-violet mr-2" />
            <p className="text-violet text-sm">Taking a moment to breathe is your superpower! ✨</p>
          </div>
          
          <RelaxationGuidance />
        </div>
      </main>
    </div>
  );
};

export default Relaxation;
