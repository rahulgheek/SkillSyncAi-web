import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRepeat,
  CheckCircleFill,
  SendFill,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { applyToProject, ProjectResponse, ProjectRoleResponse } from "../api";

interface ApplicationFormModalProps {
  project: ProjectResponse | any;
  role?: ProjectRoleResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationFormModal({
  project,
  role,
  isOpen,
  onClose,
}: ApplicationFormModalProps) {
  const [coverMessage, setCoverMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: () =>
      applyToProject({
        projectId: project.id,
        projectRoleId: role?.id,
        coverMessage: coverMessage,
      }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      // Automatically close after a short delay so the user sees the success state
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setCoverMessage("");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    },
  });

  const handleSubmit = () => {
    if (coverMessage.trim().length < 10) {
      toast.error("Please write a slightly longer cover message to pitch yourself!");
      return;
    }
    applyMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dash-modal">
        {!isSuccess ? (
          <>
            <div className="dash-modal-head">
              <div>
                <DialogTitle className="dash-modal-title">Apply to join</DialogTitle>
                <DialogDescription className="dash-modal-desc">
                  You are applying{" "}
                  {role ? (
                    <>
                      for <strong>{role.title}</strong> in{" "}
                    </>
                  ) : (
                    "to "
                  )}
                  <strong>{project.title}</strong>.
                </DialogDescription>
              </div>
            </div>

            <div className="dash-modal-body dash-form">
              <div className="dash-field">
                <label className="dash-label" htmlFor="coverMessage">
                  Your pitch <small>Cover message</small>
                </label>
                <textarea
                  id="coverMessage"
                  className="dash-textarea"
                  value={coverMessage}
                  onChange={(e) => setCoverMessage(e.target.value)}
                  placeholder="Hi! I have 3 years of experience in React and I'd love to help build this..."
                  style={{ minHeight: 150 }}
                />
                <p className="dash-help">
                  Briefly explain why you are a good fit for this role and mention
                  any relevant skills.
                </p>
              </div>
            </div>

            <div className="dash-modal-foot">
              <span className="dash-help">A thoughtful note goes a long way</span>
              <div className="dash-modal-actions">
                <button
                  type="button"
                  className="dash-btn dash-btn-ghost"
                  onClick={onClose}
                  disabled={applyMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="dash-btn dash-btn-solid"
                  onClick={handleSubmit}
                  disabled={applyMutation.isPending}
                >
                  {applyMutation.isPending ? (
                    <ArrowRepeat
                      size={12}
                      className="dash-icon-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <SendFill size={11} aria-hidden="true" />
                  )}
                  {applyMutation.isPending ? "Sending" : "Submit application"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="dash-modal-body" style={{ padding: "38px 24px" }}>
            <DialogTitle className="sr-only">Application sent</DialogTitle>
            <div className="dash-empty-inline" style={{ minHeight: 200 }}>
              <span
                className="dash-dropzone-icon"
                style={{ color: "#6f7a56" }}
                aria-hidden="true"
              >
                <CheckCircleFill size={17} />
              </span>
              <h4>Application sent</h4>
              <p>
                The project owner will review your profile and get back to you soon.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
