import { cn } from "@/lib/utils";

interface SectionGlowProps {
  position: "top-right" | "top-left" | "center";
  color?: "indigo" | "purple";
  className?: string;
}

/**
 * The soft ambient blur orb reused behind several sections. Each section
 * previously defined its own absolutely-positioned blurred div inline —
 * centralizing it keeps the "glow language" of the page consistent.
 */
export function SectionGlow({ position, color = "indigo", className }: SectionGlowProps) {
  const colorClass = color === "indigo" ? "bg-indigo-900/10" : "bg-purple-900/10";

  const positionClass = {
    "top-right": "top-1/2 right-0 translate-x-1/3 -translate-y-1/2",
    "top-left": "top-1/4 left-0 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  }[position];

  return (
    <div
      className={cn(
        "pointer-events-none absolute h-[600px] w-[600px] rounded-full blur-[120px]",
        colorClass,
        positionClass,
        className,
      )}
    />
  );
}