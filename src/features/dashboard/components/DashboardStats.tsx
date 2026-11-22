import type { Icon } from "react-bootstrap-icons";
import {
  EnvelopeOpen,
  Folder2Open,
  People,
  Send,
} from "react-bootstrap-icons";

interface DashboardStatsProps {
  enrolledCount: number;
  createdCount: number;
  pendingApplications: number;
  pendingInvitations: number;
}

type StatTone = "olive" | "terracotta" | "sky" | "ink";

interface StatItem {
  label: string;
  value: number;
  hint: string;
  icon: Icon;
  tone: StatTone;
}

export function DashboardStats({
  enrolledCount,
  createdCount,
  pendingApplications,
  pendingInvitations,
}: DashboardStatsProps) {
  const stats: StatItem[] = [
    {
      label: "Enrolled teams",
      value: enrolledCount,
      hint: "Teams you are part of",
      icon: People,
      tone: "olive",
    },
    {
      label: "Projects created",
      value: createdCount,
      hint: "Builds you lead",
      icon: Folder2Open,
      tone: "terracotta",
    },
    {
      label: "Applications out",
      value: pendingApplications,
      hint: "Waiting for a reply",
      icon: Send,
      tone: "sky",
    },
    {
      label: "Invites waiting",
      value: pendingInvitations,
      hint: "Your move",
      icon: EnvelopeOpen,
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
