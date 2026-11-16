const DEFAULT_RESUME_AT = "2026-12-01T00:00:00+05:30";

const TRUE_VALUES = new Set(["true", "1", "yes", "on"]);

function parseDate(value: string): Date | null {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const suspendedFlag = String(import.meta.env.VITE_SERVICE_SUSPENDED ?? "")
  .trim()
  .toLowerCase();

const configuredResumeAt = String(import.meta.env.VITE_SERVICE_RESUME_AT ?? "").trim();

export const serviceSuspensionConfigured = TRUE_VALUES.has(suspendedFlag);

export const serviceResumeAt: Date | null =
  parseDate(configuredResumeAt) ?? parseDate(DEFAULT_RESUME_AT);

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function isServiceSuspended(now: Date = new Date()): boolean {
  if (!serviceSuspensionConfigured) return false;
  if (!serviceResumeAt) return true;

  return now.getTime() < serviceResumeAt.getTime();
}

export function getCountdownParts(resumeAt: Date | null, now: Date): CountdownParts {
  if (!resumeAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const remainingSeconds = Math.max(0, Math.floor((resumeAt.getTime() - now.getTime()) / 1000));

  return {
    days: Math.floor(remainingSeconds / 86_400),
    hours: Math.floor((remainingSeconds % 86_400) / 3_600),
    minutes: Math.floor((remainingSeconds % 3_600) / 60),
    seconds: remainingSeconds % 60,
  };
}

export function formatResumeDate(resumeAt: Date | null): string | null {
  if (!resumeAt) return null;

  const formatted = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(resumeAt);

  return `${formatted} IST`;
}
