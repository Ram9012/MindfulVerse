import React from "react";
import BackgroundDecoration from "@/components/dashboard/BackgroundDecoration";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebar } from "@/lib/sidebar-context";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Glasses, Brain, Target, Calendar, Clock } from "lucide-react";

const VRTherapy = () => {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();

  const upcomingSessions = [
    {
      name: "Height Exposure - Level 4",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "45 mins",
    },
    {
      name: "Social Anxiety Simulation",
      date: "Friday",
      time: "2:30 PM",
      duration: "30 mins",
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${theme === "dark"
        ? "bg-gradient-to-b from-[#262133] to-[#16112a]"
        : "bg-gradient-to-b from-slate-100 to-blue-50"
        }`}
    >
      <BackgroundDecoration />
      <Sidebar />

      <div
        className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${
          collapsed ? "ml-16" : isMobile ? "ml-0" : "md:ml-64"
        } ${collapsed ? "max-w-[calc(100%-4rem)]" : "max-w-[calc(100%-16rem)]"}`}
      >
        {/* Header Section */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-indigo-300" : "text-indigo-800"}`}
          >
            VR Therapy Suite
          </h1>
          <p
            className={`text-xl ${theme === "dark" ? "text-indigo-200/70" : "text-indigo-600"}`}
          >
            Immersive virtual reality sessions designed to help you overcome challenges
            in a safe, controlled environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Session Card */}
          <div
            className={`rounded-3xl p-6 shadow-md ${theme === "dark"
              ? "bg-gradient-to-br from-[#3B3162] to-[#4F3D8B]"
              : "bg-gradient-to-br from-blue-100 to-indigo-200"
              }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <Glasses className="w-12 h-12 text-blue-400" />
              <div>
                <h2
                  className={`text-2xl font-bold ${theme === "dark" ? "text-[#B4A2FF]" : "text-indigo-800"}`}
                >
                  Current Scene
                </h2>
                <p
                  className={`text-xl ${theme === "dark" ? "text-[#9F8BE8]" : "text-indigo-700"}`}
                >
                  Exposure Therapy - Heights
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div
                className={`flex justify-between mb-2 text-sm ${theme === "dark" ? "text-indigo-200/80" : "text-indigo-600"}`}
              >
                <span>Quest Progress</span>
                <span>7/10 Completed</span>
              </div>
              <Progress
                value={70}
                className={`h-3 ${theme === "dark" ? "bg-[#2C2447]" : "bg-indigo-200"}`}
              />
            </div>

            <Button
              className={`w-full mt-6 py-6 text-lg font-semibold ${theme === "dark"
                ? "bg-[#7B68E8] hover:bg-[#6A57D7] text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
            >
              Continue Session
            </Button>
          </div>

          {/* Stats Card */}
          <div
            className={`rounded-3xl p-6 shadow-md ${theme === "dark"
              ? "bg-gradient-to-br from-[#372F55] to-[#4A3A77]"
              : "bg-gradient-to-br from-purple-100 to-purple-300"
              }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-[#E3C2FF]" : "text-purple-900"}`}
            >
              Your Progress
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#2A2344]/50" : "bg-white/50"}`}
              >
                <Brain className="w-8 h-8 mb-2 text-purple-400" />
                <h3
                  className={`font-semibold ${theme === "dark" ? "text-purple-200" : "text-purple-800"}`}
                >
                  Sessions Completed
                </h3>
                <p
                  className={`text-2xl font-bold ${theme === "dark" ? "text-purple-300" : "text-purple-900"}`}
                >
                  24
                </p>
              </div>

              <div
                className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#2A2344]/50" : "bg-white/50"}`}
              >
                <Target className="w-8 h-8 mb-2 text-purple-400" />
                <h3
                  className={`font-semibold ${theme === "dark" ? "text-purple-200" : "text-purple-800"}`}
                >
                  Goals Achieved
                </h3>
                <p
                  className={`text-2xl font-bold ${theme === "dark" ? "text-purple-300" : "text-purple-900"}`}
                >
                  12
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div
          className={`mt-6 rounded-3xl p-6 shadow-md ${theme === "dark"
            ? "bg-gradient-to-br from-[#2D2A43] to-[#3D3359]"
            : "bg-gradient-to-br from-indigo-50 to-purple-100"
            }`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-indigo-300" : "text-indigo-800"}`}
          >
            Upcoming Sessions
          </h2>

          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#2A2344]/50" : "bg-white/50"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`font-semibold ${theme === "dark" ? "text-indigo-200" : "text-indigo-700"}`}
                    >
                      {session.name}
                    </h3>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-indigo-400" />
                        <span
                          className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}
                        >
                          {session.date}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-indigo-400" />
                        <span
                          className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}
                        >
                          {session.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}
                  >
                    {session.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRTherapy;