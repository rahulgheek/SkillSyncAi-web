import React from "react";
import { FeatureSidebar } from "./FeatureSidebar";
import { FeatureGrid } from "./FeatureGrid";

interface FeaturesSectionProps {
  className?: string;
  onSidebarPrimaryClick?: () => void;
  onSidebarSecondaryClick?: () => void;
  onCardClick?: (index: number) => void;
}

/**
 * FeaturesSection orchestrates the lower half of the wireframe HUD window:
 * - Left: FeatureSidebar with matching chamfered top edge
 * - Right: FeatureGrid with 3 dark rounded feature cards
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  className = "",
  onSidebarPrimaryClick,
  onSidebarSecondaryClick,
  onCardClick,
}) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 md:gap-4 w-full items-stretch ${className}`}
    >
      {/* Left Column: Feature Sidebar with interlocking chamfered top edge */}
      <div className="lg:col-span-4 flex flex-col">
        <FeatureSidebar
          onPrimaryClick={onSidebarPrimaryClick}
          onSecondaryClick={onSidebarSecondaryClick}
          className="rounded-t-2xl sm:rounded-t-none rounded-b-2xl h-full shadow-sm"
          // Interlocking top edge: higher on left, slopes down towards right
          style={{
            clipPath: "polygon(0 0, 78% 0, 94% 18px, 100% 18px, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Right Column: 3 Feature Cards */}
      <div className="lg:col-span-8 flex items-center">
        <FeatureGrid onCardClick={onCardClick} />
      </div>
    </div>
  );
};
