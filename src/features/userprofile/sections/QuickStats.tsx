import { ProfileResponse } from "../schemas";
import { Code2, Trophy, Users, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuickStats({ profile }: { profile: ProfileResponse }) {
  const stats = [
    {
      label: "Skills Verified",
      value: profile.skills?.length || 0,
      icon: Code2,
    },
    {
      label: "Projects Completed",
      value: profile.projects?.length || 0,
      icon: Trophy,
    },
    {
      label: "Connections",
      value: profile.stats?.connections || 42,
      icon: Users,
    },
    {
      label: "Profile Views",
      value: profile.stats?.profileViews || 128,
      icon: Eye,
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-border bg-card hover:border-gray-300 transition-colors shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-foreground">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
