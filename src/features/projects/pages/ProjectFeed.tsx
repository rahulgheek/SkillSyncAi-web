import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar3,
  People,
  Stars,
  SuitcaseLg,
} from "react-bootstrap-icons";
import { getRecruitingFeed } from "../api";
import ProjectDiscoveryModal from "../components/ProjectDiscoveryModal";
import {
  formatDeadline,
  formatProjectStatus,
  getStatusTone,
} from "@/features/dashboard/utils";

export default function ProjectFeed() {
  const navigate = useNavigate();
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recruitingFeed"],
    queryFn: () => getRecruitingFeed(0, 20),
  });

  if (isLoading) {
    return (
      <div className="dash-page">
        <div className="dash-page-loader" role="status" aria-label="Loading projects">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Finding open teams</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-page">
        <div className="dash-alert dash-alert-danger">
          Failed to load projects. Please try again later.
        </div>
      </div>
    );
  }

  const projects = page?.content || [];

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Discover</p>
          <h1 className="dash-title">
            Find a team <em>worth joining.</em>
          </h1>
          <p className="dash-sub">
            Browse hackathon projects that match your skills, or let AI point you
            at the best fits.
          </p>
        </div>
        <div className="dash-head-actions">
          <button
            type="button"
            className="dash-btn dash-btn-solid"
            onClick={() => setIsDiscoveryOpen(true)}
          >
            <Stars size={12} aria-hidden="true" />
            Discover with AI
          </button>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="dash-empty dash-panel">
          <span className="dash-empty-icon">
            <SuitcaseLg size={19} aria-hidden="true" />
          </span>
          <h3>No active projects found</h3>
          <p>Check back later for new opportunities and open teams.</p>
        </div>
      ) : (
        <div className="dash-project-grid">
          {projects.map((project) => {
            const deadline = formatDeadline(project.applicationDeadline);
            const skills = project.requiredSkills || [];

            return (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="dash-project-card"
              >
                <div className="dash-project-top">
                  <span
                    className={`dash-chip dash-chip-${getStatusTone(project.status)}`}
                  >
                    {formatProjectStatus(project.status)}
                  </span>
                  <ArrowUpRight
                    className="dash-project-arrow"
                    size={14}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="dash-project-title">{project.title}</h3>
                <p className="dash-project-desc">{project.description}</p>

                {skills.length > 0 && (
                  <div className="dash-skill-list">
                    {skills.slice(0, 3).map((skill) => (
                      <span className="dash-skill" key={skill.skillId}>
                        {skill.skillName}
                      </span>
                    ))}
                    {skills.length > 3 && (
                      <span className="dash-skill dash-skill-more">
                        +{skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="dash-project-foot" style={{ marginTop: "auto" }}>
                  <span className="dash-project-team">
                    <People size={10} aria-hidden="true" />
                    Up to {project.maxTeamSize}
                  </span>
                  <span className="dash-project-deadline" style={{ marginTop: 0 }}>
                    <Calendar3 size={10} aria-hidden="true" />
                    {deadline.label}
                  </span>
                </div>

                <div
                  className="dash-project-actions"
                  style={{ borderTopColor: "var(--dash-line-soft)" }}
                >
                  <span className="dash-section-link" style={{ padding: 0 }}>
                    View details & apply
                    <ArrowRight size={11} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="dash-inline" style={{ marginTop: 18 }}>
        <button
          type="button"
          className="dash-btn dash-btn-ghost dash-btn-sm"
          onClick={() => navigate("/projects")}
        >
          Go to my projects
          <ArrowRight size={11} aria-hidden="true" />
        </button>
      </div>

      {isDiscoveryOpen && (
        <ProjectDiscoveryModal
          isOpen={isDiscoveryOpen}
          onClose={() => setIsDiscoveryOpen(false)}
        />
      )}
    </div>
  );
}
