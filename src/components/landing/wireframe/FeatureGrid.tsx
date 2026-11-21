import React from "react";
import { FeatureCard } from "./FeatureCard";

interface FeatureGridProps {
  className?: string;
  onCardClick?: (index: number) => void;
}

/**
 * FeatureGrid renders the 3 dark rounded feature cards side-by-side in the lower-right area.
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({ className = "", onCardClick }) => {
  return (
    <div
      className={`grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 w-full h-full items-stretch ${className}`}
    >
      <FeatureCard index={1} onClick={() => onCardClick?.(1)} />
      <FeatureCard index={2} onClick={() => onCardClick?.(2)} />
      <FeatureCard index={3} onClick={() => onCardClick?.(3)} />
    </div>
  );
};
