import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar3,
  Folder2Open,
  Inbox,
  PlusLg,
  Stars,
  Trash3,
  People,
} from "react-bootstrap-icons";
import { getMyProjects, deleteProject } from "@/features/projects/api";
import ProjectRecommendationsModal from "@/features/projects/components/ProjectRecommendationsModal";
import ManageApplicationsModal from "@/features/projects/components/ManageApplicationsModal";
import {
  formatDeadline,
  formatProjectStatus,
  getStatusTone,
} from "@/features/dashboard/utils";

export function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [manageProject, setManageProject] = useState<any>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: projectsPage, isLoading } = useQuery({
    queryKey: ["myProjects"],
    queryFn: () => getMyProjects(),
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
    onError: (err: any) => {
      console.error("Failed to delete project", err);
      alert(err.response?.data?.message || "Failed to delete project.");
    },
  });

  if (isLoading) {
    return (
      <div className="dash-page">
        <div className="dash-page-loader" role="status" aria-label="Loading projects">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Opening your studio</span>
        </div>
      </div>
    );
  }

  const projects = projectsPage?.content || [];

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Your studio</p>
          <h1 className="dash-title">
            The projects <em>you lead.</em>
          </h1>
          <p className="dash-sub">
            Manage published projects, review candidates, and let AI find the
            teammates who fit.
          </p>
        </div>
        <div className="dash-head-actions">
          <Link to="/projects/new" className="dash-btn dash-btn-solid">
            <PlusLg size={12} aria-hidden="true" />
            Create project
          </Link>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="dash-empty dash-panel">
          <span className="dash-empty-icon">
            <Folder2Open size={19} aria-hidden="true" />
          </span>
          <h3>No projects yet</h3>
          <p>
            Create your first project to start recruiting a team. You can define
            roles, required skills, and a deadline.
          </p>
          <Link to="/projects/new" className="dash-btn dash-btn-solid">
            <PlusLg size={12} aria-hidden="true" />
            Create project
          </Link>
        </div>
      ) : (
        <div className="dash-project-grid">
          {projects.map((project: any) => {
            const deadline = formatDeadline(project.applicationDeadline);
            const skills = project.requiredSkills || [];

            return (
              <article className="dash-project-card" key={project.id}>
                <button
                  type="button"
                  className="dash-project-danger"
                  aria-label={`Delete ${project.title}`}
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to permanently delete this project?")
                    ) {
                      deleteMutation.mutate(project.id);
                    }
                  }}
                >
                  <Trash3 size={12} aria-hidden="true" />
                </button>

                <div className="dash-project-top" style={{ paddingRight: 28 }}>
                  <span
                    className={`dash-chip dash-chip-${getStatusTone(project.status)}`}
                  >
                    {formatProjectStatus(project.status)}
                  </span>
                  <span className="dash-project-team">
                    <People size={10} aria-hidden="true" />
                    {project.maxTeamSize}
                  </span>
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="dash-project-title"
                  style={{ textDecoration: "none" }}
                >
                  {project.title}
                </Link>
                <p className="dash-project-desc">{project.description}</p>

                {skills.length > 0 && (
                  <div className="dash-skill-list">
                    {skills.slice(0, 3).map((skill: any) => (
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

                <div className="dash-project-deadline">
                  <Calendar3 size={10} aria-hidden="true" />
                  <span>Apply by {deadline.label}</span>
                </div>

                <div className="dash-project-actions">
                  <button
                    type="button"
                    className="dash-btn dash-btn-ghost dash-btn-sm"
                    onClick={() => setSelectedProject(project)}
                    disabled={project.status === "IN_PROGRESS"}
                  >
                    <Stars size={11} aria-hidden="true" />
                    AI matches
                  </button>
                  <button
                    type="button"
                    className="dash-btn dash-btn-ghost dash-btn-sm"
                    onClick={() => setManageProject(project)}
                  >
                    <Inbox size={11} aria-hidden="true" />
                    Candidates
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {projects.length > 0 && (
        <div className="dash-inline" style={{ marginTop: 18 }}>
          <button
            type="button"
            className="dash-btn dash-btn-ghost dash-btn-sm"
            onClick={() => navigate("/discover")}
          >
            Browse other projects
            <ArrowRight size={11} aria-hidden="true" />
          </button>
        </div>
      )}

      {selectedProject && (
        <ProjectRecommendationsModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {manageProject && (
        <ManageApplicationsModal
          project={manageProject}
          isOpen={!!manageProject}
          onClose={() => setManageProject(null)}
        />
      )}
    </div>
  );
}
