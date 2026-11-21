import React from "react";
import { HeroContentCard } from "./HeroContentCard";
import { HeroMediaCard } from "./HeroMediaCard";

interface HeroSectionProps {
  className?: string;
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
  onCircleClick?: () => void;
  onMediaCardClick?: () => void;
}

/**
 * HeroSection orchestrates the upper half of the wireframe HUD window:
 * - Left: HeroContentCard with diagonal notched bottom edge
 * - Right: HeroMediaCard placeholder
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  className = "",
  onCtaClick,
  onSecondaryClick,
  onCircleClick,
  onMediaCardClick,
}) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 md:gap-4 w-full flex-1 items-stretch ${className}`}
    >
      {/* Left Column: Hero Content Panel with chamfered notch */}
      <div className="lg:col-span-7 flex flex-col">
        <HeroContentCard
          onCtaClick={onCtaClick}
          onSecondaryClick={onSecondaryClick}
          onCircleClick={onCircleClick}
          className="rounded-b-2xl sm:rounded-b-none h-full shadow-sm"
          // Stepped bottom edge: horizontal on left, 45deg slope down to right to hold circle
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 68% 100%, 54% calc(100% - 18px), 0 calc(100% - 18px))",
          }}
        />
      </div>

      {/* Right Column: Hero Media Placeholder Card */}
      <div className="lg:col-span-5 flex flex-col">
        <HeroMediaCard onClick={onMediaCardClick} />
      </div>
    </div>
  );
};
