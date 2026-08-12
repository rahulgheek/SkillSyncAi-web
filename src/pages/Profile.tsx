import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getMyProfile } from "@/features/userprofile/api";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHero } from "@/features/userprofile/sections/ProfileHero";
import { QuickStats } from "@/features/userprofile/sections/QuickStats";
import { OverviewTab } from "@/features/userprofile/sections/tabs/OverviewTab";
import { SkillsTab } from "@/features/userprofile/sections/tabs/SkillsTab";
import { ProjectsTab } from "@/features/userprofile/sections/tabs/ProjectsTab";
import { AchievementsTab } from "@/features/userprofile/sections/tabs/AchievementsTab";
import { AiInsightsTab } from "@/features/userprofile/sections/tabs/AiInsightsTab";
import { ProfileCompletionTracker } from "@/features/userprofile/components/ProfileCompletionTracker";
import { FadeIn } from "@/components/ui/animated/FadeIn";

export function Profile() {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !profile) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen overflow-hidden">
      <div className="space-y-8">
        <FadeIn delay={0.1}>
          <ProfileHero profile={profile} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <QuickStats profile={profile} />
        </FadeIn>

        <div className="pt-8">
          <Tabs defaultValue="overview" className="w-full">
            <FadeIn delay={0.3} className="sticky top-0 z-40 bg-gray-50 pt-2 pb-6">
              <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b border-gray-200 rounded-none h-auto p-0 space-x-8 hide-scrollbar">
                {["overview", "skills", "projects", "achievements", "insights"].map(tab => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="capitalize bg-transparent border-b-[3px] border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-2 py-4 text-base font-bold text-muted-foreground hover:text-foreground data-[state=active]:text-primary transition-all"
                  >
                    {tab === "insights" ? "AI Insights" : tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </FadeIn>
            
            <div className="mt-8">
              <TabsContent value="overview" className="m-0 mt-2 focus-visible:outline-none animate-in slide-in-from-bottom-2 fade-in-50">
                <OverviewTab profile={profile} />
              </TabsContent>
              <TabsContent value="skills" className="m-0 mt-2 focus-visible:outline-none animate-in slide-in-from-bottom-2 fade-in-50">
                <SkillsTab profile={profile} />
              </TabsContent>
              <TabsContent value="projects" className="m-0 mt-2 focus-visible:outline-none animate-in slide-in-from-bottom-2 fade-in-50">
                <ProjectsTab profile={profile} />
              </TabsContent>
              <TabsContent value="achievements" className="m-0 mt-2 focus-visible:outline-none animate-in slide-in-from-bottom-2 fade-in-50">
                <AchievementsTab profile={profile} />
              </TabsContent>
              <TabsContent value="insights" className="m-0 mt-2 focus-visible:outline-none animate-in slide-in-from-bottom-2 fade-in-50">
                <AiInsightsTab profile={profile} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <ProfileCompletionTracker profile={profile} />
    </div>
  );
}
