export type Tone = "violet" | "cyan" | "emerald" | "amber" | "rose";

export interface ToneStyle {
  /** Accent text that reads well on the dark landing surface. */
  text: string;
  /** Accent text that reads well on the warm light mission panel. */
  textStrong: string;
  /** Low-opacity accent surface. */
  bg: string;
  /** Accent border. */
  border: string;
  /** Gradient stops for icon tiles and accent bars. */
  gradient: string;
  /** Hover glow. */
  glow: string;
  /** Solid dot color. */
  dot: string;
  /** Gradient number treatment. */
  number: string;
}

export const TONES: Record<Tone, ToneStyle> = {
  violet: {
    text: "text-[#C4B5FD]",
    textStrong: "text-[#6D28D9]",
    bg: "bg-[#8B5CF6]/10",
    border: "border-[#8B5CF6]/30",
    gradient: "from-[#8B5CF6] to-[#6366F1]",
    glow: "hover:shadow-[0_30px_70px_-30px_rgba(139,92,246,0.55)]",
    dot: "bg-[#8B5CF6]",
    number: "bg-gradient-to-r from-[#C4B5FD] to-[#818CF8] bg-clip-text text-transparent",
  },
  cyan: {
    text: "text-[#67E8F9]",
    textStrong: "text-[#0E7490]",
    bg: "bg-[#22D3EE]/10",
    border: "border-[#22D3EE]/30",
    gradient: "from-[#22D3EE] to-[#0EA5E9]",
    glow: "hover:shadow-[0_30px_70px_-30px_rgba(34,211,238,0.5)]",
    dot: "bg-[#22D3EE]",
    number: "bg-gradient-to-r from-[#A5F3FC] to-[#38BDF8] bg-clip-text text-transparent",
  },
  emerald: {
    text: "text-[#6EE7B7]",
    textStrong: "text-[#047857]",
    bg: "bg-[#34D399]/10",
    border: "border-[#34D399]/30",
    gradient: "from-[#34D399] to-[#10B981]",
    glow: "hover:shadow-[0_30px_70px_-30px_rgba(52,211,153,0.45)]",
    dot: "bg-[#34D399]",
    number: "bg-gradient-to-r from-[#A7F3D0] to-[#34D399] bg-clip-text text-transparent",
  },
  amber: {
    text: "text-[#FCD34D]",
    textStrong: "text-[#B45309]",
    bg: "bg-[#FBBF24]/10",
    border: "border-[#FBBF24]/30",
    gradient: "from-[#FBBF24] to-[#F97316]",
    glow: "hover:shadow-[0_30px_70px_-30px_rgba(251,191,36,0.45)]",
    dot: "bg-[#FBBF24]",
    number: "bg-gradient-to-r from-[#FDE68A] to-[#FB923C] bg-clip-text text-transparent",
  },
  rose: {
    text: "text-[#FDA4AF]",
    textStrong: "text-[#BE123C]",
    bg: "bg-[#FB7185]/10",
    border: "border-[#FB7185]/30",
    gradient: "from-[#FB7185] to-[#F43F5E]",
    glow: "hover:shadow-[0_30px_70px_-30px_rgba(251,113,133,0.5)]",
    dot: "bg-[#FB7185]",
    number: "bg-gradient-to-r from-[#FECDD3] to-[#FB7185] bg-clip-text text-transparent",
  },
};

export const TONE_SEQUENCE: Tone[] = ["violet", "cyan", "emerald", "amber"];
