import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar3, People } from "react-bootstrap-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  formatDeadline,
  formatProjectStatus,
  getInitials,
  getStatusTone,
  type EnrolledProject,
} from "../utils";

interface EnrolledProjectsProps {
  projects: EnrolledProject[];
  isLoading: boolean;
}

function EnrolledProjectCard({ project }: { project: EnrolledProject }) {
  const teamCapacity =
    project.maxTeamSize > 0
      ? Math.min(100, Math.round((project.currentMemberCount / project.maxTeamSize) * 100))
      : 0;
  const visibleSkills = project.skills.slice(0, 3);
  const extraSkills = Math.max(0, project.skills.length - visibleSkills.length);
  const deadline = formatDeadline(project.applicationDeadline);

  return (
    <Link to={`/projects/${project.id}`} className="dash-project-card">
      <div className="dash-project-top">
        <span className={`dash-chip dash-chip-${getStatusTone(project.status)}`}>
          {formatProjectStatus(project.status)}
        </span>
        <ArrowUpRight className="dash-project-arrow" size={14} aria-hidden="true" />
      </div>

      <h3 className="dash-project-title">{project.title}</h3>
      <p className="dash-project-desc">
        {project.description || "The team has not added a description yet."}
      </p>

      {visibleSkills.length > 0 && (
        <div className="dash-skill-list">
          {visibleSkills.map((skill) => (
            <span className="dash-skill" key={skill}>
              {skill}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="dash-skill dash-skill-more">+{extraSkills}</span>
          )}
        </div>
      )}

      <div className="dash-project-progress" aria-hidden="true">
        <span style={{ width: `${teamCapacity}%` }} />
      </div>

      <div className="dash-project-foot">
        <span className="dash-project-owner">
          <Avatar className="dash-avatar dash-avatar-xs">
            {project.ownerPhoto ? (
              <AvatarImage src={project.ownerPhoto} alt="" />
            ) : null}
            <AvatarFallback className="dash-avatar-fallback">
              {getInitials(project.ownerName)}
            </AvatarFallback>
          </Avatar>
          <span>{project.ownerName}</span>
        </span>

        <span className="dash-project-team">
          <People size={10} aria-hidden="true" />
          {project.currentMemberCount}/{project.maxTeamSize}
        </span>
      </div>

      <div className="dash-project-deadline">
        <Calendar3 size={10} aria-hidden="true" />
        <span>Apply by {deadline.label}</span>
      </div>
    </Link>
  );
}

function ProjectSkeleton() {
  return (
    <div className="dash-project-card dash-project-skeleton" aria-hidden="true">
      <div className="dash-skeleton dash-skeleton-chip" />
      <div className="dash-skeleton dash-skeleton-title" />
      <div className="dash-skeleton dash-skeleton-line" />
      <div className="dash-skeleton dash-skeleton-line dash-skeleton-line-short" />
      <div className="dash-skeleton dash-skeleton-footer" />
    </div>
  );
}

export function EnrolledProjects({ projects, isLoading }: EnrolledProjectsProps) {
  return (
    <section className="dash-section" aria-labelledby="dash-enrolled-title">
      <div className="dash-section-head">
        <div>
          <p className="dash-section-kicker">Your teams</p>
          <h2 className="dash-section-title" id="dash-enrolled-title">
            Enrolled projects
          </h2>
        </div>
        <Link to="/discover" className="dash-section-link">
          Find more
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>

      <div
        className="dash-scroll-area dash-enrolled-scroll"
        role="region"
        tabIndex={0}
        aria-label="Enrolled projects list"
      >
        {isLoading ? (
          <div className="dash-project-grid">
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        ) : projects.length === 0 ? (
          <div className="dash-empty">
            <span className="dash-empty-icon">
              <People size={19} aria-hidden="true" />
            </span>
            <h3>No teams yet</h3>
            <p>
              When a project accepts you, it will land here with your teammates,
              skills and next deadline.
            </p>
            <Link to="/discover" className="dash-btn dash-btn-solid">
              Discover projects
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="dash-project-grid">
            {projects.map((project) => (
              <EnrolledProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
