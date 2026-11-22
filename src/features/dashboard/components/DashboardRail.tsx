import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar3 } from "react-bootstrap-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileResponse } from "@/features/userprofile/schemas";
import {
  getInitials,
  type DeadlineEntry,
  type ProfileCompletion,
} from "../utils";

interface DashboardRailProps {
  profile: ProfileResponse;
  completion: ProfileCompletion;
  deadlines: DeadlineEntry[];
}

function ProfileCard({
  profile,
  completion,
}: {
  profile: ProfileResponse;
  completion: ProfileCompletion;
}) {
  const role = [profile.major, profile.graduationYear ? `Class of ${profile.graduationYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="dash-rail-card dash-profile-card" aria-labelledby="dash-rail-profile-title">
      <div className="dash-profile-cover" aria-hidden="true" />

      <div className="dash-profile-body">
        <Avatar className="dash-rail-avatar">
          {profile.profilePictureUrl ? (
            <AvatarImage src={profile.profilePictureUrl} alt={profile.fullName} />
          ) : null}
          <AvatarFallback className="dash-avatar-fallback">
            {getInitials(profile.fullName)}
          </AvatarFallback>
        </Avatar>

        <h3 className="dash-profile-name" id="dash-rail-profile-title">
          {profile.fullName}
        </h3>
        <p className="dash-profile-role">{role || "Student builder"}</p>

        <div className="dash-completion">
          <div className="dash-completion-row">
            <span>Profile strength</span>
            <strong>{completion.percent}%</strong>
          </div>
          <div className="dash-progress">
            <span style={{ width: `${completion.percent}%` }} />
          </div>
          <p>
            {completion.nextStep
              ? `${completion.nextStep} to finish your profile.`
              : "Your profile is ready for new teammates."}
          </p>
        </div>

        <div className="dash-profile-metrics">
          <div className="dash-profile-metric">
            <strong>{profile.skills?.length ?? 0}</strong>
            <span>Skills</span>
          </div>
          <div className="dash-profile-metric">
            <strong>{profile.projects?.length ?? 0}</strong>
            <span>Projects</span>
          </div>
          <div className="dash-profile-metric">
            <strong>{profile.stats?.connections ?? 0}</strong>
            <span>Links</span>
          </div>
        </div>

        <Link to="/profile" className="dash-btn dash-btn-solid dash-btn-full">
          Open profile
          <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function DeadlinesCard({ deadlines }: { deadlines: DeadlineEntry[] }) {
  return (
    <section
      className="dash-rail-card dash-deadlines-card"
      aria-labelledby="dash-deadlines-title"
    >
      <div className="dash-rail-head">
        <h3 className="dash-rail-title" id="dash-deadlines-title">
          Upcoming deadlines
        </h3>
        <Calendar3 size={13} aria-hidden="true" />
      </div>

      {deadlines.length === 0 ? (
        <p className="dash-rail-empty">
          Nothing due yet. Join a team or set a deadline on your next project.
        </p>
      ) : (
        <ul className="dash-deadline-list">
          {deadlines.map((deadline) => (
            <li key={deadline.id}>
              <Link to={`/projects/${deadline.id}`} className="dash-deadline-item">
                <span className="dash-date-chip" aria-hidden="true">
                  <span>{deadline.month}</span>
                  <span>{deadline.day}</span>
                </span>
                <span className="dash-deadline-copy">
                  <span className="dash-deadline-title">{deadline.title}</span>
                  <span className="dash-deadline-kind">
                    {deadline.kind === "owned" ? "Your project" : "Team project"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/projects" className="dash-deadline-footer">
        <span>View all projects</span>
        <ArrowRight size={11} aria-hidden="true" />
      </Link>
    </section>
  );
}

export function DashboardRail({ profile, completion, deadlines }: DashboardRailProps) {
  return (
    <aside className="dash-rail" aria-label="Profile and upcoming deadlines">
      <ProfileCard profile={profile} completion={completion} />
      <DeadlinesCard deadlines={deadlines} />
    </aside>
  );
}
