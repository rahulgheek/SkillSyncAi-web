import { Link } from "react-router-dom";
import { ArrowRight, People } from "react-bootstrap-icons";

interface DashboardHeroProps {
  firstName: string;
  enrolledCount: number;
  pendingInvitations: number;
}

export function DashboardHero({
  firstName,
  enrolledCount,
  pendingInvitations,
}: DashboardHeroProps) {
  return (
    <section className="dash-hero" aria-labelledby="dash-hero-title">
      <div className="dash-hero-scene" aria-hidden="true">
        <span className="dash-hero-sun" />
        <span className="dash-hero-orbit dash-hero-orbit-a" />
        <span className="dash-hero-orbit dash-hero-orbit-b" />
        <span className="dash-hero-ridge dash-hero-ridge-a" />
        <span className="dash-hero-ridge dash-hero-ridge-b" />
      </div>

      <div className="dash-hero-copy">
        <p className="dash-hero-kicker">The builder&rsquo;s desk</p>
        <h2 className="dash-hero-title" id="dash-hero-title">
          Make something <em>worth showing.</em>
        </h2>
        <p className="dash-hero-text">
          {firstName}, find a team, shape a fresh idea, or take your own project
          from first sketch to final demo.
        </p>

        <div className="dash-hero-actions">
          <Link to="/discover" className="dash-btn dash-btn-cream">
            <span>Explore projects</span>
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
          <Link to="/projects/new" className="dash-btn dash-btn-ghost-light">
            Start a project
          </Link>
        </div>
      </div>

      <div className="dash-hero-note">
        <span className="dash-hero-note-label">At a glance</span>
        <div className="dash-hero-note-row">
          <strong>{enrolledCount}</strong>
          <span>teams joined</span>
        </div>
        <div className="dash-hero-note-row">
          <strong>{pendingInvitations}</strong>
          <span>invites waiting</span>
        </div>
        <span className="dash-hero-note-foot">
          <People size={11} aria-hidden="true" />
          Built for student teams
        </span>
      </div>
    </section>
  );
}
