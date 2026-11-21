import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import { WireframeConsole } from "@/components/landing/wireframe";

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <WireframeConsole />;
}
