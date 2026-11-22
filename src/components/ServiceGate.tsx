import { useEffect, useState, type ReactNode } from "react";
import { ServiceSuspendedPage } from "@/components/ServiceSuspendedPage";
import { isServiceSuspended, serviceResumeAt } from "@/lib/service-status";

interface ServiceGateProps {
  children: ReactNode;
}

const MAX_TIMEOUT_MS = 2_147_000_000;

export function ServiceGate({ children }: ServiceGateProps) {
  const [suspended, setSuspended] = useState(() => isServiceSuspended());

  useEffect(() => {
    const handleVisibilityChange = () => {
      setSuspended(isServiceSuspended());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const resumeAt = serviceResumeAt;
    if (!suspended || !resumeAt) return;

    let timeoutId: number | undefined;

    const scheduleResumeCheck = () => {
      const remaining = resumeAt.getTime() - Date.now();

      if (remaining <= 0) {
        setSuspended(false);
        return;
      }

      timeoutId = window.setTimeout(scheduleResumeCheck, Math.min(remaining + 250, MAX_TIMEOUT_MS));
    };

    scheduleResumeCheck();

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [suspended]);

  if (suspended) {
    return <ServiceSuspendedPage resumeAt={serviceResumeAt} />;
  }

  return children;
}
