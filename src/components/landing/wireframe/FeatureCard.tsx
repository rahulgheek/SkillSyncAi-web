import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { FeatureCardProps } from "./types";

/**
 * FeatureCard represents one of the three dark rounded cards in the bottom row.
 * Displays title, user-provided description, and category badge.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  index = 1,
  data,
  className = "",
  onClick,
  children,
}) => {
  return (
    <PlaceholderBox
      color="dark"
      interactive
      onClick={onClick}
      ariaLabel={data?.title || `Feature card ${index}`}
      className={`relative w-full aspect-[4/4.5] sm:aspect-square md:aspect-[4/4.8] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden border border-neutral-800 shadow-md group ${className}`}
    >
      {children || (
        <div className="w-full h-full rounded-lg sm:rounded-xl bg-[#1e1e21] p-3 sm:p-3.5 flex flex-col justify-between border border-neutral-800/80 transition-all duration-300 group-hover:bg-[#232328] group-hover:border-neutral-700">
          {/* Top Tag & Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              {data?.tag || `0${index} / CORE`}
            </span>
            {data?.badge && (
              <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                {data.badge}
              </span>
            )}
          </div>

          {/* Middle: Title & Description */}
          <div className="my-auto space-y-1.5 py-1">
            <h3 className="text-sm sm:text-base font-bold text-[#d9d9d9] tracking-tight leading-snug m-0 group-hover:text-white transition-colors">
              {data?.title || `Feature ${index}`}
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium leading-relaxed m-0 line-clamp-4">
              {data?.description}
            </p>
          </div>

          {/* Bottom Accent Indicator */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-500">
            <span>SkillSync Intelligence</span>
            <svg
              className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#d9d9d9] group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </PlaceholderBox>
  );
};
