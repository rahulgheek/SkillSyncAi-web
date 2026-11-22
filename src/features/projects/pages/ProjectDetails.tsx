import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BoxArrowUpRight,
  Calendar3,
  ChatDots,
  ChevronLeft,
  AwardFill,
  GeoAlt,
  InfoCircle,
  Mortarboard,
  People,
  PersonDash,
  PersonPlus,
  Send,
  BoxArrowRight,
  Building,
} from "react-bootstrap-icons";
import { toast } from "sonner";
import {
  getProjectDetails,
  getProjectMembers,
  getMyApplications,
  removeMember,
  leaveProject,
  transferOwnership,
} from "../api";
import { getMyProfile } from "@/features/userprofile/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ApplicationFormModal from "../components/ApplicationFormModal";
import {
  formatDeadline,
  formatProjectStatus,
  getInitials,
  getStatusTone,
} from "@/features/dashboard/utils";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetails(projectId!),
    enabled: !!projectId,
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId!),
    enabled: !!projectId,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const { data: myApps } = useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });

  const isOwner = project?.ownerId === profile?.userId;
  const isMember = members?.some((member) => member.userId === profile?.userId);
  const pendingApp = myApps?.find(
    (application) => application.projectId === projectId && application.status === "PENDING"
  );

  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: (memberUserId: string) => removeMember(projectId!, memberUserId),
    onSuccess: () => {
      toast.success("Member removed from team.");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to remove member");
    },
  });

  const leaveProjectMutation = useMutation({
    mutationFn: () => leaveProject(projectId!),
    onSuccess: () => {
      toast.success("You have left the project.");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to leave project");
    },
  });

  const transferOwnershipMutation = useMutation({
    mutationFn: (newOwnerId: string) => transferOwnership(projectId!, newOwnerId),
    onSuccess: () => {
      toast.success("Leadership transferred successfully.");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to transfer leadership");
    },
  });

  if (isLoading) {
    return (
      <div className="dash-page">
        <div className="dash-page-loader" role="status" aria-label="Loading project">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Opening the project</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="dash-page">
        <div className="dash-empty dash-panel" style={{ minHeight: 320 }}>
          <span className="dash-empty-icon">
            <InfoCircle size={19} aria-hidden="true" />
          </span>
          <h3>Project not found</h3>
          <p>The project you are looking for does not exist or has been deleted.</p>
          <button
            type="button"
            className="dash-btn dash-btn-solid"
            onClick={() => navigate("/discover")}
          >
            <ChevronLeft size={12} aria-hidden="true" />
            Back to discover
          </button>
        </div>
      </div>
    );
  }

  const teamCapacity =
    project.maxTeamSize > 0
      ? Math.min(100, Math.round((project.currentMemberCount / project.maxTeamSize) * 100))
      : 0;
  const deadline = formatDeadline(project.applicationDeadline);
  const isFull = (project.currentMemberCount || 0) >= (project.maxTeamSize || 0);

  return (
    <div className="dash-page">
      <button
        type="button"
        className="dash-btn dash-btn-ghost dash-btn-sm"
        onClick={() => navigate(-1)}
        style={{ alignSelf: "flex-start" }}
      >
        <ChevronLeft size={11} aria-hidden="true" />
        Back
      </button>

      <section className="dash-detail-hero">
        <div className="dash-detail-hero-top">
          <span className={`dash-chip dash-chip-${getStatusTone(project.status)}`}>
            {formatProjectStatus(project.status)}
          </span>
          <span className="dash-detail-meta">
            <Calendar3 size={10} aria-hidden="true" />
            Posted {format(new Date(project.createdAt), "MMM d, yyyy")}
          </span>
        </div>

        <h1 className="dash-detail-title">{project.title}</h1>
        <p className="dash-detail-desc">{project.description}</p>

        {project.requiredSkills?.length > 0 && (
          <div className="dash-review-chips">
            {project.requiredSkills.map((skill) => (
              <span key={skill.skillId || skill.skillName} className="dash-review-chip">
                {skill.skillName}
              </span>
            ))}
          </div>
        )}

        <div className="dash-detail-hero-actions">
          {!isOwner && !isMember && (
            <button
              type="button"
              className="dash-btn dash-btn-cream"
              disabled={!!pendingApp || project?.status !== "RECRUITING" || isFull}
              onClick={() => setIsApplyModalOpen(true)}
            >
              <PersonPlus size={12} aria-hidden="true" />
              {pendingApp ? "Application pending" : isFull ? "Team full" : "Apply to join"}
            </button>
          )}

          {!isOwner && isMember && (
            <button
              type="button"
              className="dash-btn dash-btn-ghost-light"
              onClick={() => {
                if (confirm("Are you sure you want to leave this project?")) {
                  leaveProjectMutation.mutate();
                }
              }}
              disabled={leaveProjectMutation.isPending}
            >
              <BoxArrowRight size={12} aria-hidden="true" />
              Leave project
            </button>
          )}

          {!isOwner && !isMember && (
            <button
              type="button"
              className="dash-btn dash-btn-ghost-light"
              onClick={() =>
                navigate(
                  `/messages?userId=${project?.ownerId}&name=${encodeURIComponent(
                    project?.owner?.name || "Project Leader"
                  )}`
                )
              }
            >
              <ChatDots size={12} aria-hidden="true" />
              Message leader
            </button>
          )}

          {(isOwner || isMember) && (
            <button
              type="button"
              className="dash-btn dash-btn-cream"
              onClick={() => navigate(`/messages?projectId=${projectId}`)}
            >
              <ChatDots size={12} aria-hidden="true" />
              Team chat
            </button>
          )}

          <a href="#team" className="dash-btn dash-btn-ghost-light">
            <People size={12} aria-hidden="true" />
            View team
          </a>
        </div>
      </section>

      <div className="dash-detail-layout">
        <div className="dash-detail-main">
          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">The brief</p>
                <h2 className="dash-panel-title">About the project</h2>
              </div>
            </div>
            <div className="dash-panel-body">
              <div className="dash-prose">
                {project.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          <section className="dash-panel" id="team">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">The people</p>
                <h2 className="dash-panel-title">Team members</h2>
              </div>
              <span className="dash-badge dash-badge-soft">
                <People size={9} aria-hidden="true" />
                {project.currentMemberCount}/{project.maxTeamSize}
              </span>
            </div>
            <div className="dash-panel-body">
              {isLoadingMembers ? (
                <div className="dash-loader-row" role="status">
                  <span className="dash-spinner" aria-hidden="true" />
                </div>
              ) : members && members.length > 0 ? (
                <div className="dash-member-grid">
                  {members.map((member) => (
                    <article className="dash-member-card" key={member.id}>
                      <Link
                        to={`/profiles/${member.userId}`}
                        className="dash-member-main"
                      >
                        <Avatar className="dash-avatar-sm">
                          <AvatarImage src={member.profilePictureUrl || ""} />
                          <AvatarFallback className="dash-avatar-fallback">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="dash-member-copy">
                          <span className="dash-member-name">{member.name}</span>
                          <span className="dash-member-role">
                            {member.roleTitle || "Project Owner"}
                          </span>
                          {(member.department || member.graduationYear) && (
                            <span className="dash-member-meta">
                              {[member.department, member.graduationYear]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          )}
                          {member.topSkills && member.topSkills.length > 0 && (
                            <div className="dash-tag-row" style={{ marginTop: 5 }}>
                              {member.topSkills.slice(0, 3).map((skill) => (
                                <span key={skill} className="dash-tag">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>

                      {member.userId !== profile?.userId && (
                        <div className="dash-member-menu dash-inline">
                          <button
                            type="button"
                            className="dash-icon-btn-sm"
                            aria-label={`Message ${member.name}`}
                            onClick={() =>
                              navigate(
                                `/messages?userId=${member.userId}&name=${encodeURIComponent(
                                  member.name || "User"
                                )}`
                              )
                            }
                          >
                            <ChatDots size={10} aria-hidden="true" />
                          </button>
                          {isOwner && (
                            <>
                              <button
                                type="button"
                                className="dash-icon-btn-sm"
                                aria-label={`Make ${member.name} leader`}
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to transfer leadership to this member? You will lose owner privileges."
                                    )
                                  ) {
                                    transferOwnershipMutation.mutate(member.userId);
                                  }
                                }}
                              >
                                <AwardFill size={10} aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                className="dash-icon-btn-sm is-danger"
                                aria-label={`Remove ${member.name}`}
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to remove this member from the team?"
                                    )
                                  ) {
                                    removeMemberMutation.mutate(member.userId);
                                  }
                                }}
                              >
                                <PersonDash size={10} aria-hidden="true" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="dash-empty-inline dash-panel-soft">
                  <People size={18} color="#8f8d6e" aria-hidden="true" />
                  <p>No team members yet. Be the first to apply and join.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="dash-detail-side">
          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">Leading the build</p>
                <h2 className="dash-panel-title">Project leader</h2>
              </div>
            </div>
            <div className="dash-panel-body">
              {project.owner ? (
                <div className="dash-profile-card-mini">
                  <Avatar className="dash-avatar-xl">
                    <AvatarImage src={project.owner.profilePictureUrl || ""} />
                    <AvatarFallback className="dash-avatar-fallback">
                      {getInitials(project.owner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="dash-mini-title">{project.owner.name}</h3>
                  <div className="dash-list" style={{ width: "100%", marginTop: 12 }}>
                    <div className="dash-list-item">
                      <span className="dash-list-icon">
                        <Building size={12} aria-hidden="true" />
                      </span>
                      <div className="dash-list-copy">
                        <span className="dash-list-sub">
                          {project.owner.department || "Department not listed"}
                        </span>
                      </div>
                    </div>
                    <div className="dash-list-item">
                      <span className="dash-list-icon">
                        <Mortarboard size={12} aria-hidden="true" />
                      </span>
                      <div className="dash-list-copy">
                        <span className="dash-list-sub">
                          Class of {project.owner.graduationYear || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="dash-btn dash-btn-ghost"
                    onClick={() =>
                      navigate(
                        `/messages?userId=${project.ownerId}&name=${encodeURIComponent(
                          project.owner?.name || "Project Leader"
                        )}`
                      )
                    }
                  >
                    <Send size={11} aria-hidden="true" />
                    Message
                  </button>
                </div>
              ) : (
                <p className="dash-mini-sub">Owner information unavailable.</p>
              )}
            </div>
          </section>

          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">Capacity</p>
                <h2 className="dash-panel-title">Team status</h2>
              </div>
              <GeoAlt size={13} color="#8a5a3f" aria-hidden="true" />
            </div>
            <div className="dash-panel-body">
              <div className="dash-progress-row">
                <span>Current size</span>
                <strong>
                  {project.currentMemberCount} / {project.maxTeamSize}
                </strong>
              </div>
              <div className="dash-progress" aria-hidden="true">
                <span style={{ width: `${teamCapacity}%` }} />
              </div>
              <p className="dash-help" style={{ marginTop: 6, textAlign: "right" }}>
                {Math.max(0, project.maxTeamSize - project.currentMemberCount)} spots
                remaining
              </p>

              <div className="dash-kv" style={{ marginTop: 12 }}>
                <span>Application deadline</span>
                <strong>{deadline.label}</strong>
              </div>
              <div className="dash-kv">
                <span>Status</span>
                <strong>{formatProjectStatus(project.status)}</strong>
              </div>
              <div className="dash-kv">
                <span>Skills sought</span>
                <strong>{project.requiredSkills?.length || 0}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {project && (
        <ApplicationFormModal
          project={project}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
}
