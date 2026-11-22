import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "react-bootstrap-icons";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

const PROJECTS = [
  {
    title: "AI Health Assistant",
    role: "Looking for 2 Frontend Developers & 1 UI/UX Designer",
    tag: "AI / ML",
  },
  {
    title: "HackConnect Platform",
    role: "Looking for 1 Backend Engineer (Spring/Postgres)",
    tag: "Full-stack",
  },
  {
    title: "EcoTrack Mobile App",
    role: "Looking for React Native Dev & Mobile Lead",
    tag: "Mobile",
  },
  {
    title: "DevFlow Collaborative IDE",
    role: "Looking for Systems Dev & TypeScript Specialist",
    tag: "Tools",
  },
  {
    title: "Campus Hub Portal",
    role: "Looking for Product Designer & React Dev",
    tag: "Web",
  },
  {
    title: "Smart Study AI",
    role: "Looking for Data Engineer & Python Specialist",
    tag: "NLP",
  },
];

export function ExplorePage() {
  return (
    <PublicPageLayout>
      <header className="public-hero">
        <p className="dash-eyebrow">Explore</p>
        <h1 className="public-title">
          Projects looking for <em>their people.</em>
        </h1>
        <p className="public-copy">
          Discover student-led projects and complementary skill matches. Join a team
          or recruit collaborators for your next hackathon project.
        </p>
        <div className="public-actions">
          <Link to="/register" className="dash-btn dash-btn-solid">
            Join SkillSync
            <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
          <Link to="/about" className="dash-btn dash-btn-ghost">
            How it works
          </Link>
        </div>
      </header>

      <div className="public-grid">
        {PROJECTS.map((item) => (
          <article className="dash-project-card" key={item.title}>
            <div className="dash-project-top">
              <span className="dash-chip dash-chip-neutral">{item.tag}</span>
              <ArrowUpRight
                className="dash-project-arrow"
                size={14}
                aria-hidden="true"
              />
            </div>

            <h2 className="dash-project-title">{item.title}</h2>
            <p className="dash-project-desc">{item.role}</p>

            <div className="dash-project-foot" style={{ marginTop: "auto" }}>
              <span className="dash-section-link" style={{ padding: 0 }}>
                View project details
                <ArrowRight size={11} aria-hidden="true" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </PublicPageLayout>
  );
}
