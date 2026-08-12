import { type LucideIcon } from "lucide-react";
import { TONES, type Tone } from "./data";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: LucideIcon;
  tone: Tone;
  size?: "md" | "lg";
  variant?: "outline" | "filled";
  className?: string;
}

/**
 * The rounded icon box used in "How it works", "Why choose us", and the
 * feature stack. Previously each section hand-wrote its own border/shadow/
 * color combo — this is now the single implementation.
 */
export function IconBadge({
  icon: Icon,
  tone,
  size = "md",
  variant = "outline",
  className,
}: IconBadgeProps) {
  const t = TONES[tone];
  const dimensions = size === "lg" ? "w-24 h-24" : "w-12 h-12";
  const iconSize = size === "lg" ? "w-10 h-10" : "w-6 h-6";
  const radius = size === "lg" ? "rounded-3xl" : "rounded-xl";

  return (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0",
        dimensions,
        radius,
        variant === "outline"
          ? cn("bg-black border border-white/10", t.glow)
          : cn("border", t.bg, t.ring),
        className,
      )}
    >
      <Icon className={cn(iconSize, t.text)} />
    </div>
  );
}