import { useEffect, useState, type ReactNode } from "react";
import { Clock3, Database, Mail, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { formatResumeDate, getCountdownParts } from "@/lib/service-status";

interface ServiceSuspendedPageProps {
  resumeAt: Date | null;
}

const COUNTDOWN_UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function ServiceSuspendedPage({ resumeAt }: ServiceSuspendedPageProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!resumeAt) return;

    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, [resumeAt]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "SkillSync - Scheduled Maintenance";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const resumeLabel = formatResumeDate(resumeAt);
  const countdown = getCountdownParts(resumeAt, now);
  const hasResumeDate = Boolean(resumeAt && resumeAt.getTime() > now.getTime());

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-white text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 md:px-12">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 fill-primary text-primary sm:h-6 sm:w-6" />
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">SkillSync</span>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground shadow-sm backdrop-blur sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Paused
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-12 pt-6 text-center sm:px-8 sm:pb-16">
        <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-primary/15 bg-primary/10 text-primary shadow-sm sm:h-24 sm:w-24">
          <Database className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.75} />
        </div>

        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-primary sm:text-sm">
          Scheduled maintenance
        </p>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          SkillSync is taking a short{" "}
          <span className="relative inline-block text-primary">
            break
            <svg
              aria-hidden="true"
              className="absolute -bottom-2 left-0 h-3 w-full text-accent"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0 10 Q 50 20, 100 10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
          We are renewing the database that powers SkillSync. Your account, projects, and
          conversations are safe. The service will come back online
          {resumeLabel ? (
            <>
              {" "}
              on <strong className="font-extrabold text-foreground">{resumeLabel}</strong>
            </>
          ) : (
            " soon"
          )}
          .
        </p>

        {hasResumeDate && (
          <section
            aria-label="Time until the service resumes"
            className="mt-10 w-full max-w-xl sm:mt-12"
          >
            <p className="mb-3 text-sm font-bold text-foreground">Time until we are back</p>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {COUNTDOWN_UNITS.map((unit) => (
                <div
                  key={unit.key}
                  className="rounded-2xl border border-border bg-white/85 px-1 py-4 shadow-sm backdrop-blur sm:rounded-3xl sm:py-5"
                >
                  <span className="block text-3xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-4xl">
                    {String(countdown[unit.key]).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:mt-12 sm:grid-cols-3 sm:gap-4">
          <InfoCard
            icon={ShieldCheck}
            title="Your data is safe"
            description="Accounts, projects, notes, and messages stay exactly as you left them."
          />
          <InfoCard
            icon={Clock3}
            title="No action needed"
            description="The site reopens automatically. You can close this tab and return later."
          />
          <InfoCard
            icon={Mail}
            title="Need help?"
            description={
              <a
                href="mailto:demotesting2200@gmail.com"
                className="font-bold text-primary underline-offset-4 hover:underline"
              >
                Email support
              </a>
            }
          />
        </div>

        <p className="mt-10 max-w-xl text-sm font-medium leading-relaxed text-muted-foreground">
          Thank you for your patience while we make SkillSync more reliable.
        </p>
      </main>

      <footer className="relative z-10 border-t border-border/70 bg-white/60 px-5 py-5 text-center text-xs font-semibold text-muted-foreground backdrop-blur sm:text-sm">
        {new Date().getFullYear()} SkillSync AI. All rights reserved.
      </footer>
    </div>
  );
}

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}

function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur sm:rounded-3xl sm:p-5">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="mt-3 text-base font-extrabold leading-tight">{title}</h2>
      <p className="mt-1.5 text-sm font-medium leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
