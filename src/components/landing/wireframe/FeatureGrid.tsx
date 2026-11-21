import React from "react";
import { FeatureCard } from "./FeatureCard";
import { FeatureCardData } from "./types";

interface FeatureGridProps {
  cards?: FeatureCardData[];
  className?: string;
  onCardClick?: (index: number) => void;
}

/**
 * FeatureGrid renders the 3 dark rounded feature cards side-by-side in the lower-right area.
 * Defaults to the original black-and-white wireframe placeholder boxes.
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({ cards, className = "", onCardClick }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 w-full h-full items-stretch ${className}`}
    >
      {[1, 2, 3].map((num, idx) => (
        <FeatureCard
          key={num}
          index={num}
          data={cards ? cards[idx] : undefined}
          onClick={() => onCardClick?.(num)}
        />
      ))}
    </div>
  );
};
