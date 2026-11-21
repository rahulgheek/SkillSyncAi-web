import React, { useState } from "react";
import { BrandTab } from "./BrandTab";
import { PlaceholderPill } from "./PlaceholderPill";
import { ConsoleNavbarProps } from "./types";

/**
 * ConsoleNavbar represents the top header bar of the wireframe HUD window.
 * Features:
 * - BrandTab on the left with logo pill
 * - 4 horizontal light placeholder pills evenly spaced
 * - Interactive pill toggle switch on the far right
 */
export const ConsoleNavbar: React.FC<ConsoleNavbarProps> = ({
  isToggled: controlledToggled,
  onToggle,
  className = "",
}) => {
  const [internalToggled, setInternalToggled] = useState(true);
  const toggled = controlledToggled !== undefined ? controlledToggled : internalToggled;

  const handleToggle = () => {
    const nextState = !toggled;
    if (controlledToggled === undefined) {
      setInternalToggled(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <header
      className={`relative w-full h-10 sm:h-12 bg-[#242424] flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl overflow-hidden select-none ${className}`}
    >
      {/* Left: Brand Tab with chamfered cut */}
      <BrandTab />

      {/* Center: 4 Nav link placeholder pills */}
      <nav
        aria-label="Navigation placeholder links"
        className="flex items-center gap-3 sm:gap-6 md:gap-8 mx-auto px-2"
      >
        <PlaceholderPill
          width={32}
          height={8}
          color="light"
          ariaLabel="Nav link 1"
          className="hover:opacity-100 opacity-90 transition-opacity"
        />
        <PlaceholderPill
          width={48}
          height={8}
          color="light"
          ariaLabel="Nav link 2"
          className="hover:opacity-100 opacity-90 transition-opacity"
        />
        <PlaceholderPill
          width={42}
          height={8}
          color="light"
          ariaLabel="Nav link 3"
          className="hover:opacity-100 opacity-90 transition-opacity"
        />
        <PlaceholderPill
          width={36}
          height={8}
          color="light"
          ariaLabel="Nav link 4"
          className="hover:opacity-100 opacity-90 transition-opacity"
        />
      </nav>

      {/* Right: Toggle Switch */}
      <div className="pr-3 sm:pr-4">
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Mode toggle"
          aria-pressed={toggled}
          className="relative w-11 sm:w-13 h-5 sm:h-6 rounded-full border border-[#d9d9d9] bg-transparent p-0.5 flex items-center cursor-pointer transition-colors duration-200 hover:border-white focus:outline-none focus:ring-1 focus:ring-[#d9d9d9]"
        >
          <div
            className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-[#d9d9d9] transition-transform duration-200 ease-out shadow-sm ${
              toggled ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </header>
  );
};
