
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, Play, Pause, SkipForward, Clock, Volume2 } from "lucide-react";

export function RelaxationGuidance() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const meditationSessions = [
    {
      id: 1,
      title: "Deep Breathing Meditation",
      duration: "10 minutes",
      description: "A guided meditation focusing on deep breathing to reduce anxiety and stress.",
      intensity: "Beginner",
    },
    {
      id: 2,
      title: "Progressive Muscle Relaxation",
      duration: "15 minutes",
      description: "Learn to tense and relax different muscle groups to release physical tension.",
      intensity: "Intermediate",
    },
    {
      id: 3,
      title: "Mindfulness Meditation",
      duration: "20 minutes",
      description: "Practice being present in the moment and observing thoughts without judgment.",
      intensity: "All Levels",
    },
    {
      id: 4,
      title: "Sleep Meditation",
      duration: "30 minutes",
      description: "A gentle meditation designed to help you fall asleep more easily.",
      intensity: "All Levels",
    },
  ];

  const featuredMeditation = {
    title: "Guided Relaxation Journey",
    description: "Experience deep relaxation with this AI-guided meditation focusing on releasing tension and finding inner calm.",
    duration: "15:00",
    progress: "03:45",
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[#2D1E45] via-[#4A3768] to-[#7B5BA8] border-white/10 shadow-lg hover:bg-[#4A3768] transition-all duration-300 rounded-3xl transform hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-[#E3C2FF] mb-2 drop-shadow-lg">
                {featuredMeditation.title}
              </h3>
              <p className="text-[#C9A6F0] mb-4 leading-relaxed">{featuredMeditation.description}</p>
              
              <div className="flex items-center space-x-2 text-[#9B7ED1] mb-6">
                <Clock className="h-4 w-4" />
                <span>{featuredMeditation.duration}</span>
              </div>
              
              <div className="w-full bg-[#2D1E45] rounded-full h-1.5 mb-6">
                <div className="bg-[#7B5BA8] h-1.5 rounded-full w-1/4"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#9B7ED1]">{featuredMeditation.progress}</span>
                <span className="text-[#9B7ED1]">{featuredMeditation.duration}</span>
              </div>
              
              <div className="flex items-center justify-center mt-6 space-x-4">
                <Button variant="outline" size="icon" className="rounded-full border-[#7B5BA8]/30 text-[#E3C2FF] hover:bg-[#4A3768]/50">
                  <SkipForward className="h-5 w-5 rotate-180" />
                </Button>
                
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-14 w-14 rounded-full bg-[#7B5BA8] hover:bg-[#9B7ED1] transition-colors duration-300"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 ml-1 text-white" />
                  )}
                </Button>
                
                <Button variant="outline" size="icon" className="rounded-full border-[#7B5BA8]/30 text-[#E3C2FF] hover:bg-[#4A3768]/50">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40 rounded-full bg-[#7B5BA8]/20 flex items-center justify-center">
                <div className="absolute h-32 w-32 rounded-full bg-[#9B7ED1]/30 animate-pulse"></div>
                <div className="absolute h-24 w-24 rounded-full bg-[#E3C2FF]/20"></div>
                <Headphones className="h-12 w-12 text-[#E3C2FF] z-10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold text-white mt-6 mb-4">Recommended Sessions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meditationSessions.map((session) => (
          <Card key={session.id} className="bg-gradient-to-br from-[#2D1E45]/90 via-[#4A3768]/90 to-[#7B5BA8]/90 border-white/10 shadow-lg hover:bg-[#4A3768] transition-all duration-300 rounded-xl transform hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-[#E3C2FF] drop-shadow-lg">
                    {session.title}
                  </h4>
                  <p className="text-[#C9A6F0] text-sm mt-1 leading-relaxed">
                    {session.description}
                  </p>
                  <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center space-x-1 text-[#9B7ED1]">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="text-[#9B7ED1] text-sm px-2 py-0.5 rounded bg-[#4A3768]/30">
                      {session.intensity}
                    </div>
                  </div>
                </div>
                <Button size="icon" className="rounded-full bg-[#7B5BA8] hover:bg-[#9B7ED1] transition-colors duration-300">
                  <Play className="h-4 w-4 ml-0.5 text-white" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
