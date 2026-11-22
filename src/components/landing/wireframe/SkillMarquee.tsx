import React from "react";

const SKILLS = [
  { label: "React", dot: "bg-[#61DAFB]" },
  { label: "TypeScript", dot: "bg-[#3178C6]" },
  { label: "Python", dot: "bg-[#FBBF24]" },
  { label: "Figma", dot: "bg-[#FB7185]" },
  { label: "Node.js", dot: "bg-[#34D399]" },
  { label: "Gemini AI", dot: "bg-[#8B5CF6]" },
  { label: "Flutter", dot: "bg-[#38BDF8]" },
  { label: "AWS", dot: "bg-[#F97316]" },
  { label: "Next.js", dot: "bg-[#E2E8F0]" },
  { label: "Tailwind", dot: "bg-[#2DD4BF]" },
];

const SkillPill: React.FC<{ label: string; dot: string }> = ({ label, dot }) => (
  <span className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur transition-colors hover:border-white/20 hover:text-white">
    <span className={`h-2 w-2 rounded-full ${dot}`} />
    {label}
  </span>
);

/**
 * Infinite technology strip that adds a second moving layer beneath the hero.
 */
export const SkillMarquee: React.FC = () => {
  return (
    <section
      aria-label="Technologies student builders use on SkillSync"
      className="relative z-10 border-y border-white/[0.06] bg-white/[0.015] py-5"
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <span className="hidden shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35 sm:flex">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#8B5CF6]" />
          Built with
        </span>
        <div className="marquee marquee-mask relative flex-1 overflow-hidden">
          <div className="marquee-track items-center gap-3">
            <div className="flex items-center gap-3 pr-3">
              {SKILLS.map((skill) => (
                <SkillPill key={skill.label} label={skill.label} dot={skill.dot} />
              ))}
            </div>
            <div className="flex items-center gap-3 pr-3" aria-hidden="true">
              {SKILLS.map((skill) => (
                <SkillPill key={`${skill.label}-duplicate`} label={skill.label} dot={skill.dot} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
