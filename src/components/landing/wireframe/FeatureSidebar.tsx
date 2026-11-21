import React from "react";
import { PlaceholderPill } from "./PlaceholderPill";
import { FeatureSidebarProps } from "./types";

/**
 * FeatureSidebar represents the lower-left light panel containing:
 * - Category / Tag pill at the top
 * - 2 horizontal text placeholder bars
 * - Thin horizontal divider rule
 * - 2 pill action buttons at the bottom
 */
export const FeatureSidebar: React.FC<FeatureSidebarProps> = ({
  className = "",
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <div
      className={`relative bg-[#d9d9d9] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none ${className}`}
    >
      {/* Top Tag & Content Bars */}
      <div className="space-y-2.5 sm:space-y-3 pt-1">
        {/* Top Tag Pill */}
        <PlaceholderPill
          width={48}
          height={10}
          color="dark"
          ariaLabel="Category tag pill"
          className="sm:w-14 sm:h-3 opacity-90"
        />

        {/* Text Line 1 */}
        <PlaceholderPill
          width="82%"
          height={12}
          color="dark"
          ariaLabel="Feature title bar 1"
          className="sm:h-3.5"
        />

        {/* Text Line 2 */}
        <PlaceholderPill
          width="62%"
          height={12}
          color="dark"
          ariaLabel="Feature title bar 2"
          className="sm:h-3.5 opacity-90"
        />

        {/* Thin Divider Line */}
        <div className="w-full h-[1.5px] bg-[#242424] opacity-80 my-2 sm:my-3 rounded-full" />
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 pt-2">
        <PlaceholderPill
          width={64}
          height={20}
          color="dark"
          onClick={onPrimaryClick}
          ariaLabel="Sidebar primary button"
          className="sm:w-20 sm:h-6 shadow-sm cursor-pointer"
        />
        <PlaceholderPill
          width={20}
          height={20}
          color="dark"
          onClick={onSecondaryClick}
          ariaLabel="Sidebar secondary button"
          className="sm:w-6 sm:h-6 shadow-sm cursor-pointer"
        />
      </div>
    </div>
  );
};
