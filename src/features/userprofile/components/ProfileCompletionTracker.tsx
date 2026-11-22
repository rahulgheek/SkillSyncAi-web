import { useState } from "react";
import { CheckCircleFill, Circle, XLg } from "react-bootstrap-icons";
import { ProfileResponse } from "../schemas";

export function ProfileCompletionTracker({ profile }: { profile: ProfileResponse }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !profile) return null;

  const tasks = [
    { label: "Add profile picture", completed: !!profile.profilePictureUrl },
    { label: "Upload resume", completed: !!profile.resumeUrl },
    { label: "Add 5 skills", completed: (profile.skills?.length || 0) >= 5 },
    { label: "Add GitHub", completed: !!profile.githubUrl },
    { label: "Add project", completed: (profile.projects?.length || 0) > 0 },
  ];

  const completedCount = tasks.filter((task) => task.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  if (percentage === 100) return null;

  return (
    <aside className="dash-completion" aria-label="Profile setup progress">
      <div className="dash-completion-top">
        <div>
          <h4 className="dash-completion-title">Profile setup</h4>
          <p className="dash-completion-sub">{percentage}% complete</p>
        </div>
        <button
          type="button"
          className="dash-icon-btn-sm"
          aria-label="Dismiss profile setup"
          onClick={() => setIsVisible(false)}
        >
          <XLg size={10} aria-hidden="true" />
        </button>
      </div>

      <div className="dash-progress" aria-hidden="true">
        <span style={{ width: `${percentage}%` }} />
      </div>

      <div className="dash-completion-list">
        {tasks.map((task) => (
          <div
            key={task.label}
            className={`dash-completion-task${task.completed ? " is-done" : ""}`}
          >
            {task.completed ? (
              <CheckCircleFill size={12} aria-hidden="true" />
            ) : (
              <Circle size={12} aria-hidden="true" />
            )}
            <span>{task.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
