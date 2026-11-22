import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRepeat,
  ArrowRight,
  Calendar3,
  CheckLg,
  People,
  PlusLg,
  Search,
  Stars,
  Trash3,
} from "react-bootstrap-icons";
import { toast } from "sonner";
import { useAuth } from "../../auth/context";
import {
  createProjectDraft,
  addProjectRole,
  publishProject,
  CreateProjectRequest,
  CreateProjectRoleRequest,
} from "../api";
import { searchSkills } from "../../userprofile/api";

type WizardStep = "BASIC_INFO" | "DEFINE_ROLES" | "REVIEW";

const STEPS: { id: WizardStep; label: string; hint: string }[] = [
  { id: "BASIC_INFO", label: "The brief", hint: "Name, scope, deadline" },
  { id: "DEFINE_ROLES", label: "The roles", hint: "Who you need" },
  { id: "REVIEW", label: "Review", hint: "Publish when ready" },
];

const CreateProjectWizard: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [step, setStep] = useState<WizardStep>("BASIC_INFO");
  const [projectId, setProjectId] = useState<string | null>(null);

  // Step 1 State
  const [basicInfo, setBasicInfo] = useState<CreateProjectRequest>({
    title: "",
    description: "",
    maxTeamSize: 2,
    applicationDeadline: "",
  });

  // Step 2 State
  const [roles, setRoles] = useState<CreateProjectRoleRequest[]>([]);
  const [currentRole, setCurrentRole] = useState<CreateProjectRoleRequest>({
    title: "",
    description: "",
    headcount: 1,
    requiredSkills: [],
  });

  // Skill Search State
  const [skillQuery, setSkillQuery] = useState("");
  const [skillResults, setSkillResults] = useState<any[]>([]);
  const [isSearchingSkills, setIsSearchingSkills] = useState(false);
  const [selectedProficiency, setSelectedProficiency] = useState("Beginner");

  const createDraftMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => createProjectDraft(data),
    onSuccess: (data) => {
      setProjectId(data.id);
      setStep("DEFINE_ROLES");
    },
    onError: (err) => {
      console.error("Failed to create draft", err);
      toast.error("Failed to create the draft project. Please try again.");
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: (data: CreateProjectRoleRequest) => addProjectRole(projectId!, data),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishProject(projectId!),
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (err: any) => {
      console.error("Failed to publish", err);
      toast.error(err.response?.data?.message || "Failed to publish project.");
    },
  });

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicInfo.title.trim()) return;
    createDraftMutation.mutate(basicInfo);
  };

  const handleSkillSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSkillQuery(q);
    if (q.trim().length >= 2) {
      setIsSearchingSkills(true);
      try {
        const results = await searchSkills(q);
        setSkillResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingSkills(false);
      }
    } else {
      setSkillResults([]);
    }
  };

  const handleAddSkill = (skill: any) => {
    if (!currentRole.requiredSkills.some((s) => s.skillId === skill.id)) {
      setCurrentRole({
        ...currentRole,
        requiredSkills: [
          ...currentRole.requiredSkills,
          {
            skillId: skill.id,
            skillName: skill.name,
            minimumLevel: selectedProficiency,
          },
        ],
      });
    }
    setSkillQuery("");
    setSkillResults([]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setCurrentRole({
      ...currentRole,
      requiredSkills: currentRole.requiredSkills.filter((s) => s.skillId !== skillId),
    });
  };

  const handleAddRole = async () => {
    if (!currentRole.title.trim()) return;

    // Add locally to preview
    setRoles([...roles, currentRole]);

    // Add to backend if we have a project ID
    if (projectId) {
      try {
        await addRoleMutation.mutateAsync(currentRole);
      } catch (err) {
        console.error("Failed to save role", err);
      }
    }

    // Reset current role form
    setCurrentRole({
      title: "",
      description: "",
      headcount: 1,
      requiredSkills: [],
    });
  };

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, idx) => idx !== index));
  };

  const handleRolesSubmit = () => {
    if (roles.length === 0) {
      if (!confirm("You haven't added any roles. Continue anyway?")) return;
    }
    setStep("REVIEW");
  };

  const handlePublish = async () => {
    if (!projectId) return;
    try {
      // First save any remaining role that wasn't explicitly added via button
      if (currentRole.title.trim()) {
        await addRoleMutation.mutateAsync(currentRole);
      }
      // Then publish
      publishMutation.mutate();
    } catch (err) {
      console.error("Error during publishing flow", err);
    }
  };

  const stepIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">New project</p>
          <h1 className="dash-title">
            Build something <em>worth joining.</em>
          </h1>
          <p className="dash-sub">
            Three steps: shape the brief, define the roles, then publish it to the
            community.
          </p>
        </div>
        <div className="dash-head-actions">
          <button
            type="button"
            className="dash-btn dash-btn-ghost dash-btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={11} aria-hidden="true" />
            Back to dashboard
          </button>
        </div>
      </header>

      <ol className="dash-stepper" aria-label="Project creation progress">
        {STEPS.map((item, index) => {
          const isActive = step === item.id;
          const isCompleted = index < stepIndex;

          return (
            <li
              key={item.id}
              className={`dash-step${isActive ? " is-active" : ""}${
                isCompleted ? " is-complete" : ""
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="dash-step-dot">
                {isCompleted ? (
                  <CheckLg size={10} aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="dash-step-copy">
                <span className="dash-step-label">{item.label}</span>
                <span className="dash-step-hint">{item.hint}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {step === "BASIC_INFO" && (
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">Step one</p>
              <h2 className="dash-panel-title">Project details</h2>
              <p className="dash-panel-sub">
                Give the work a name, a shape, and a finish line.
              </p>
            </div>
          </div>

          <div className="dash-panel-body">
            <form className="dash-form" onSubmit={handleBasicInfoSubmit}>
              <div className="dash-field">
                <label className="dash-label" htmlFor="project-title">
                  Project title *
                </label>
                <input
                  id="project-title"
                  className="dash-input"
                  type="text"
                  required
                  value={basicInfo.title}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, title: e.target.value })
                  }
                  placeholder="e.g. NextGen E-Commerce Platform"
                />
              </div>

              <div className="dash-field">
                <label className="dash-label" htmlFor="project-description">
                  Description
                </label>
                <textarea
                  id="project-description"
                  className="dash-textarea"
                  value={basicInfo.description}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, description: e.target.value })
                  }
                  placeholder="What is this project about? What are the goals?"
                  rows={4}
                />
              </div>

              <div className="dash-form-grid">
                <div className="dash-field">
                  <label className="dash-label" htmlFor="project-team-size">
                    Max team size *
                  </label>
                  <input
                    id="project-team-size"
                    className="dash-input"
                    type="number"
                    required
                    min={2}
                    value={basicInfo.maxTeamSize}
                    onChange={(e) =>
                      setBasicInfo({
                        ...basicInfo,
                        maxTeamSize: parseInt(e.target.value) || 2,
                      })
                    }
                  />
                  <p className="dash-help">Includes you, the project owner.</p>
                </div>

                <div className="dash-field">
                  <label className="dash-label" htmlFor="project-deadline">
                    Application deadline
                  </label>
                  <input
                    id="project-deadline"
                    className="dash-input"
                    type="date"
                    value={basicInfo.applicationDeadline}
                    onChange={(e) =>
                      setBasicInfo({
                        ...basicInfo,
                        applicationDeadline: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="dash-form-actions">
                <button
                  type="submit"
                  className="dash-btn dash-btn-solid dash-btn-lg"
                  disabled={createDraftMutation.isPending}
                >
                  {createDraftMutation.isPending ? (
                    <ArrowRepeat
                      size={13}
                      className="dash-icon-spin"
                      aria-hidden="true"
                    />
                  ) : null}
                  Continue to roles
                  {!createDraftMutation.isPending && (
                    <ArrowRight size={13} aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {step === "DEFINE_ROLES" && (
        <div className="dash-stack">
          {roles.length > 0 && (
            <section className="dash-panel">
              <div className="dash-panel-head">
                <div className="dash-panel-heading">
                  <p className="dash-panel-kicker">The team</p>
                  <h2 className="dash-panel-title">Roles added</h2>
                  <p className="dash-panel-sub">
                    {roles.length} {roles.length === 1 ? "role" : "roles"} defined so
                    far.
                  </p>
                </div>
                <span className="dash-badge dash-badge-soft">
                  <People size={9} aria-hidden="true" />
                  Max {basicInfo.maxTeamSize}
                </span>
              </div>

              <div className="dash-panel-body">
                <div className="dash-role-grid">
                  {roles.map((role, idx) => (
                    <article key={idx} className="dash-role-card">
                      <button
                        type="button"
                        className="dash-icon-btn-sm is-danger dash-role-remove"
                        aria-label={`Remove ${role.title}`}
                        onClick={() => handleRemoveRole(idx)}
                      >
                        <Trash3 size={10} aria-hidden="true" />
                      </button>
                      <h4>{role.title}</h4>
                      <p>{role.description || "No description"}</p>
                      {role.requiredSkills.length > 0 && (
                        <div className="dash-tag-row" style={{ marginTop: 7 }}>
                          {role.requiredSkills.map((skill) => (
                            <span key={skill.skillId} className="dash-tag">
                              {skill.skillName} · {skill.minimumLevel}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="dash-role-count">
                        Headcount {role.headcount}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">Step two</p>
                <h2 className="dash-panel-title">Define a role</h2>
                <p className="dash-panel-sub">
                  Add roles to your team. Total headcount should fit within your max
                  team size of {basicInfo.maxTeamSize}.
                </p>
              </div>
            </div>

            <div className="dash-panel-body">
              <div className="dash-form">
                <div className="dash-form-grid">
                  <div className="dash-field">
                    <label className="dash-label" htmlFor="role-title">
                      Role title *
                    </label>
                    <input
                      id="role-title"
                      className="dash-input"
                      type="text"
                      value={currentRole.title}
                      onChange={(e) =>
                        setCurrentRole({ ...currentRole, title: e.target.value })
                      }
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label" htmlFor="role-headcount">
                      Headcount *
                    </label>
                    <input
                      id="role-headcount"
                      className="dash-input"
                      type="number"
                      min={1}
                      value={currentRole.headcount}
                      onChange={(e) =>
                        setCurrentRole({
                          ...currentRole,
                          headcount: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="dash-field">
                  <label className="dash-label" htmlFor="role-description">
                    Role responsibilities
                  </label>
                  <textarea
                    id="role-description"
                    className="dash-textarea"
                    value={currentRole.description}
                    onChange={(e) =>
                      setCurrentRole({
                        ...currentRole,
                        description: e.target.value,
                      })
                    }
                    placeholder="What will this person be doing?"
                    rows={2}
                  />
                </div>

                <div className="dash-field">
                  <span className="dash-label">Required skills</span>

                  {currentRole.requiredSkills.length > 0 && (
                    <div className="dash-tag-row" style={{ marginBottom: 7 }}>
                      {currentRole.requiredSkills.map((skill) => (
                        <span key={skill.skillId} className="dash-tag">
                          {skill.skillName}
                          <span style={{ opacity: 0.62 }}>{skill.minimumLevel}</span>
                          <button
                            type="button"
                            className="dash-tag-remove"
                            aria-label={`Remove ${skill.skillName}`}
                            onClick={() => handleRemoveSkill(skill.skillId)}
                          >
                            <Trash3 size={9} aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="dash-searchbar" style={{ alignItems: "stretch" }}>
                    <div className="dash-input-wrap">
                      <Search size={12} aria-hidden="true" />
                      <input
                        className="dash-input"
                        type="text"
                        value={skillQuery}
                        onChange={handleSkillSearch}
                        placeholder="Type to search skills..."
                        aria-label="Search skills"
                        autoComplete="off"
                      />
                      {isSearchingSkills && (
                        <span className="dash-input-action">
                          <ArrowRepeat
                            size={12}
                            className="dash-icon-spin"
                            aria-hidden="true"
                          />
                        </span>
                      )}

                      {skillResults.length > 0 && skillQuery.length >= 2 && (
                        <div className="dash-suggest">
                          {skillResults.map((skill) => (
                            <button
                              key={skill.id}
                              type="button"
                              onClick={() => handleAddSkill(skill)}
                            >
                              {skill.name}
                              <small>{skill.category}</small>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <select
                      className="dash-select"
                      style={{ maxWidth: 170 }}
                      value={selectedProficiency}
                      onChange={(e) => setSelectedProficiency(e.target.value)}
                      aria-label="Minimum skill level"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="dash-form-actions">
                  <button
                    type="button"
                    className="dash-btn dash-btn-ghost"
                    onClick={handleAddRole}
                    disabled={currentRole.title.trim() === ""}
                  >
                    <PlusLg size={11} aria-hidden="true" />
                    Add role
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="dash-form-actions">
            <button
              type="button"
              className="dash-btn dash-btn-ghost"
              onClick={() => setStep("BASIC_INFO")}
            >
              <ArrowLeft size={11} aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-solid dash-btn-lg"
              onClick={handleRolesSubmit}
            >
              Review project
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {step === "REVIEW" && (
        <div className="dash-stack">
          <section className="dash-panel" style={{ overflow: "hidden" }}>
            <div className="dash-review-hero">
              <span className="dash-badge dash-badge-ai" style={{ marginBottom: 8 }}>
                <Stars size={9} aria-hidden="true" />
                Final review
              </span>
              <h2 className="dash-review-title">{basicInfo.title}</h2>
              <p className="dash-review-desc">{basicInfo.description}</p>
              <div className="dash-review-chips">
                <span className="dash-review-chip">
                  <People size={9} aria-hidden="true" /> Max team size{" "}
                  {basicInfo.maxTeamSize}
                </span>
                {basicInfo.applicationDeadline && (
                  <span className="dash-review-chip">
                    <Calendar3 size={9} aria-hidden="true" />
                    Deadline{" "}
                    {new Date(basicInfo.applicationDeadline).toLocaleDateString()}
                  </span>
                )}
                <span className="dash-review-chip">
                  {roles.length} {roles.length === 1 ? "role" : "roles"} defined
                </span>
              </div>
            </div>

            <div className="dash-panel-body">
              <div className="dash-spread" style={{ marginBottom: 10 }}>
                <h3 className="dash-mini-title" style={{ margin: 0 }}>
                  Defined roles
                </h3>
                <span className="dash-badge dash-badge-soft">
                  {roles.reduce((total, role) => total + role.headcount, 0)} openings
                </span>
              </div>

              {roles.length === 0 ? (
                <div className="dash-empty-inline dash-panel-soft">
                  <p>
                    No roles defined. You can still publish, but adding roles helps
                    the right people find you.
                  </p>
                </div>
              ) : (
                <div className="dash-stack-sm">
                  {roles.map((role, idx) => (
                    <article key={idx} className="dash-entry">
                      <div className="dash-spread" style={{ alignItems: "flex-start" }}>
                        <div style={{ minWidth: 0 }}>
                          <h4 className="dash-entry-title">{role.title}</h4>
                          {role.description && (
                            <p className="dash-entry-text">{role.description}</p>
                          )}
                          {role.requiredSkills.length > 0 && (
                            <div className="dash-tag-row" style={{ marginTop: 8 }}>
                              {role.requiredSkills.map((skill) => (
                                <span key={skill.skillId} className="dash-tag">
                                  {skill.skillName} ({skill.minimumLevel})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="dash-role-count" style={{ marginTop: 0 }}>
                          {role.headcount} opening{role.headcount === 1 ? "" : "s"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="dash-form-actions">
            <button
              type="button"
              className="dash-btn dash-btn-ghost"
              onClick={() => setStep("DEFINE_ROLES")}
              disabled={addRoleMutation.isPending || publishMutation.isPending}
            >
              <ArrowLeft size={11} aria-hidden="true" />
              Back to edit
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-solid dash-btn-lg"
              onClick={handlePublish}
              disabled={addRoleMutation.isPending || publishMutation.isPending}
            >
              {addRoleMutation.isPending || publishMutation.isPending ? (
                <>
                  <ArrowRepeat
                    size={13}
                    className="dash-icon-spin"
                    aria-hidden="true"
                  />
                  Publishing
                </>
              ) : (
                <>
                  <CheckLg size={13} aria-hidden="true" />
                  Publish project
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectWizard;
