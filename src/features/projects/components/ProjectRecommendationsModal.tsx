import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowRepeat,
  ArrowUpRight,
  CheckCircleFill,
  PersonPlusFill,
  Stars,
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
  getProjectRecommendations,
  generateProjectRecommendations,
  inviteStudent,
  ProjectResponse,
} from "../api";
import { getInitials } from "@/features/dashboard/utils";

interface ProjectRecommendationsModalProps {
  project: ProjectResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectRecommendationsModal({
  project,
  isOpen,
  onClose,
}: ProjectRecommendationsModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: page,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projectRecommendations", project.id],
    queryFn: () => getProjectRecommendations(project.id),
    enabled: isOpen,
  });

  // Polling mechanism if we are generating recommendations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let attempts = 0;
    if (isGenerating) {
      interval = setInterval(() => {
        attempts++;
        if (attempts > 36) {
          // Stop after 180 seconds (36 * 5s)
          clearInterval(interval);
          setIsGenerating(false);
          toast.error("AI analysis timed out or failed. Please try again later.");
          return;
        }
        refetch().then((res) => {
          if (res.data && res.data.content.length > 0) {
            setIsGenerating(false);
            clearInterval(interval);
            toast.success("AI has finished analyzing candidates!");
          }
        });
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isGenerating, refetch]);

  const generateMutation = useMutation({
    mutationFn: () => generateProjectRecommendations(project.id),
    onSuccess: () => {
      setIsGenerating(true);
      toast.success("AI analysis started! This usually takes 15-30 seconds.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start AI analysis");
    },
  });

  const handleInvite = async (studentId: string) => {
    try {
      await inviteStudent({ projectId: project.id, invitedUserId: studentId });
      toast.success("Invitation sent successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send invitation");
    }
  };

  const recommendations = page?.content || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dash-modal dash-modal-wide dash-modal-fixed">
        <div className="dash-modal-head">
          <div>
            <span className="dash-badge dash-badge-ai" style={{ marginBottom: 7 }}>
              <Stars size={9} aria-hidden="true" />
              AI matchmaker
            </span>
            <DialogTitle className="dash-modal-title">Recommended candidates</DialogTitle>
            <DialogDescription className="dash-modal-desc">
              SkillSync AI has analyzed the required skills for{" "}
              <strong>{project.title}</strong> and matched them against student
              profiles.
            </DialogDescription>
          </div>
        </div>

        <div className="dash-modal-body">
          <div
            className="dash-spread"
            style={{ flexWrap: "wrap", marginBottom: 14 }}
          >
            <p className="dash-mini-sub" style={{ margin: 0 }}>
              {recommendations.length > 0
                ? `Showing top ${recommendations.length} AI-ranked matches.`
                : "No recommendations generated yet."}
            </p>
            <button
              type="button"
              className="dash-btn dash-btn-solid"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || isGenerating}
            >
              {generateMutation.isPending || isGenerating ? (
                <>
                  <ArrowRepeat
                    size={12}
                    className="dash-icon-spin"
                    aria-hidden="true"
                  />
                  AI is analyzing
                </>
              ) : (
                <>
                  <Stars size={12} aria-hidden="true" />
                  Find best candidates
                </>
              )}
            </button>
          </div>

          {isLoading && !isGenerating ? (
            <div className="dash-loader-row" role="status">
              <span className="dash-spinner" aria-hidden="true" />
              <span>Loading previous matches</span>
            </div>
          ) : generateMutation.isPending || isGenerating ? (
            <div className="dash-empty-inline dash-panel-soft" style={{ minHeight: 260 }}>
              <span className="dash-chat-placeholder-icon">
                <Stars size={18} aria-hidden="true" />
              </span>
              <h4>SkillSync AI is thinking</h4>
              <p>
                Matching student skills and complementary capabilities to your
                project requirements. This usually takes 15-30 seconds.
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="dash-stack">
              {recommendations.map((rec, index) => (
                <article key={rec.id} className="dash-entry">
                  <div className="dash-spread" style={{ alignItems: "flex-start" }}>
                    <div className="dash-inline" style={{ flexWrap: "nowrap" }}>
                      <span className="dash-rank">#{index + 1}</span>
                      <Avatar className="dash-avatar-lg">
                        <AvatarImage
                          src={rec.candidateProfilePictureUrl || undefined}
                          alt={rec.candidateName}
                        />
                        <AvatarFallback className="dash-avatar-fallback">
                          {getInitials(rec.candidateName || "Unknown Candidate")}
                        </AvatarFallback>
                      </Avatar>
                      <div style={{ minWidth: 0 }}>
                        <h3 className="dash-entry-title">
                          {rec.candidateName || "Unknown candidate"}
                        </h3>
                        <div className="dash-tag-row" style={{ marginTop: 5 }}>
                          <span className="dash-badge dash-badge-soft">
                            {rec.finalScore}% match
                          </span>
                          <span className="dash-badge dash-badge-soft">
                            {rec.confidence} confidence
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="dash-inline" style={{ flexShrink: 0 }}>
                      <button
                        type="button"
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                        onClick={() =>
                          window.open(`/profiles/${rec.userId}`, "_blank")
                        }
                      >
                        View profile
                        <ArrowUpRight size={10} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dash-btn dash-btn-solid dash-btn-sm"
                        onClick={() => handleInvite(rec.userId)}
                      >
                        <PersonPlusFill size={11} aria-hidden="true" />
                        Invite
                      </button>
                    </div>
                  </div>

                  <p className="dash-entry-text">{rec.rationale}</p>

                  {rec.matchedSkills && rec.matchedSkills.length > 0 && (
                    <div className="dash-tag-row" style={{ marginTop: 9 }}>
                      {rec.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="dash-tag">
                          <CheckCircleFill
                            size={8}
                            color="#6f7a56"
                            aria-hidden="true"
                          />
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="dash-empty-inline dash-panel-soft" style={{ minHeight: 260 }}>
              <span className="dash-chat-placeholder-icon">
                <Stars size={18} aria-hidden="true" />
              </span>
              <h4>Ready to find your team?</h4>
              <p>
                Run the analysis above and our AI will search for the perfect
                teammates for this project.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
