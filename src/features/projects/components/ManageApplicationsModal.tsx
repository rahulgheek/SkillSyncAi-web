import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRepeat,
  CheckLg,
  Inbox,
  PersonCheckFill,
  Send,
  Trash3,
  XLg,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  getProjectApplications,
  getProjectInvitations,
  approveApplication,
  rejectApplication,
  revokeInvitation,
  ProjectResponse,
} from "../api";
import { getInitials } from "@/features/dashboard/utils";

interface ManageApplicationsModalProps {
  project: ProjectResponse;
  isOpen: boolean;
  onClose: () => void;
}

type ManageTab = "applications" | "invitations";

export default function ManageApplicationsModal({
  project,
  isOpen,
  onClose,
}: ManageApplicationsModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ManageTab>("applications");

  const { data: applications, isLoading: isLoadingApps } = useQuery({
    queryKey: ["projectApplications", project.id],
    queryFn: () => getProjectApplications(project.id),
    enabled: isOpen,
  });

  const { data: invitations, isLoading: isLoadingInvs } = useQuery({
    queryKey: ["projectInvitations", project.id],
    queryFn: () => getProjectInvitations(project.id),
    enabled: isOpen,
  });

  const approveMutation = useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      toast.success("Application approved! They are now part of the team.");
      queryClient.invalidateQueries({
        queryKey: ["projectApplications", project.id],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve application");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      toast.success("Application rejected.");
      queryClient.invalidateQueries({
        queryKey: ["projectApplications", project.id],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject application");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      toast.success("Invitation revoked.");
      queryClient.invalidateQueries({
        queryKey: ["projectInvitations", project.id],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revoke invitation");
    },
  });

  const pendingCount = applications?.length ?? 0;
  const invitationCount = invitations?.length ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dash-modal dash-modal-wide dash-modal-fixed">
        <div className="dash-modal-head">
          <div>
            <DialogTitle className="dash-modal-title">Manage candidates</DialogTitle>
            <DialogDescription className="dash-modal-desc">
              Review incoming applications and sent invitations for{" "}
              <strong>{project.title}</strong>.
            </DialogDescription>
          </div>
        </div>

        <div className="dash-tabs" role="tablist" style={{ paddingInline: 8 }}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "applications"}
            className={`dash-tab${activeTab === "applications" ? " is-active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            <Inbox size={10} aria-hidden="true" />
            Applications
            <span className="dash-tab-count">{pendingCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "invitations"}
            className={`dash-tab${activeTab === "invitations" ? " is-active" : ""}`}
            onClick={() => setActiveTab("invitations")}
          >
            <Send size={10} aria-hidden="true" />
            Sent invitations
            <span className="dash-tab-count">{invitationCount}</span>
          </button>
        </div>

        <div className="dash-modal-body">
          {activeTab === "applications" ? (
            isLoadingApps ? (
              <div className="dash-loader-row" role="status">
                <span className="dash-spinner" aria-hidden="true" />
                <span>Loading applications</span>
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="dash-stack-sm">
                {applications.map((app) => (
                  <article key={app.id} className="dash-entry">
                    <div
                      className="dash-spread"
                      style={{ alignItems: "flex-start", flexWrap: "wrap" }}
                    >
                      <button
                        type="button"
                        className="dash-inline"
                        style={{
                          flexWrap: "nowrap",
                          padding: 0,
                          border: 0,
                          background: "transparent",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "inherit",
                          fontFamily: "inherit",
                        }}
                        onClick={() => {
                          onClose();
                          navigate(`/profiles/${app.userId}`);
                        }}
                      >
                        <Avatar className="dash-avatar-sm">
                          <AvatarImage
                            src={app.applicantProfilePictureUrl || undefined}
                          />
                          <AvatarFallback className="dash-avatar-fallback">
                            {getInitials(app.applicantName || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <span style={{ minWidth: 0 }}>
                          <span className="dash-entry-title">
                            {app.applicantName}
                          </span>
                          <span className="dash-entry-meta" style={{ marginTop: 2 }}>
                            {[app.applicantDepartment, app.applicantGraduationYear]
                              .filter(Boolean)
                              .join(" · ") || "Student"}
                          </span>
                        </span>
                      </button>

                      <div className="dash-inline" style={{ flexShrink: 0 }}>
                        <button
                          type="button"
                          className="dash-btn dash-btn-solid dash-btn-sm"
                          onClick={() => approveMutation.mutate(app.id)}
                          disabled={
                            approveMutation.isPending || rejectMutation.isPending
                          }
                        >
                          <CheckLg size={10} aria-hidden="true" />
                          Approve
                        </button>
                        <button
                          type="button"
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={() => rejectMutation.mutate(app.id)}
                          disabled={
                            approveMutation.isPending || rejectMutation.isPending
                          }
                        >
                          <XLg size={10} aria-hidden="true" />
                          Reject
                        </button>
                      </div>
                    </div>

                    <p className="dash-entry-text">&ldquo;{app.coverMessage}&rdquo;</p>

                    <div className="dash-entry-meta" style={{ marginTop: 8 }}>
                      <span>Role: {app.roleTitle || "Any"}</span>
                    </div>

                    {app.applicantTopSkills && app.applicantTopSkills.length > 0 && (
                      <div className="dash-tag-row" style={{ marginTop: 8 }}>
                        {app.applicantTopSkills.map((skill) => (
                          <span key={skill} className="dash-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="dash-empty-inline" style={{ minHeight: 240 }}>
                <span className="dash-chat-placeholder-icon">
                  <Inbox size={18} aria-hidden="true" />
                </span>
                <h4>No pending applications</h4>
                <p>
                  You are all caught up. New applications will appear here as they
                  arrive.
                </p>
              </div>
            )
          ) : isLoadingInvs ? (
            <div className="dash-loader-row" role="status">
              <span className="dash-spinner" aria-hidden="true" />
              <span>Loading invitations</span>
            </div>
          ) : invitations && invitations.length > 0 ? (
            <div className="dash-stack-sm">
              {invitations.map((inv) => (
                <article key={inv.id} className="dash-entry">
                  <div
                    className="dash-spread"
                    style={{ alignItems: "flex-start", flexWrap: "wrap" }}
                  >
                    <div className="dash-inline" style={{ flexWrap: "nowrap" }}>
                      <Avatar className="dash-avatar-sm">
                        <AvatarImage
                          src={inv.invitedUserProfilePictureUrl || undefined}
                        />
                        <AvatarFallback className="dash-avatar-fallback">
                          {getInitials(inv.invitedUserName || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <div style={{ minWidth: 0 }}>
                        <h3 className="dash-entry-title">
                          {inv.invitedUserName}
                          <span className="dash-badge dash-badge-soft">
                            {inv.status}
                          </span>
                        </h3>
                        <div className="dash-entry-meta" style={{ marginTop: 2 }}>
                          <span>
                            {[inv.invitedUserDepartment, inv.invitedUserGraduationYear]
                              .filter(Boolean)
                              .join(" · ") || "Student"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="dash-btn dash-btn-ghost dash-btn-sm"
                      onClick={() => revokeMutation.mutate(inv.id)}
                      disabled={revokeMutation.isPending || inv.status !== "PENDING"}
                    >
                      {revokeMutation.isPending ? (
                        <ArrowRepeat
                          size={10}
                          className="dash-icon-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Trash3 size={10} aria-hidden="true" />
                      )}
                      Revoke
                    </button>
                  </div>

                  <p className="dash-entry-text">&ldquo;{inv.message}&rdquo;</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="dash-empty-inline" style={{ minHeight: 240 }}>
              <span className="dash-chat-placeholder-icon">
                <PersonCheckFill size={18} aria-hidden="true" />
              </span>
              <h4>No sent invitations</h4>
              <p>
                Use AI recommendations to find and invite great candidates to the
                team.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
