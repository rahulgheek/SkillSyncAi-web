import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { MissionPillar } from "./types";

interface MissionPillarCardProps {
  pillar: MissionPillar;
  className?: string;
  onClick?: () => void;
}

/**
 * Bootstrap Icon SVGs strictly adhering to .agents/skills/frontend/SKILL.md
 */
const renderPillarIcon = (type: MissionPillar["iconType"]) => {
  switch (type) {
    case "brain":
      // bi-cpu / neural processor
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14A2.5 2.5 0 0 1 11.5 14v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0m-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
        </svg>
      );
    case "profile":
      // bi-person-badge
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "search":
      // bi-search
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      );
    case "growth":
      // bi-graph-up-arrow
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
          />
        </svg>
      );
  }
};

/**
 * MissionPillarCard represents one of the four interactive pillar cards:
 * 1. AI-Powered Matching
 * 2. Smart Profiles
 * 3. Project Discovery
 * 4. Career Growth
 */
export const MissionPillarCard: React.FC<MissionPillarCardProps> = ({
  pillar,
  className = "",
  onClick,
}) => {
  return (
    <PlaceholderBox
      color="dark"
      interactive
      onClick={onClick}
      ariaLabel={pillar.title}
      className={`relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden border border-neutral-800 shadow-xl group hover:-translate-y-1.5 transition-all duration-300 ${className}`}
    >
      <div className="w-full flex flex-col justify-between gap-5">
        {/* Top: Badge + Icon */}
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1c] border border-neutral-800 flex items-center justify-center text-[#d9d9d9] group-hover:text-white group-hover:scale-105 group-hover:border-neutral-700 transition-all shadow-md">
            {renderPillarIcon(pillar.iconType)}
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-[#1c1c1f] px-2.5 py-1 rounded-full border border-neutral-800">
            {pillar.badge}
          </span>
        </div>

        {/* Content: Title & Description */}
        <div className="space-y-2 pt-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#d9d9d9] tracking-tight leading-snug m-0 group-hover:text-white transition-colors">
            {pillar.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed m-0">
            {pillar.description}
          </p>
        </div>

        {/* Bottom Indicator */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-500">
          <span>SkillSync Engine</span>
          <svg
            className="w-4 h-4 text-neutral-500 group-hover:text-[#d9d9d9] group-hover:translate-x-0.5 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </PlaceholderBox>
  );
};
