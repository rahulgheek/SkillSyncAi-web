import React from "react";
import { Link } from "react-router-dom";

interface BrandTabProps {
  brandText?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * BrandTab represents the top-left tab cut with a diagonal chamfered right edge,
 * housing the brand text.
 */
export const BrandTab: React.FC<BrandTabProps> = ({
  brandText = "SkillSync",
  className = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center h-10 sm:h-12 bg-[#d9d9d9] rounded-tl-2xl pl-4 sm:pl-5 pr-8 sm:pr-10 select-none ${className}`}
      style={{
        // Smooth angled notch matching the wireframe tab slope
        clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 100%, 0 100%)",
      }}
    >
      <Link
        to="/"
        className="text-xs sm:text-sm font-bold tracking-tight text-[#242424] hover:opacity-80 transition-opacity"
      >
        {brandText}
      </Link>
    </div>
  );
};
