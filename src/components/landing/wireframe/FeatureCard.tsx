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
      className={`relative w-full aspect-[4/4.5] sm:aspect-square md:aspect-[4/4.8] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden border border-[#4A121A] shadow-md group ${className}`}
    >
      {children || (
        <div className="w-full h-full rounded-lg sm:rounded-xl bg-[#28090E] p-3 sm:p-3.5 flex flex-col justify-between border border-[#4A121A] transition-all duration-300 group-hover:bg-[#340C12] group-hover:border-[#8A5A62]/60">
          {/* Top Tag & Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D98268]">
              {data?.tag || `0${index} / CORE`}
            </span>
            {data?.badge && (
              <span className="text-[10px] font-mono font-semibold text-[#EFE6D8] bg-[#8A5A62]/40 border border-[#8A5A62]/60 px-2 py-0.5 rounded-full">
                {data.badge}
              </span>
            )}
          </div>

          {/* Middle: Title & Description */}
          <div className="my-auto space-y-1.5 py-1">
            <h3 className="text-sm sm:text-base font-bold text-[#EFE6D8] tracking-tight leading-snug m-0 group-hover:text-white transition-colors">
              {data?.title || `Feature ${index}`}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#EFE6D8]/75 font-medium leading-relaxed m-0 line-clamp-4">
              {data?.description}
            </p>
          </div>

          {/* Bottom Accent Indicator */}
          <div className="flex items-center justify-between pt-1 border-t border-[#4A121A]/80 text-[10px] font-mono text-[#8A5A62]">
            <span>SkillSync Intelligence</span>
            <svg
              className="w-3.5 h-3.5 text-[#8A5A62] group-hover:text-[#D98268] group-hover:translate-x-0.5 transition-all"
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
