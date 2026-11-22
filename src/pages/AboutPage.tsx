import { Link } from "react-router-dom";
import { ArrowUpRight, CompassFill, EyeFill, Stars } from "react-bootstrap-icons";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export function AboutPage() {
  return (
    <PublicPageLayout>
      <header className="public-hero" style={{ maxWidth: 840 }}>
        <p className="dash-eyebrow">About SkillSync</p>
        <h1 className="public-title">
          Built for the people who <em>make things.</em>
        </h1>
        <p className="public-copy">
          We believe assembling the perfect hackathon team should not be a game of
          chance. SkillSync analyzes student skills, aspirations, and complementary
          capabilities to help you connect and build the next big thing.
        </p>
        <div className="public-actions">
          <Link to="/register" className="dash-btn dash-btn-solid">
            Start building
            <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
          <Link to="/explore" className="dash-btn dash-btn-ghost">
            Explore projects
          </Link>
        </div>
      </header>

      <div className="public-story-grid">
        <section className="public-story">
          <span className="public-story-number">01</span>
          <h3>
            <CompassFill size={17} aria-hidden="true" /> Our mission
          </h3>
          <p>
            To empower students with intelligent matchmaking and seamless team
            assembly, eliminating friction and maximizing creative synergy at
            hackathons and collegiate projects worldwide.
          </p>
        </section>

        <section className="public-story is-warm">
          <span className="public-story-number">02</span>
          <h3>
            <EyeFill size={17} aria-hidden="true" /> Our vision
          </h3>
          <p>
            A collaborative student ecosystem where every ambitious idea finds the
            exact talent, complementary strengths, and dedicated teammates required
            to turn vision into reality.
          </p>
        </section>
      </div>

      <section
        className="public-panel"
        style={{ marginTop: 14, padding: "clamp(20px, 3vw, 30px)" }}
      >
        <div className="dash-spread" style={{ flexWrap: "wrap" }}>
          <div style={{ maxWidth: "60ch" }}>
            <p className="dash-eyebrow">What we value</p>
            <h2 className="dash-mini-title" style={{ fontSize: 20, marginTop: 6 }}>
              Good teams are built on <em>complementary strengths.</em>
            </h2>
            <p className="dash-mini-sub" style={{ marginTop: 6 }}>
              Clear intent, honest profiles, and a shared sense of momentum. That is
              the standard we design for.
            </p>
          </div>
          <span className="dash-badge dash-badge-ai">
            <Stars size={9} aria-hidden="true" />
            Human-first matching
          </span>
        </div>
      </section>
    </PublicPageLayout>
  );
}
