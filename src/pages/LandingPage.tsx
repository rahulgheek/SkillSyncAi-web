import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import {
  Hero,
  HowItWorks,
  WhyChoose,
  ImpactSection,
  Footer,
} from "@/components/landing";

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white text-foreground font-sans overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <WhyChoose />
      <ImpactSection />
      <Footer />
    </div>
  );
}
