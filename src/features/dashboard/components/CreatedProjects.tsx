import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Folder2Open, PlusLg } from "react-bootstrap-icons";
import type { ProjectResponse } from "@/features/projects/api";
import { formatDeadline, formatProjectStatus, getStatusTone } from "../utils";

interface CreatedProjectsProps {
  projects: ProjectResponse[];
  isLoading: boolean;
}

function TableSkeleton() {
  return (
    <div className="dash-table-scroll" aria-hidden="true">
      <div className="dash-table-skeleton">
        {[0, 1, 2].map((row) => (
          <div className="dash-table-skeleton-row" key={row}>
            <div className="dash-skeleton dash-skeleton-title" />
            <div className="dash-skeleton dash-skeleton-chip" />
            <div className="dash-skeleton dash-skeleton-line dash-skeleton-line-short" />
            <div className="dash-skeleton dash-skeleton-line dash-skeleton-line-short" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreatedProjects({ projects, isLoading }: CreatedProjectsProps) {
  return (
    <section className="dash-section" aria-labelledby="dash-created-title">
      <div className="dash-section-head">
        <div>
          <p className="dash-section-kicker">Your builds</p>
          <h2 className="dash-section-title" id="dash-created-title">
            Projects you created
          </h2>
        </div>
        <Link to="/projects" className="dash-section-link">
          View all
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>

      <div className="dash-table-card">
        <div
          className="dash-scroll-area dash-created-scroll"
          role="region"
          tabIndex={0}
          aria-label="Projects you created list"
        >
          {isLoading ? (
            <TableSkeleton />
          ) : projects.length === 0 ? (
            <div className="dash-empty dash-empty-compact">
              <span className="dash-empty-icon">
                <Folder2Open size={19} aria-hidden="true" />
              </span>
              <h3>No projects yet</h3>
              <p>
                Start with a title, a deadline and the roles you need. You can
                publish when the team is ready.
              </p>
              <Link to="/projects/new" className="dash-btn dash-btn-solid">
                <PlusLg size={12} aria-hidden="true" />
                Create a project
              </Link>
            </div>
          ) : (
            <div className="dash-table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="dash-table-team-col">Team</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">
                      <span className="sr-only">Open project</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const deadline = formatDeadline(project.applicationDeadline);
                    const skillCount = project.requiredSkills?.length ?? 0;

                    return (
                      <tr key={project.id}>
                        <td>
                          <Link
                            to={`/projects/${project.id}`}
                            className="dash-table-project"
                          >
                            <span className="dash-table-title">{project.title}</span>
                            <span className="dash-table-sub">
                              {skillCount > 0
                                ? `${skillCount} required ${skillCount === 1 ? "skill" : "skills"}`
                                : "No skills listed"}
                            </span>
                          </Link>
                        </td>
                        <td>
                          <span
                            className={`dash-chip dash-chip-${getStatusTone(project.status)}`}
                          >
                            {formatProjectStatus(project.status)}
                          </span>
                        </td>
                        <td className="dash-table-team-col">
                          <span className="dash-table-muted">
                            Up to {project.maxTeamSize}
                          </span>
                        </td>
                        <td>
                          <span className="dash-table-muted">{deadline.label}</span>
                        </td>
                        <td>
                          <Link
                            to={`/projects/${project.id}`}
                            className="dash-table-open"
                            aria-label={`Open ${project.title}`}
                          >
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
