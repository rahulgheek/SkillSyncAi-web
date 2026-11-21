import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import {
  WireframeConsole,
  StaggeredShowcaseSection,
  MissionImpactSection,
  HackathonImpactSection,
} from "@/components/landing/wireframe";

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative w-full min-h-screen bg-linear-to-br from-neutral-600 via-[#e2e2e5] to-[#d8d8dc] overflow-x-hidden">
      {/* Decorative dark background curve in top-left as seen in mockup */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 -left-24 sm:-top-32 sm:-left-32 w-72 sm:w-96 md:w-120 h-72 sm:h-96 md:h-120 rounded-full bg-rose-950 opacity-95 blur-[1px] -z-10"
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
      <HackathonImpactSection className="pb-24 sm:pb-36" />
    </div>
  );
}
