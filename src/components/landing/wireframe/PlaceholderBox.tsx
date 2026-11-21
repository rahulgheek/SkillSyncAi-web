import React from "react";
import { PlaceholderBoxProps } from "./types";

/**
 * Reusable atomic placeholder box component for cards and rectangular areas.
 */
export const PlaceholderBox: React.FC<PlaceholderBoxProps> = ({
  children,
  className = "",
  style = {},
  color = "dark",
  interactive = false,
  onClick,
  ariaLabel = "Placeholder box",
}) => {
  const bgClass = color === "light" ? "bg-[#d9d9d9]" : "bg-[#242424]";

  return (
    <div
      role={onClick ? "button" : "presentation"}
      tabIndex={onClick ? 0 : -1}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      style={style}
      className={`rounded-2xl transition-all duration-300 select-none ${bgClass} ${
        interactive || onClick
          ? "cursor-pointer hover:brightness-110 hover:shadow-lg active:scale-[0.99]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
