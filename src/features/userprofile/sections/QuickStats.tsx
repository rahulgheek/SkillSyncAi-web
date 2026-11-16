import { ProfileResponse } from "../schemas";
import { Code2, Trophy, Users, Eye } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-4 sm:p-6 flex items-center gap-3 sm:gap-5 shadow-lg shadow-gray-200/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group min-w-0">
          <div className="p-3 sm:p-4 shrink-0 bg-primary/10 rounded-2xl text-primary shadow-inner group-hover:scale-110 transition-transform duration-300">
            <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
