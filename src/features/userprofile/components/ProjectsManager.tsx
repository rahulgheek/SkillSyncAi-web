import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRepeat,
  BoxArrowUpRight,
  Calendar3,
  Github,
  PencilSquare,
  PlusLg,
  Search,
  Trash3,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileResponse, PreviousProject } from "../schemas";
import {
  addProject,
  updateProject,
  deleteProject,
  ProjectInput,
  searchSkills,
  Skill,
} from "../api";

export function ProjectsManager({
  profile,
  isOwnProfile = true,
}: {
  profile: ProfileResponse;
  isOwnProfile?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PreviousProject | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [startedOn, setStartedOn] = useState("");
  const [endedOn, setEndedOn] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techResults, setTechResults] = useState<Skill[]>([]);
  const [isSearchingTech, setIsSearchingTech] = useState(false);

  // Debounced tech search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (techInput.trim().length >= 2) {
        setIsSearchingTech(true);
        try {
          const res = await searchSkills(techInput);
          setTechResults(res);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearchingTech(false);
        }
      } else {
        setTechResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [techInput]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setProjectUrl("");
    setGithubUrl("");
    setStartedOn("");
    setEndedOn("");
    setTechInput("");
    setTechStack([]);
    setEditingProject(null);
  };

  const handleEdit = (project: PreviousProject) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || "");
    setProjectUrl(project.projectUrl || "");
    setGithubUrl(project.githubUrl || "");
    setStartedOn(project.startedOn || "");
    setEndedOn(project.endedOn || "");
    setTechStack(project.techStack || []);
    setIsOpen(true);
  };

  const addTech = (skillName: string) => {
    if (!techStack.includes(skillName)) {
      setTechStack([...techStack, skillName]);
    }
    setTechInput("");
    setTechResults([]);
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      addTech(techInput.trim());
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      toast.success("Project added successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add project."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; input: ProjectInput }) =>
      updateProject(data.id, data.input),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update project."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to delete project."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: ProjectInput = {
      title,
      description,
      projectUrl,
      githubUrl,
      startedOn: startedOn || undefined,
      endedOn: endedOn || undefined,
      techStack,
    };
    if (editingProject && editingProject.id) {
      updateMutation.mutate({ id: editingProject.id, input });
    } else {
      addMutation.mutate(input);
    }
  };

  return (
    <div className="dash-stack">
      <div className="dash-spread">
        <div>
          <h2 className="dash-mini-title">Previous projects</h2>
          <p className="dash-mini-sub">
            Showcase your hackathons, coursework, and personal builds.
          </p>
        </div>
        {isOwnProfile && (
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <button type="button" className="dash-btn dash-btn-ghost dash-btn-sm">
                <PlusLg size={11} aria-hidden="true" />
                Add project
              </button>
            </DialogTrigger>
            <DialogContent className="dash-modal">
              <div className="dash-modal-head">
                <div>
                  <DialogTitle className="dash-modal-title">
                    {editingProject ? "Edit project" : "Add a project"}
                  </DialogTitle>
                  <DialogDescription className="dash-modal-desc">
                    Detail the work you are proud of, the tools you used, and what
                    you shipped.
                  </DialogDescription>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="dash-modal-body dash-form">
                  <div className="dash-field">
                    <label className="dash-label" htmlFor="project-title">
                      Project title *
                    </label>
                    <input
                      id="project-title"
                      className="dash-input"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. SkillSync AI"
                    />
                  </div>

                  <div className="dash-form-grid">
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="project-start">
                        Start date
                      </label>
                      <input
                        id="project-start"
                        className="dash-input"
                        type="date"
                        value={startedOn}
                        onChange={(e) => setStartedOn(e.target.value)}
                      />
                    </div>
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="project-end">
                        End date
                      </label>
                      <input
                        id="project-end"
                        className="dash-input"
                        type="date"
                        value={endedOn}
                        onChange={(e) => setEndedOn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="dash-form-grid">
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="project-demo">
                        Live demo URL
                      </label>
                      <input
                        id="project-demo"
                        className="dash-input"
                        type="url"
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="project-github">
                        GitHub repository
                      </label>
                      <input
                        id="project-github"
                        className="dash-input"
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="dash-field">
                    <label className="dash-label" htmlFor="project-tech">
                      Tech stack
                    </label>
                    {techStack.length > 0 && (
                      <div className="dash-tag-row" style={{ marginBottom: 6 }}>
                        {techStack.map((tech) => (
                          <span key={tech} className="dash-tag">
                            {tech}
                            <button
                              type="button"
                              className="dash-tag-remove"
                              aria-label={`Remove ${tech}`}
                              onClick={() => removeTech(tech)}
                            >
                              <Trash3 size={9} aria-hidden="true" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="dash-input-wrap" style={{ position: "relative" }}>
                      <Search size={12} aria-hidden="true" />
                      <input
                        id="project-tech"
                        className="dash-input"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder="Search skills (e.g. React, Spring Boot)"
                        autoComplete="off"
                      />
                      {isSearchingTech && (
                        <span className="dash-input-action">
                          <ArrowRepeat
                            size={12}
                            className="dash-icon-spin"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {techResults.length > 0 && (
                        <div className="dash-suggest">
                          {techResults.map((skill) => (
                            <button
                              type="button"
                              key={skill.id}
                              onClick={() => addTech(skill.name)}
                            >
                              {skill.name}
                              <small>{skill.category}</small>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="dash-field">
                    <label className="dash-label" htmlFor="project-description">
                      Description
                    </label>
                    <textarea
                      id="project-description"
                      className="dash-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what you built, the challenges you faced, and your role."
                    />
                  </div>
                </div>

                <div className="dash-modal-foot">
                  <span className="dash-help">Saved to your public profile</span>
                  <div className="dash-modal-actions">
                    <button
                      type="button"
                      className="dash-btn dash-btn-ghost"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dash-btn dash-btn-solid"
                      disabled={addMutation.isPending || updateMutation.isPending}
                    >
                      {(addMutation.isPending || updateMutation.isPending) && (
                        <ArrowRepeat
                          size={12}
                          className="dash-icon-spin"
                          aria-hidden="true"
                        />
                      )}
                      Save project
                    </button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {(!profile.projects || profile.projects.length === 0) && (
        <div className="dash-empty-inline dash-panel-soft">
          <p>
            No projects added yet.
            {isOwnProfile ? " Use Add project to showcase your work." : ""}
          </p>
        </div>
      )}

      <div className="dash-stack-sm">
        {profile.projects?.map((project) => (
          <article key={project.id} className="dash-entry">
            <div className="dash-spread">
              <div style={{ minWidth: 0 }}>
                <h3 className="dash-entry-title">
                  {project.title}
                  <span className="dash-entry-links">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Live demo"
                        aria-label={`Open live demo for ${project.title}`}
                      >
                        <BoxArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub repository"
                        aria-label={`Open GitHub repository for ${project.title}`}
                      >
                        <Github size={12} aria-hidden="true" />
                      </a>
                    )}
                  </span>
                </h3>

                {(project.startedOn || project.endedOn) && (
                  <div className="dash-entry-meta">
                    <span>
                      <Calendar3 size={10} aria-hidden="true" />
                      {project.startedOn || "Unknown"}{" "}
                      {project.endedOn ? `– ${project.endedOn}` : "– Present"}
                    </span>
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <div className="dash-entry-actions">
                  <button
                    type="button"
                    className="dash-icon-btn-sm"
                    aria-label={`Edit ${project.title}`}
                    onClick={() => handleEdit(project)}
                  >
                    <PencilSquare size={11} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="dash-icon-btn-sm is-danger"
                    aria-label={`Delete ${project.title}`}
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this project?")) {
                        deleteMutation.mutate(project.id!);
                      }
                    }}
                  >
                    <Trash3 size={11} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {project.techStack && project.techStack.length > 0 && (
              <div className="dash-tag-row" style={{ marginTop: 8 }}>
                {project.techStack.map((tech) => (
                  <span key={tech} className="dash-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {project.description && (
              <p className="dash-entry-text">{project.description}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
