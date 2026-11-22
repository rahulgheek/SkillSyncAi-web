import React from "react";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroContentCard } from "./HeroContentCard";
import { HeroMediaCard } from "./HeroMediaCard";
import { HeroTrustBar } from "./HeroTrustBar";

interface HeroSectionProps {
  className?: string;
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
  onCircleClick?: () => void;
  onMediaCardClick?: () => void;
}

/**
 * Editorial hero: oversized serif promise on the left, a cream match card and
 * the team cutout on the right, grounded by the bottom trust strip.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  className = "",
  onCtaClick,
  onSecondaryClick,
}) => {
  return (
    <div className={`hero-content ${className}`}>
      <HeroBackdrop />
      <div className="hero-stage">
        <HeroContentCard onCtaClick={onCtaClick} />
        <HeroMediaCard onClick={onSecondaryClick} />
      </div>
      <HeroTrustBar />
    </div>
  );
};
