
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  UserPlus, 
  Search, 
  Calendar, 
  Smile, 
  Star
} from "lucide-react";

export function CommunitySection() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const discussionTopics = [
    {
      id: 1,
      title: "Coping with Anxiety During Pandemic",
      author: "Jessica K.",
      authorType: "Patient",
      avatar: "J",
      replies: 24,
      likes: 18,
      tags: ["anxiety", "coping"],
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      title: "Meditation Techniques for Beginners",
      author: "Dr. Michael Chen",
      authorType: "Therapist",
      avatar: "M",
      replies: 42,
      likes: 35,
      tags: ["meditation", "beginners"],
      lastActive: "5 hours ago",
    },
    {
      id: 3,
      title: "Building Better Sleep Habits",
      author: "Thomas H.",
      authorType: "Patient",
      avatar: "T",
      replies: 16,
      likes: 12,
      tags: ["sleep", "habits"],
      lastActive: "Yesterday",
    },
    {
      id: 4,
      title: "Tools for Managing Social Anxiety",
      author: "Dr. Sarah Johnson",
      authorType: "Therapist",
      avatar: "S",
      replies: 31,
      likes: 27,
      tags: ["social", "anxiety"],
      lastActive: "2 days ago",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Group Therapy: Anxiety Management",
      date: "April 30, 2025",
      time: "6:00 PM - 7:30 PM",
      host: "Dr. Rebecca Lee",
      participants: 8,
      maxParticipants: 12,
    },
    {
      id: 2,
      title: "Wellness Workshop: Mindfulness Practice",
      date: "May 5, 2025",
      time: "5:30 PM - 7:00 PM",
      host: "Dr. James Wilson",
      participants: 15,
      maxParticipants: 20,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Community Discussion</h3>
          <p className="text-gray-400">Connect with others on their mental health journey</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button className="bg-violet hover:bg-violet/90 text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {["all", "anxiety", "depression", "meditation", "sleep", "stress"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            className={activeFilter === filter 
              ? "bg-violet hover:bg-violet/90 text-white" 
              : "border-white/20 text-white hover:bg-white/10"
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {discussionTopics.map((topic) => (
          <Card key={topic.id} className="bg-gradient-to-br from-[#554177]/90 via-[#7B5BA8]/90 to-[#9B7ED1]/90 border-white/10 shadow-lg hover:bg-[#4A3768] transition-all duration-300 rounded-xl transform hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-violet-light flex items-center justify-center text-violet font-semibold">
                  {topic.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-medium text-white">
                      {topic.title}
                    </h4>
                    <span className="text-xs text-gray-400">{topic.lastActive}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 mb-3">
                    <span className="text-sm text-gray-300">{topic.author}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      topic.authorType === "Therapist" 
                        ? "bg-teal/20 text-teal" 
                        : "bg-violet/20 text-violet"
                    }`}>
                      {topic.authorType}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topic.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MessageSquare className="h-4 w-4" />
                      <span>{topic.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Heart className="h-4 w-4" />
                      <span>{topic.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Upcoming Community Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="bg-gradient-to-br from-[#554177]/90 via-[#7B5BA8]/90 to-[#9B7ED1]/90 border-white/10 shadow-lg hover:bg-[#4A3768] transition-all duration-300 rounded-xl transform hover:scale-[1.02]">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-violet-light p-3">
                    <Calendar className="h-6 w-6 text-violet" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white">{event.title}</h4>
                    <p className="text-gray-300 mt-1">{event.date} • {event.time}</p>
                    <p className="text-gray-400 mt-1">Hosted by {event.host}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i} 
                              className="h-6 w-6 rounded-full bg-violet-light flex items-center justify-center text-violet text-xs ring-2 ring-black"
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-400 text-sm">
                          {event.participants}/{event.maxParticipants} participants
                        </span>
                      </div>
                      
                      <Button size="sm" className="bg-violet hover:bg-violet/90">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Card className="bg-gradient-to-br from-[#554177] via-[#7B5BA8] to-[#9B7ED1] border-white/10 shadow-lg hover:bg-[#4A3768] transition-all duration-300 rounded-3xl mt-6 transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-[#E3C2FF] flex items-center">
            <Users className="h-5 w-5 mr-2 text-violet" />
            Recommended Support Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Anxiety Support", members: 245, rating: 4.8 },
              { name: "Mindfulness Practice", members: 178, rating: 4.7 },
              { name: "Stress Management", members: 312, rating: 4.9 }
            ].map((group, index) => (
              <div key={index} className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:bg-white/15">
                <h4 className="text-[#E3C2FF] font-medium mb-2">{group.name}</h4>
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-400 text-sm">{group.members} members</span>
                </div>
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-gray-600 text-sm">{group.rating}/5</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20 text-[#E3C2FF] hover:bg-[#4A3768] w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
