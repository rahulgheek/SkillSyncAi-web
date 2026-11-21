import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { HeroMediaCardProps } from "./types";

/**
 * HeroMediaCard represents the large dark placeholder rectangle on the upper right,
 * functioning as the hero image/video/graphic showcase.
 */
export const HeroMediaCard: React.FC<HeroMediaCardProps> = ({
  className = "",
  onClick,
  children,
}) => {
  return (
    <PlaceholderBox
      color="dark"
      interactive
      onClick={onClick}
      ariaLabel="Hero media visual card"
      className={`relative w-full h-full min-h-[200px] sm:min-h-[260px] md:min-h-[300px] rounded-2xl sm:rounded-3xl p-4 flex items-center justify-center overflow-hidden border border-neutral-800/40 shadow-inner group ${className}`}
    >
      {children || (
        <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#1e1e21] flex items-center justify-center transition-all duration-300 group-hover:bg-[#222226]">
          {/* Subtle placeholder cross/grid line styling (ready for future content replacement) */}
          <div className="w-12 h-12 rounded-full border border-neutral-700/30 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
            <div className="w-4 h-4 rounded-full bg-neutral-600/40" />
          </div>
        </div>
      )}
    </PlaceholderBox>
  );
};
