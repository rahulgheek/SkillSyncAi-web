import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import {
  WireframeConsole,
  StaggeredShowcaseSection,
  MissionImpactSection,
  HackathonImpactSection,
  LandingFooter,
} from "@/components/landing/wireframe";

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#E8DAC8] via-[#E0CFB9] to-[#D7C3AA] text-[#4A121A] overflow-x-hidden">
      {/* Decorative ambient background accents in warm palette colors */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 -left-24 sm:-top-32 sm:-left-32 w-72 sm:w-96 md:w-120 h-72 sm:h-96 md:h-120 rounded-full bg-[#4A121A] opacity-15 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#A75D43] opacity-12 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-[#8A5A62] opacity-10 blur-3xl -z-10"
      />

      {/* 1. Hero Section: Wireframe Console Window (Fullscreen) */}
      <section className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <WireframeConsole />
      </section>

      {/* 2. Scroll Section: Frameless Staggered Showcase */}
      <StaggeredShowcaseSection className="py-16 sm:py-24" />

      {/* 3. Further Scroll Section: Mission Statement & 4 Pillar Cards */}
      <MissionImpactSection className="py-16 sm:py-24" />

      {/* 4. Deep Scroll Section: The True Impact of Hackathons (3 Metric Cards) */}
      <HackathonImpactSection className="pb-16 sm:pb-24" />

      {/* 5. Scoped Landing Footer */}
      <LandingFooter />
    </div>
  );
}
