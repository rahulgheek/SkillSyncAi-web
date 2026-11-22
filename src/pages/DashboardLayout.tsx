import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context";
import { getMyProfile } from "@/features/userprofile/api";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import "@/features/dashboard/dashboard.css";
import "@/features/dashboard/pages.css";

export function DashboardLayout() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate(`/login?redirect=${location.pathname}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="dash-boot">
        <span className="dash-spinner" aria-hidden="true" />
        <span>Opening SkillSync</span>
      </div>
    );
  }

  const handleSignOut = () => {
    setMobileNavOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <DashboardSidebar profile={profile} onSignOut={handleSignOut} />
      </aside>

      <div className="dash-shell-main">
        <DashboardHeader
          profile={profile}
          onOpenNav={() => setMobileNavOpen(true)}
          onSignOut={handleSignOut}
        />

        <main className="dash-surface">
          <Outlet />
        </main>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="dash-sheet">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Move between your workspace, projects, profile and account tools.
          </SheetDescription>
          <DashboardSidebar
            profile={profile}
            onSignOut={handleSignOut}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
