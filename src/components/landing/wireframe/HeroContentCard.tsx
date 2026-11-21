import React from "react";
import { HeroContentCardProps } from "./types";

/**
 * HeroContentCard is the light (#d9d9d9) upper-left panel containing:
 * - Smart Team Assembly headline
 * - Description text provided by the user
 * - Interactive action buttons
 * - Accent emblem circle
 */
export const HeroContentCard: React.FC<HeroContentCardProps> = ({
  title = "Smart Team Assembly",
  description = "Our AI analyzes student skill sets, project history, and behavioral traits to construct perfectly balanced, highly competitive teams tailored for specific hackathon requirements. No more random teaming.",
  tagline = "Hackathon Intelligence",
  ctaText = "Assemble Team",
  className = "",
  style = {},
  onCtaClick,
  onSecondaryClick,
  onCircleClick,
}) => {
  return (
    <div
      style={style}
      className={`relative bg-[#EFE6D8] p-5 sm:p-7 md:p-9 flex flex-col justify-between overflow-hidden select-none ${className}`}
    >
      {/* Upper Content: Tagline, Headline & Description */}
      <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 bg-[#4A121A] text-[#EFE6D8] px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border border-[#8A5A62]/30 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A75D43]" />
          {tagline}
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#4A121A] leading-[1.1] m-0">
          {title}
        </h1>

        {/* Description Body */}
        <p className="text-xs sm:text-sm md:text-base text-[#4A121A]/85 font-medium leading-relaxed max-w-xl m-0">
          {description}
        </p>
      </div>

      {/* Bottom Action Row + Accent Circle */}
      <div className="flex items-end justify-between mt-8 sm:mt-10 pt-3">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center justify-center bg-[#4A121A] text-[#EFE6D8] hover:bg-[#340C12] active:scale-95 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-[#4A121A]/20 cursor-pointer"
          >
            {ctaText}
          </button>
          <button
            type="button"
            onClick={onSecondaryClick}
            aria-label="Learn more about team assembly"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#A75D43] text-[#EFE6D8] hover:bg-[#8F4E37] active:scale-95 flex items-center justify-center text-xs font-bold transition-all shadow-md shadow-[#A75D43]/20 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>

        {/* Right Accent Solid Circle with Team Synergy Glyph */}
        <button
          type="button"
          onClick={onCircleClick}
          aria-label="Team Synergy indicator"
          className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-[#A75D43] text-[#EFE6D8] shadow-lg shadow-[#A75D43]/25 transition-transform duration-300 hover:scale-105 hover:bg-[#8F4E37] active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer group"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 text-[#EFE6D8] group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
