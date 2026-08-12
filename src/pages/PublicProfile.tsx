import { useQuery } from "@tanstack/react-query";
import { useParams, Navigate } from "react-router-dom";
import { getPublicProfile } from "@/features/userprofile/api";
import { Loader2 } from "lucide-react";
import { ProfileHero } from "@/features/userprofile/sections/ProfileHero";
import { QuickStats } from "@/features/userprofile/sections/QuickStats";
import { OverviewTab } from "@/features/userprofile/sections/tabs/OverviewTab";
import { SkillsTab } from "@/features/userprofile/sections/tabs/SkillsTab";
import { ProjectsTab } from "@/features/userprofile/sections/tabs/ProjectsTab";
import { AchievementsTab } from "@/features/userprofile/sections/tabs/AchievementsTab";

export function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["publicProfile", userId],
    queryFn: () => getPublicProfile(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <h2 className="text-2xl font-bold text-destructive mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground">This profile may be private, deleted, or does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
      <div className="space-y-8">
        <ProfileHero profile={profile} isOwnProfile={false} />
        <QuickStats profile={profile} />

        <div className="space-y-8 pt-6">
          <section>
            <h3 className="text-2xl font-bold mb-4 px-1">Overview</h3>
            <OverviewTab profile={profile} />
          </section>
          
          <section>
            <h3 className="text-2xl font-bold mb-4 px-1">Skills</h3>
            <SkillsTab profile={profile} isOwnProfile={false} />
          </section>
          
          <section>
            <h3 className="text-2xl font-bold mb-4 px-1">Projects</h3>
            <ProjectsTab profile={profile} isOwnProfile={false} />
          </section>
          
          <section>
            <h3 className="text-2xl font-bold mb-4 px-1">Achievements</h3>
            <AchievementsTab profile={profile} isOwnProfile={false} />
          </section>
        </div>
      </div>
    </div>
  );
}
