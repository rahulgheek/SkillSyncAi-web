import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowRepeat,
  ArrowRight,
  Stars,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getStudentRecommendations,
  generateStudentRecommendations,
} from "../api";

interface ProjectDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDiscoveryModal({
  isOpen,
  onClose,
}: ProjectDiscoveryModalProps) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: page,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["studentRecommendations"],
    queryFn: () => getStudentRecommendations(0, 10),
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
            toast.success("AI has finished analyzing projects for you!");
          }
        });
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isGenerating, refetch]);

  const generateMutation = useMutation({
    mutationFn: () => generateStudentRecommendations(),
    onSuccess: () => {
      setIsGenerating(true);
      toast.success("AI analysis started! This usually takes 15-30 seconds.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start AI analysis");
    },
  });

  const recommendations = page?.content || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dash-modal dash-modal-wide dash-modal-fixed">
        <div className="dash-modal-head">
          <div>
            <span className="dash-badge dash-badge-ai" style={{ marginBottom: 7 }}>
              <Stars size={9} aria-hidden="true" />
              AI discovery
            </span>
            <DialogTitle className="dash-modal-title">Recommended projects</DialogTitle>
            <DialogDescription className="dash-modal-desc">
              SkillSync AI has analyzed your skills and matched them against active
              projects to find your best team fit.
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
                ? `Showing top ${recommendations.length} AI-ranked projects.`
                : "No projects generated yet."}
            </p>
            <button
              type="button"
              className="dash-btn dash-btn-solid"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || isGenerating}
            >
              {isGenerating || generateMutation.isPending ? (
                <>
                  <ArrowRepeat
                    size={12}
                    className="dash-icon-spin"
                    aria-hidden="true"
                  />
                  SkillSync AI is thinking
                </>
              ) : (
                <>
                  <Stars size={12} aria-hidden="true" />
                  Analyze best projects
                </>
              )}
            </button>
          </div>

          {isLoading && !isGenerating ? (
            <div className="dash-loader-row" role="status">
              <span className="dash-spinner" aria-hidden="true" />
              <span>Loading previous recommendations</span>
            </div>
          ) : isGenerating ? (
            <div className="dash-empty-inline dash-panel-soft" style={{ minHeight: 260 }}>
              <span className="dash-chat-placeholder-icon">
                <Stars size={18} aria-hidden="true" />
              </span>
              <h4>SkillSync AI is analyzing projects</h4>
              <p>
                Evaluating semantic matches based on your skills and strengths. This
                usually takes 15-30 seconds.
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="dash-empty-inline dash-panel-soft" style={{ minHeight: 260 }}>
              <span className="dash-chat-placeholder-icon">
                <Stars size={18} aria-hidden="true" />
              </span>
              <h4>No recommendations yet</h4>
              <p>
                Run the analysis above to let AI find the projects that fit your
                profile best.
              </p>
            </div>
          ) : (
            <div className="dash-stack">
              {recommendations.map((rec, index) => (
                <article key={rec.id} className="dash-entry">
                  <div className="dash-spread" style={{ alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 className="dash-entry-title">
                        {rec.projectTitle}
                        {index === 0 && (
                          <span className="dash-badge dash-badge-ai">
                            <Stars size={9} aria-hidden="true" />
                            Top match
                          </span>
                        )}
                      </h3>
                      <div className="dash-tag-row" style={{ marginTop: 6 }}>
                        <span className="dash-badge dash-badge-soft">
                          {rec.finalScore}% match
                        </span>
                        <span className="dash-badge dash-badge-soft">
                          {rec.confidence} confidence
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dash-btn dash-btn-ghost dash-btn-sm"
                      onClick={() => {
                        onClose();
                        navigate(`/projects/${rec.projectId}`);
                      }}
                    >
                      View project
                      <ArrowRight size={11} aria-hidden="true" />
                    </button>
                  </div>

                  <p className="dash-entry-text">{rec.projectDescription}</p>

                  <div className="dash-note-ai" style={{ marginTop: 10 }}>
                    <strong>Why you match</strong>
                    <p style={{ margin: "4px 0 0" }}>{rec.rationale}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
