import { cn } from "@/lib/utils";

interface SectionGlowProps {
  position: "top-right" | "top-left" | "center";
  color?: "indigo" | "purple" | "burgundy" | "terracotta" | "rose";
  className?: string;
}

/**
 * Ambient glow orbs using the SkillSync brand palette:
 * Deep Burgundy (#4A121A) & Warm Terracotta (#A75D43)
 */
export function SectionGlow({ position, color = "burgundy", className }: SectionGlowProps) {
  const colorClass = {
    burgundy: "bg-[#4A121A]/10",
    terracotta: "bg-[#A75D43]/12",
    rose: "bg-[#8A5A62]/10",
    indigo: "bg-[#4A121A]/10",
    purple: "bg-[#8A5A62]/10",
  }[color] || "bg-[#4A121A]/10";

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
