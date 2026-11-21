import React from "react";
import { ImpactStatCard } from "./ImpactStatCard";
import { HackathonImpactSectionProps, ImpactStat } from "./types";

const DEFAULT_IMPACT_STATS: ImpactStat[] = [
  {
    id: "tech-learning",
    value: "80%",
    label: "Learn a new technology",
    desc: "Hackathons are the fastest way to pick up a new stack.",
    badge: "Skill Acceleration",
    iconType: "lightning",
  },
  {
    id: "interview-prep",
    value: "3x",
    label: "Faster Interview Prep",
    desc: "Real-world projects stand out more than leetcode.",
    badge: "Career ROI",
    iconType: "briefcase",
  },
  {
    id: "connections",
    value: "10k+",
    label: "Connections Made",
    desc: "Meet co-founders, mentors, and lifelong friends.",
    badge: "Network Growth",
    iconType: "people",
  },
];

/**
 * HackathonImpactSection renders the "The true Impact of Hackathons" stats section:
 * - Headline: The true [Impact] of Hackathons
 * - Subtitle: It's not just about winning prizes...
 * - 3 Metric Cards (80%, 3x, 10k+)
 */
export const HackathonImpactSection: React.FC<HackathonImpactSectionProps> = ({
  badge = "04 / Measurable Impact",
  titlePrefix = "The true",
  highlightText = "Impact",
  titleSuffix = "of Hackathons",
  subtitle = "It's not just about winning prizes. It's about building a portfolio, accelerating your career, and finding your tribe in the tech ecosystem.",
  stats = DEFAULT_IMPACT_STATS,
  className = "",
  onStatClick,
}) => {
  return (
    <section
      role="region"
      aria-label="Hackathon impact statistics"
      className={`relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-28 flex flex-col gap-12 sm:gap-16 select-none ${className}`}
    >
      {/* 1. Section Header */}
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 max-w-3xl mx-auto">
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 bg-[#242424] text-[#d9d9d9] px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm border border-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {badge}
        </div>

        {/* Main Title with Wireframe Dark Capsule Highlight */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#242424] leading-tight m-0">
          {titlePrefix}{" "}
          <span className="inline-block bg-[#242424] text-white px-5 sm:px-7 py-1 sm:py-1.5 rounded-full shadow-md my-1 border border-neutral-800">
            {highlightText}
          </span>{" "}
          {titleSuffix}
        </h2>

        {/* Subtitle Body */}
        <p className="text-sm sm:text-base md:text-lg text-[#242424]/80 font-medium leading-relaxed max-w-2xl m-0 pt-1">
          {subtitle}
        </p>
      </div>

      {/* 2. Three Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch">
        {stats.map((stat) => (
          <ImpactStatCard key={stat.id} stat={stat} onClick={() => onStatClick?.(stat.id)} />
        ))}
      </div>
    </section>
  );
};
