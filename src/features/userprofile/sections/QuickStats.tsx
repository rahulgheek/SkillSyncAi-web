import type { Icon } from "react-bootstrap-icons";
import { Eye, People, Tools, Trophy } from "react-bootstrap-icons";
import { ProfileResponse } from "../schemas";

type StatTone = "olive" | "terracotta" | "sky" | "ink";

export function QuickStats({ profile }: { profile: ProfileResponse }) {
  const stats: {
    label: string;
    value: number;
    hint: string;
    icon: Icon;
    tone: StatTone;
  }[] = [
    {
      label: "Skills verified",
      value: profile.skills?.length || 0,
      hint: "Craft you can prove",
      icon: Tools,
      tone: "olive",
    },
    {
      label: "Projects completed",
      value: profile.projects?.length || 0,
      hint: "Work in the world",
      icon: Trophy,
      tone: "terracotta",
    },
    {
      label: "Connections",
      value: profile.stats?.connections || 0,
      hint: "Builders you know",
      icon: People,
      tone: "sky",
    },
    {
      label: "Profile views",
      value: profile.stats?.profileViews || 0,
      hint: "People stopping by",
      icon: Eye,
      tone: "ink",
    },
  ];

  return (
    <div className="dash-stats">
      {stats.map((stat) => {
        const IconGlyph = stat.icon;
        return (
          <article className="dash-stat" key={stat.label}>
            <div className="dash-stat-top">
              <span className={`dash-stat-icon dash-tone-${stat.tone}`}>
                <IconGlyph size={14} aria-hidden="true" />
              </span>
              <span className="dash-stat-label">{stat.label}</span>
            </div>
            <strong className="dash-stat-value">{stat.value}</strong>
            <span className="dash-stat-hint">{stat.hint}</span>
          </article>
        );
      })}
    </div>
  );
}
