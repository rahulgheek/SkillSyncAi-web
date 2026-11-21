import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { PlaceholderPill } from "./PlaceholderPill";
import { StaggeredCardColumnProps } from "./types";

/**
 * StaggeredCardColumn represents one of the three cascading card columns:
 * - Top micro-pattern: a dot + bar row, plus a right-aligned bar below it
 * - Solid dark rounded card box with title and description content
 * - Optional bottom placeholder text lines
 */
export const StaggeredCardColumn: React.FC<StaggeredCardColumnProps> = ({
  index,
  data,
  staggerClass = "",
  hasBottomLines = false,
  className = "",
  onClick,
  children,
}) => {
  return (
    <div className={`flex flex-col w-full select-none ${staggerClass} ${className}`}>
      {/* Micro-header above the card */}
      <div className="w-full flex flex-col gap-1.5 mb-2.5 sm:mb-3">
        {/* Row 1: Dot on left + pill */}
        <div className="flex items-center gap-2">
          <PlaceholderPill
            width={14}
            height={8}
            color="dark"
            ariaLabel={`Card ${index} dot`}
            className="sm:w-4 sm:h-2.5 flex-shrink-0"
          />
          <PlaceholderPill
            width={72}
            height={8}
            color="dark"
            ariaLabel={`Card ${index} top bar`}
            className="sm:w-24 sm:h-2.5"
          />
        </div>

        {/* Row 2: Right-aligned bar */}
        <div className="w-full flex justify-end pr-1 sm:pr-2">
          <PlaceholderPill
            width={58}
            height={8}
            color="dark"
            ariaLabel={`Card ${index} offset bar`}
            className="sm:w-20 sm:h-2.5 opacity-90"
          />
        </div>
      </div>

      {/* Main Dark Rounded Card */}
      <PlaceholderBox
        color="dark"
        interactive
        onClick={onClick}
        ariaLabel={data?.title || `Showcase card ${index}`}
        className="w-full min-h-[220px] sm:min-h-[260px] md:min-h-[290px] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between border border-neutral-800 shadow-xl group"
      >
        {children || (
          <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#1e1e21] p-4 sm:p-5 flex flex-col justify-between border border-neutral-800/80 transition-all duration-300 group-hover:bg-[#232328] group-hover:border-neutral-700">
            {/* Top Tag & Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                {data?.tag || `0${index} / FEATURE`}
              </span>
              {data?.badge && (
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  {data.badge}
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="my-auto space-y-2 py-2">
              <h3 className="text-base sm:text-lg font-bold text-[#d9d9d9] tracking-tight leading-snug m-0 group-hover:text-white transition-colors">
                {data?.title || `Feature ${index}`}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed m-0">
                {data?.description}
              </p>
            </div>

            {/* Bottom status / indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-500">
              <span>SkillSync AI</span>
              <svg
                className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#d9d9d9] group-hover:translate-x-0.5 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        )}
      </PlaceholderBox>

      {/* Bottom text placeholder lines (Columns 1 and 3) */}
      {hasBottomLines && (
        <div className="flex flex-col gap-1.5 mt-2.5 sm:mt-3 pl-0.5">
          <PlaceholderPill
            width="84%"
            height={6}
            color="dark"
            ariaLabel={`Card ${index} bottom line 1`}
            className="sm:h-1.5"
          />
          <PlaceholderPill
            width="62%"
            height={6}
            color="dark"
            ariaLabel={`Card ${index} bottom line 2`}
            className="sm:h-1.5 opacity-90"
          />
          <PlaceholderPill
            width="42%"
            height={6}
            color="dark"
            ariaLabel={`Card ${index} bottom line 3`}
            className="sm:h-1.5 opacity-80"
          />
        </div>
      )}
    </div>
  );
};
