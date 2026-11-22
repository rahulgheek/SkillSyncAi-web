import { Link, Navigate } from "react-router-dom";
import { Compass, PlusLg } from "react-bootstrap-icons";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { EnrolledProjects } from "@/features/dashboard/components/EnrolledProjects";
import { CreatedProjects } from "@/features/dashboard/components/CreatedProjects";
import { DashboardRail } from "@/features/dashboard/components/DashboardRail";
import { getFirstName, getProfileCompletion } from "@/features/dashboard/utils";

export function Dashboard() {
  const {
    profile,
    isProfileLoading,
    isProfileError,
    ownedProjects,
    enrolledProjects,
    pendingApplications,
    pendingInvitations,
    deadlines,
    isLoadingProjects,
    isLoadingMemberships,
  } = useDashboardData();

  if (isProfileLoading) {
    return (
      <div className="dash-page">
        <div className="dash-page-loader" role="status" aria-label="Loading dashboard">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Opening your workspace</span>
        </div>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return <Navigate to="/onboarding" replace />;
  }

  const firstName = getFirstName(profile.fullName);
  const completion = getProfileCompletion(profile);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">{today}</p>
          <h1 className="dash-title">
            Welcome back, <em>{firstName}.</em>
          </h1>
          <p className="dash-sub">
            Your teams, your builds, and the next thing worth making, all in one
            place.
          </p>
        </div>

        <div className="dash-head-actions">
          <Link to="/discover" className="dash-btn dash-btn-ghost">
            <Compass size={12} aria-hidden="true" />
            Discover
          </Link>
          <Link to="/projects/new" className="dash-btn dash-btn-solid">
            <PlusLg size={12} aria-hidden="true" />
            New project
          </Link>
        </div>
      </header>

      <div className="dash-grid">
        <div className="dash-main">
          <DashboardHero
            firstName={firstName}
            enrolledCount={enrolledProjects.length}
            pendingInvitations={pendingInvitations}
          />

          <DashboardStats
            enrolledCount={enrolledProjects.length}
            createdCount={ownedProjects.length}
            pendingApplications={pendingApplications}
            pendingInvitations={pendingInvitations}
          />

          <EnrolledProjects
            projects={enrolledProjects}
            isLoading={isLoadingMemberships}
          />

          <CreatedProjects
            projects={ownedProjects}
            isLoading={isLoadingProjects}
          />
        </div>

        <DashboardRail
          profile={profile}
          completion={completion}
          deadlines={deadlines}
        />
      </div>
    </div>
  );
}
