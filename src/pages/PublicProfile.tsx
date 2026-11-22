import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PersonX } from "react-bootstrap-icons";
import { getPublicProfile } from "@/features/userprofile/api";
import { ProfileHero } from "@/features/userprofile/sections/ProfileHero";
import { QuickStats } from "@/features/userprofile/sections/QuickStats";
import { OverviewTab } from "@/features/userprofile/sections/tabs/OverviewTab";
import { SkillsTab } from "@/features/userprofile/sections/tabs/SkillsTab";
import { ProjectsTab } from "@/features/userprofile/sections/tabs/ProjectsTab";
import { AchievementsTab } from "@/features/userprofile/sections/tabs/AchievementsTab";

export function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["publicProfile", userId],
    queryFn: () => getPublicProfile(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="dash-page">
        <div className="dash-page-loader" role="status" aria-label="Loading profile">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Loading profile</span>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="dash-page">
        <div className="dash-empty-inline dash-panel" style={{ minHeight: 320 }}>
          <PersonX size={26} color="#8f8d6e" aria-hidden="true" />
          <h4>Profile not found</h4>
          <p>This profile may be private, deleted, or does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Public profile</p>
          <h1 className="dash-title">
            A builder&rsquo;s <em>record.</em>
          </h1>
          <p className="dash-sub">
            Skills, shipped work, and the moments that shaped them.
          </p>
        </div>
      </header>

      <ProfileHero profile={profile} isOwnProfile={false} />
      <QuickStats profile={profile} />

      <OverviewTab profile={profile} />

      <section className="dash-panel">
        <div className="dash-panel-head">
          <div className="dash-panel-heading">
            <p className="dash-panel-kicker">What they work with</p>
            <h2 className="dash-panel-title">Skills</h2>
          </div>
        </div>
        <div className="dash-panel-body">
          <SkillsTab profile={profile} isOwnProfile={false} />
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <div className="dash-panel-heading">
            <p className="dash-panel-kicker">Built before</p>
            <h2 className="dash-panel-title">Projects</h2>
          </div>
        </div>
        <div className="dash-panel-body">
          <ProjectsTab profile={profile} isOwnProfile={false} />
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <div className="dash-panel-heading">
            <p className="dash-panel-kicker">Recognized for</p>
            <h2 className="dash-panel-title">Achievements</h2>
          </div>
        </div>
        <div className="dash-panel-body">
          <AchievementsTab profile={profile} isOwnProfile={false} />
        </div>
      </section>
    </div>
  );
}
