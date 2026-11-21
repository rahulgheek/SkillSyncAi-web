import React from "react";
import { PlaceholderPill } from "./PlaceholderPill";

interface BrandTabProps {
  className?: string;
  onClick?: () => void;
}

/**
 * BrandTab represents the top-left tab cut with a diagonal chamfered right edge,
 * housing the dark rounded brand/logo pill.
 */
export const BrandTab: React.FC<BrandTabProps> = ({ className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center h-10 sm:h-12 bg-[#d9d9d9] rounded-tl-2xl pl-4 sm:pl-5 pr-8 sm:pr-10 select-none ${className}`}
      style={{
        // Smooth angled notch matching the wireframe tab slope
        clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 100%, 0 100%)",
      }}
    >
      <PlaceholderPill
        width={56}
        height={22}
        color="dark"
        ariaLabel="Brand logo"
        className="shadow-sm"
      />
    </div>
  );
};
