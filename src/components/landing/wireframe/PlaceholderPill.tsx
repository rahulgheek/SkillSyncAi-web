import React from "react";
import { PlaceholderPillProps } from "./types";

/**
 * Reusable atomic placeholder pill component.
 * Defaults to the mockup dark color (#242424) or light color (#d9d9d9).
 */
export const PlaceholderPill: React.FC<PlaceholderPillProps> = ({
  width,
  height,
  color = "dark",
  customColor,
  className = "",
  style = {},
  animated = false,
  onClick,
  ariaLabel = "Placeholder item",
}) => {
  const bgColor = customColor || (color === "light" ? "bg-[#d9d9d9]" : "bg-[#242424]");

  const inlineStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : {}),
  };

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
      style={inlineStyle}
      className={`rounded-full transition-all duration-200 select-none ${bgColor} ${
        onClick ? "cursor-pointer hover:opacity-85 active:scale-95" : ""
      } ${animated ? "hover:scale-105" : ""} ${className}`}
    />
  );
};
