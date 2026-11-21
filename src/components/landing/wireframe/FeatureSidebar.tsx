import React from "react";
import { FeatureSidebarProps } from "./types";

/**
 * FeatureSidebar represents the lower-left light panel containing:
 * - Category / Tag pill at the top
 * - Headline & Description overview
 * - Divider line
 * - Action buttons
 */
export const FeatureSidebar: React.FC<FeatureSidebarProps> = ({
  tag = "AI Ecosystem",
  title = "Core Capabilities",
  description = "Gemini-powered skill extraction, deep profile analytics, and personalized learning paths designed for builders.",
  ctaText = "Explore Features",
  className = "",
  style = {},
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <div
      style={style}
      className={`relative bg-[#d9d9d9] p-4 sm:p-6 md:p-7 flex flex-col justify-between overflow-hidden select-none ${className}`}
    >
      {/* Top Tag & Content */}
      <div className="space-y-2.5 sm:space-y-3 pt-1">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-1.5 bg-[#242424] text-[#d9d9d9] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {tag}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#242424] tracking-tight leading-tight m-0">
          {title}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#242424]/85 font-medium leading-relaxed m-0">
          {description}
        </p>

        {/* Thin Divider Line */}
        <div className="w-full h-[1.5px] bg-[#242424]/80 my-2 sm:my-3 rounded-full" />
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 pt-2">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="bg-[#242424] text-white hover:bg-neutral-800 active:scale-95 px-4 sm:px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          {ctaText}
        </button>
        <button
          type="button"
          onClick={onSecondaryClick}
          aria-label="Features documentation"
          className="w-8 h-8 rounded-full bg-[#242424] text-white hover:bg-neutral-800 active:scale-95 flex items-center justify-center text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
