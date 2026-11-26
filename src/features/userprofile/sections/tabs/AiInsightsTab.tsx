import {
  ArrowRepeat,
  Bullseye,
  LightningChargeFill,
  ShieldExclamation,
  SignpostSplit,
  Stars,
} from "react-bootstrap-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeError } from "@/lib/api/errors";
import { ProfileResponse } from "../../schemas";
import { generateAiInsights } from "../../api";

export function AiInsightsTab({ profile }: { profile: ProfileResponse }) {
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateAiInsights,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      toast.success("AI insights generated successfully!");
    },
    onError: (error) => {
      toast.error(normalizeError(error).message);
    },
  });

  const ai = profile.aiInsights;

  const handleGenerate = () => {
    if (generateMutation.isPending) return;
    generateMutation.mutate();
  };

  if (!ai) {
    return (
      <div className="dash-empty-inline" style={{ minHeight: 280 }}>
        <span className="dash-list-icon">
          <Stars size={16} aria-hidden="true" />
        </span>
        <h4>AI insights are still brewing</h4>
        <p>
          Add more skills, projects, or roadmap progress, then generate a fresh read
          on where your profile is strongest.
        </p>
        <button
          type="button"
          className="dash-btn dash-btn-solid"
          style={{ marginTop: 14 }}
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          aria-busy={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <>
              <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
              Generating
            </>
          ) : (
            <>
              <Stars size={12} aria-hidden="true" />
              Generate AI insights
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="dash-stack">
      {generateMutation.isPending && (
        <div className="dash-loader-row" role="status" aria-live="polite">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Analyzing your profile with AI...</span>
        </div>
      )}

      <section className="dash-panel">
        <div className="dash-panel-head">
          <div className="dash-panel-heading">
            <p className="dash-panel-kicker">AI career analysis</p>
            <h2 className="dash-panel-title">Executive summary</h2>
          </div>
          <div className="dash-panel-actions">
            <span className="dash-badge dash-badge-ai">
              <Stars size={9} aria-hidden="true" />
              {ai.confidenceScore}% confidence
            </span>
            <button
              type="button"
              className="dash-btn dash-btn-ghost dash-btn-sm"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              aria-busy={generateMutation.isPending}
            >
              <ArrowRepeat
                size={11}
                className={generateMutation.isPending ? "dash-icon-spin" : undefined}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>
        <div className="dash-panel-body">
          <p className="dash-prose">{ai.careerSummary}</p>
        </div>
      </section>

      <div className="dash-grid-2">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">What lands</p>
              <h2 className="dash-panel-title">Core strengths</h2>
            </div>
            <LightningChargeFill size={14} color="#8a5a3f" aria-hidden="true" />
          </div>
          <div className="dash-panel-body">
            <ul className="dash-list">
              {ai.strengths.map((strength) => (
                <li key={strength} className="dash-list-item">
                  <span className="dash-list-icon">
                    <LightningChargeFill size={11} aria-hidden="true" />
                  </span>
                  <div className="dash-list-copy">
                    <span className="dash-list-title">{strength}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">Room to grow</p>
              <h2 className="dash-panel-title">Skill gaps & focus areas</h2>
            </div>
            <ShieldExclamation size={14} color="#8a5a3f" aria-hidden="true" />
          </div>
          <div className="dash-panel-body">
            <ul className="dash-list">
              {ai.skillGaps.map((gap) => (
                <li key={gap} className="dash-list-item">
                  <span className="dash-list-icon">
                    <ShieldExclamation size={11} aria-hidden="true" />
                  </span>
                  <div className="dash-list-copy">
                    <span className="dash-list-title">{gap}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">Where you fit</p>
              <h2 className="dash-panel-title">Recommended roles</h2>
            </div>
            <Bullseye size={14} color="#8a5a3f" aria-hidden="true" />
          </div>
          <div className="dash-panel-body">
            <div className="dash-tag-row">
              {ai.recommendedRoles.map((role) => (
                <span key={role} className="dash-tag">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">Next steps</p>
              <h2 className="dash-panel-title">Actionable roadmap</h2>
            </div>
            <SignpostSplit size={14} color="#8a5a3f" aria-hidden="true" />
          </div>
          <div className="dash-panel-body">
            <ol className="dash-timeline">
              {ai.learningRoadmap.map((item, index) => (
                <li key={item.title} className="dash-timeline-item">
                  <div className="dash-timeline-rail">
                    <span className="dash-timeline-marker">{index + 1}</span>
                    {index !== ai.learningRoadmap.length - 1 && (
                      <span className="dash-timeline-line" aria-hidden="true" />
                    )}
                  </div>
                  <div className="dash-timeline-card">
                    <p className="dash-timeline-kicker">{item.dueDate}</p>
                    <h3 className="dash-timeline-title">{item.title}</h3>
                    <p className="dash-timeline-text">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
