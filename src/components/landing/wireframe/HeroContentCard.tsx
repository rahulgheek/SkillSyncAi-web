import React from "react";
import { PlaceholderPill } from "./PlaceholderPill";
import { HeroContentCardProps } from "./types";

/**
 * HeroContentCard is the light (#d9d9d9) upper-left panel containing:
 * - Headline Bar 1 (long dark rounded bar)
 * - Headline Bar 2 (medium dark rounded bar)
 * - Subtitle Bar (shorter thinner dark rounded bar)
 * - Action buttons (CTA pill + circular button)
 * - Accent solid dark circle
 */
export const HeroContentCard: React.FC<HeroContentCardProps> = ({
  className = "",
  onCtaClick,
  onSecondaryClick,
  onCircleClick,
}) => {
  return (
    <div
      className={`relative bg-[#d9d9d9] p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden select-none ${className}`}
    >
      {/* Upper Headline & Subtitle bars */}
      <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        {/* Headline Line 1 */}
        <PlaceholderPill
          width="90%"
          height={24}
          color="dark"
          ariaLabel="Headline bar 1"
          className="sm:h-7"
        />

        {/* Headline Line 2 */}
        <PlaceholderPill
          width="74%"
          height={24}
          color="dark"
          ariaLabel="Headline bar 2"
          className="sm:h-7"
        />

        {/* Subtitle / Description Line */}
        <PlaceholderPill
          width="58%"
          height={12}
          color="dark"
          ariaLabel="Subtitle bar"
          className="sm:h-3.5 mt-2 opacity-95"
        />
      </div>

      {/* Bottom Action Row + Accent Circle */}
      <div className="flex items-end justify-between mt-8 sm:mt-12 pt-2">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <PlaceholderPill
            width={84}
            height={26}
            color="dark"
            onClick={onCtaClick}
            ariaLabel="Primary CTA button"
            className="sm:w-24 sm:h-8 shadow-sm cursor-pointer"
          />
          <PlaceholderPill
            width={26}
            height={26}
            color="dark"
            onClick={onSecondaryClick}
            ariaLabel="Secondary action button"
            className="sm:w-8 sm:h-8 shadow-sm cursor-pointer"
          />
        </div>

        {/* Right Accent Solid Dark Circle */}
        <button
          type="button"
          onClick={onCircleClick}
          aria-label="Accent badge circle"
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-[#242424] shadow-md transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#242424] flex-shrink-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
