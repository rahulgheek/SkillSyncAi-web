import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import {
  Folder2Open,
  PersonLinesFill,
  Stars,
  Tools,
  Trophy,
} from "react-bootstrap-icons";
import { getMyProfile } from "@/features/userprofile/api";
import { ProfileHero } from "@/features/userprofile/sections/ProfileHero";
import { QuickStats } from "@/features/userprofile/sections/QuickStats";
import { OverviewTab } from "@/features/userprofile/sections/tabs/OverviewTab";
import { SkillsTab } from "@/features/userprofile/sections/tabs/SkillsTab";
import { ProjectsTab } from "@/features/userprofile/sections/tabs/ProjectsTab";
import { AchievementsTab } from "@/features/userprofile/sections/tabs/AchievementsTab";
import { AiInsightsTab } from "@/features/userprofile/sections/tabs/AiInsightsTab";
import { ProfileCompletionTracker } from "@/features/userprofile/components/ProfileCompletionTracker";

type ProfileTab = "overview" | "skills" | "projects" | "achievements" | "insights";

export function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="dash-page">
        <div className="dash-page-loader" role="status" aria-label="Loading profile">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Opening your profile</span>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return <Navigate to="/onboarding" />;
  }

  const tabs: { id: ProfileTab; label: string; icon: typeof Stars; count?: number }[] = [
    { id: "overview", label: "Overview", icon: PersonLinesFill },
    { id: "skills", label: "Skills", icon: Tools, count: profile.skills?.length ?? 0 },
    { id: "projects", label: "Projects", icon: Folder2Open, count: profile.projects?.length ?? 0 },
    { id: "achievements", label: "Achievements", icon: Trophy, count: profile.achievements?.length ?? 0 },
    { id: "insights", label: "AI insights", icon: Stars },
  ];

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Your profile</p>
          <h1 className="dash-title">
            The person <em>behind the work.</em>
          </h1>
          <p className="dash-sub">
            Keep your story current so the right teams can find you.
          </p>
        </div>
      </header>

      <ProfileHero profile={profile} />
      <QuickStats profile={profile} />
      <ProfileCompletionTracker profile={profile} />

      <section className="dash-panel" aria-label="Profile details">
        <div className="dash-tabs" role="tablist">
          {tabs.map((tab) => {
            const IconGlyph = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`dash-tab${activeTab === tab.id ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconGlyph size={11} aria-hidden="true" />
                {tab.label}
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span className="dash-tab-count">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="dash-panel-body" role="tabpanel">
          {activeTab === "overview" && <OverviewTab profile={profile} />}
          {activeTab === "skills" && <SkillsTab profile={profile} />}
          {activeTab === "projects" && <ProjectsTab profile={profile} />}
          {activeTab === "achievements" && <AchievementsTab profile={profile} />}
          {activeTab === "insights" && <AiInsightsTab profile={profile} />}
        </div>
      </section>
    </div>
  );
}
