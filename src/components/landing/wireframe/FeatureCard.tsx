import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { FeatureCardProps } from "./types";

/**
 * FeatureCard represents one of the three dark rounded cards in the bottom row.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  index = 1,
  className = "",
  onClick,
  children,
}) => {
  return (
    <PlaceholderBox
      color="dark"
      interactive
      onClick={onClick}
      ariaLabel={`Feature card ${index}`}
      className={`relative w-full aspect-[4/4.5] sm:aspect-square md:aspect-[4/4.8] rounded-xl sm:rounded-2xl p-3 flex flex-col justify-between overflow-hidden border border-neutral-800/40 shadow-inner group ${className}`}
    >
      {children || (
        <div className="w-full h-full rounded-lg sm:rounded-xl bg-[#1e1e21] flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-[#222226]">
          {/* Internal placeholder mark (can be easily customized/replaced later) */}
          <div className="w-8 h-8 rounded-lg border border-neutral-700/30 flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
            <div className="w-2.5 h-2.5 rounded-sm bg-neutral-600/40" />
          </div>
        </div>
      )}
    </PlaceholderBox>
  );
};
