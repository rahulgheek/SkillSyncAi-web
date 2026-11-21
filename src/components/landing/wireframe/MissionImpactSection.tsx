import React from "react";
import { MissionPillarCard } from "./MissionPillarCard";
import { MissionImpactSectionProps, MissionPillar } from "./types";

const DEFAULT_PILLARS: MissionPillar[] = [
  {
    id: "matching",
    title: "AI-Powered Matching",
    description:
      "Autonomous skill synthesis pairing complementary developers, designers, and innovators for hackathon dominance.",
    badge: "01 / Match",
    iconType: "brain",
  },
  {
    id: "profiles",
    title: "Smart Profiles",
    description:
      "Gemini-extracted developer identities highlighting verified competencies, past submissions, and strengths.",
    badge: "02 / Identity",
    iconType: "profile",
  },
  {
    id: "discovery",
    title: "Project Discovery",
    description:
      "Real-time visibility into open hackathon teams, active project squads, and trending high-impact build ideas.",
    badge: "03 / Explore",
    iconType: "search",
  },
  {
    id: "growth",
    title: "Career Growth",
    description:
      "Convert weekend competition wins into career-defining milestones with adaptive learning roadmaps and job prep.",
    badge: "04 / Trajectory",
    iconType: "growth",
  },
];

/**
 * MissionImpactSection renders the third landing section on scroll:
 * - Headline: "We aim to help students discover the joy of seamless hackathons and grow into top developers."
 * - 4 interactive pillar cards (AI-Powered Matching, Smart Profiles, Project Discovery, Career Growth)
 * - Adheres strictly to the high-contrast wireframe console theme & zero-emoji policy.
 */
export const MissionImpactSection: React.FC<MissionImpactSectionProps> = ({
  badge = "03 / Mission & Impact",
  titlePrefix = "We aim to help students",
  highlightText = "discover the joy of seamless",
  titleSuffix = "hackathons and grow into top developers.",
  pillars = DEFAULT_PILLARS,
  className = "",
  onPillarClick,
}) => {
  return (
    <section
      role="region"
      aria-label="Mission and impact section"
      className={`relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-28 flex flex-col gap-12 sm:gap-16 select-none ${className}`}
    >
      {/* 1. Main Headline Area */}
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 max-w-4xl mx-auto">
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 bg-[#242424] text-[#d9d9d9] px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm border border-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {badge}
        </div>

        {/* Big Impact Statement with wireframe dark capsule styling */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#242424] leading-tight m-0">
          {titlePrefix}{" "}
          <span className="inline-block bg-[#242424] text-white px-4 sm:px-6 py-1 sm:py-1.5 rounded-full shadow-md my-1 border border-neutral-800">
            {highlightText}
          </span>{" "}
          {titleSuffix}
        </h2>
      </div>

      {/* 2. Four Pillar Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full items-stretch">
        {pillars.map((pillar) => (
          <MissionPillarCard
            key={pillar.id}
            pillar={pillar}
            onClick={() => onPillarClick?.(pillar.id)}
          />
        ))}
      </div>
    </section>
  );
};
