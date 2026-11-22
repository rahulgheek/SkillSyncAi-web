import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useAuth } from "@/features/auth/context";
import {
  WireframeConsole,
  StaggeredShowcaseSection,
  MissionImpactSection,
  HackathonImpactSection,
  LandingCtaSection,
  LandingFooter,
} from "@/components/landing/wireframe";
import "@/components/landing/wireframe/landing.css";

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const previousBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#ffffff";

    return () => {
      document.body.style.backgroundColor = previousBackground;
    };
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
        <main>
          <WireframeConsole />
          <StaggeredShowcaseSection />
          <MissionImpactSection />
          <HackathonImpactSection />
          <LandingCtaSection />
          <LandingFooter />
        </main>
      </div>
    </MotionConfig>
  );
}
