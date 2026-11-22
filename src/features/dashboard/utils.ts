import type { ProfileResponse } from "@/features/userprofile/schemas";
import type { ProjectDetailsResponse, ProjectResponse } from "@/features/projects/api";

export type ProjectTone = "recruiting" | "active" | "complete" | "draft" | "neutral";

export interface EnrolledProject {
  id: string;
  title: string;
  description: string;
  status: string;
  ownerName: string;
  ownerPhoto?: string;
  currentMemberCount: number;
  maxTeamSize: number;
  skills: string[];
  applicationDeadline?: string;
}

export interface DeadlineEntry {
  id: string;
  title: string;
  kind: "owned" | "team";
  label: string;
  month: string;
  day: string;
  timestamp: number;
}

export function getInitials(name?: string | null): string {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "SS";
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

export function getFirstName(name?: string | null): string {
  const first = (name ?? "").trim().split(/\s+/).filter(Boolean)[0];
  return first ?? "builder";
}

export function normalizeStatus(status?: string | null): string {
  return (status ?? "").trim().toUpperCase();
}

export function formatProjectStatus(status?: string | null): string {
  const normalized = normalizeStatus(status);

  const labels: Record<string, string> = {
    RECRUITING: "Recruiting",
    OPEN: "Recruiting",
    PUBLISHED: "Published",
    IN_PROGRESS: "In progress",
    ACTIVE: "Active",
    DRAFT: "Draft",
    PAUSED: "Paused",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
    CLOSED: "Closed",
  };

  if (labels[normalized]) return labels[normalized];

  if (!normalized) return "Unknown";

  return normalized
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function getStatusTone(status?: string | null): ProjectTone {
  const normalized = normalizeStatus(status);

  if (["RECRUITING", "OPEN", "PUBLISHED", "SEEKING"].includes(normalized)) {
    return "recruiting";
  }

  if (["IN_PROGRESS", "ACTIVE", "PAUSED"].includes(normalized)) {
    return "active";
  }

  if (["COMPLETED", "ARCHIVED", "CLOSED"].includes(normalized)) {
    return "complete";
  }

  if (normalized === "DRAFT") return "draft";

  return "neutral";
}

export function formatDeadline(value?: string | null): {
  label: string;
  month: string;
  day: string;
  timestamp: number | null;
} {
  if (!value) {
    return { label: "No deadline", month: "---", day: "--", timestamp: null };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { label: "No deadline", month: "---", day: "--", timestamp: null };
  }

  const isCurrentYear = date.getFullYear() === new Date().getFullYear();

  return {
    label: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(isCurrentYear ? {} : { year: "numeric" }),
    }),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    timestamp: date.getTime(),
  };
}

export function toEnrolledProject(details: ProjectDetailsResponse): EnrolledProject {
  return {
    id: details.id,
    title: details.title,
    description: details.description ?? "",
    status: details.status,
    ownerName: details.owner?.name ?? "Project owner",
    ownerPhoto: details.owner?.profilePictureUrl,
    currentMemberCount: details.currentMemberCount ?? 0,
    maxTeamSize: details.maxTeamSize ?? 0,
    skills: (details.requiredSkills ?? [])
      .map((skill) => skill.skillName)
      .filter((skill): skill is string => Boolean(skill)),
    applicationDeadline: details.applicationDeadline,
  };
}

export function getUpcomingDeadlines(
  ownedProjects: ProjectResponse[],
  enrolledProjects: EnrolledProject[],
): DeadlineEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entries = new Map<string, DeadlineEntry>();

  const addDeadline = (
    project: { id: string; title: string; applicationDeadline?: string | null },
    kind: DeadlineEntry["kind"],
  ) => {
    if (!project.applicationDeadline) return;

    const parsed = formatDeadline(project.applicationDeadline);
    if (parsed.timestamp === null || parsed.timestamp < today.getTime()) return;

    entries.set(project.id, {
      id: project.id,
      title: project.title,
      kind,
      label: parsed.label,
      month: parsed.month,
      day: parsed.day,
      timestamp: parsed.timestamp,
    });
  };

  ownedProjects.forEach((project) => addDeadline(project, "owned"));
  enrolledProjects.forEach((project) => addDeadline(project, "team"));

  return Array.from(entries.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, 5);
}

export interface ProfileCompletion {
  percent: number;
  completed: number;
  total: number;
  nextStep: string | null;
}

export function getProfileCompletion(profile?: ProfileResponse): ProfileCompletion {
  const steps = [
    { label: "Add a profile photo", done: Boolean(profile?.profilePictureUrl) },
    { label: "Write a short bio", done: Boolean(profile?.bio?.trim()) },
    { label: "Add your major", done: Boolean(profile?.major?.trim()) },
    { label: "Add your graduation year", done: Boolean(profile?.graduationYear) },
    { label: "Add at least three skills", done: (profile?.skills?.length ?? 0) >= 3 },
    { label: "Add a project story", done: (profile?.projects?.length ?? 0) > 0 },
    {
      label: "Link a portfolio or GitHub",
      done: Boolean(profile?.githubUrl || profile?.linkedinUrl || profile?.portfolioUrl),
    },
    { label: "Add an achievement", done: (profile?.achievements?.length ?? 0) > 0 },
  ];

  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;
  const nextStep = steps.find((step) => !step.done)?.label ?? null;

  return {
    percent: Math.round((completed / total) * 100),
    completed,
    total,
    nextStep,
  };
}
