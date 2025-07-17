
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { AreaChart, Area } from "recharts";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Session } from "@/lib/api";

export function TherapySessionAnalytics() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // For demo purposes, using user ID 1
        const userSessions = await api.getUserSessions(1);
        setSessions(userSessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div className="text-white">Loading sessions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Analytics data based on sessions
  const emotionData = [
    { name: "Anxiety", value: 65, color: "#FFA500" },
    { name: "Depression", value: 40, color: "#6E59A5" },
    { name: "Stress", value: 70, color: "#FF6B6B" },
    { name: "Calmness", value: 30, color: "#4CAF50" },
    { name: "Happiness", value: 25, color: "#FFD700" },
  ];

  const progressData = [
    { week: "Week 1", score: 25 },
    { week: "Week 2", score: 30 },
    { week: "Week 3", score: 40 },
    { week: "Week 4", score: 35 },
    { week: "Week 5", score: 45 },
    { week: "Week 6", score: 55 },
    { week: "Week 7", score: 60 },
    { week: "Week 8", score: 70 },
  ];

  const sessionHistory = [
    {
      date: "April 28, 2025",
      therapist: "Dr. Sarah Johnson",
      duration: "45 minutes",
      focus: "Anxiety management",
      progress: "Good",
    },
    {
      date: "April 21, 2025",
      therapist: "Dr. Sarah Johnson",
      duration: "50 minutes",
      focus: "Coping mechanisms",
      progress: "Moderate",
    },
    {
      date: "April 14, 2025",
      therapist: "Dr. Sarah Johnson",
      duration: "45 minutes",
      focus: "Stress reduction",
      progress: "Excellent",
    },
  ];

  const sessionInsights = [
    "Your anxiety levels have decreased by 15% over the last 3 sessions",
    "You've been consistently practicing mindfulness exercises",
    "Your communication skills have shown significant improvement",
    "Consider focusing more on sleep hygiene in upcoming sessions",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Emotional Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ChartContainer config={{}} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionData} layout="vertical">
                    <XAxis type="number" tick={{ fill: "#9b87f5" }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#9b87f5" }}
                      width={80}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent>
                              <div className="flex flex-col">
                                <span className="text-foreground">{payload[0].payload.name}</span>
                                <span className="font-bold text-foreground">{payload[0].value}%</span>
                              </div>
                            </ChartTooltipContent>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Therapy Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ChartContainer config={{}} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <XAxis dataKey="week" tick={{ fill: "#9b87f5" }} />
                    <YAxis tick={{ fill: "#9b87f5" }} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent>
                              <div className="flex flex-col">
                                <span className="text-foreground">{payload[0].payload.week}</span>
                                <span className="font-bold text-foreground">Score: {payload[0].value}</span>
                              </div>
                            </ChartTooltipContent>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#9b87f5"
                      fill="#9b87f5"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Session History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableHead className="text-violet">Date</TableHead>
                  <TableHead className="text-violet">Therapist</TableHead>
                  <TableHead className="text-violet">Focus</TableHead>
                  <TableHead className="text-violet">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionHistory.map((session, index) => (
                  <TableRow key={index} className="hover:bg-white/5 border-white/10">
                    <TableCell className="text-white">{session.date}</TableCell>
                    <TableCell className="text-gray-300">{session.therapist}</TableCell>
                    <TableCell className="text-gray-300">{session.focus}</TableCell>
                    <TableCell className="text-gray-300">{session.progress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Session Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {sessionInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 h-2 w-2 mt-2 rounded-full bg-violet"></div>
                  <p className="text-gray-300">{insight}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
