import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BrandTab } from "./BrandTab";
import { ConsoleNavbarProps, NavItem } from "./types";

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * ConsoleNavbar represents the top header bar of the wireframe HUD window.
 * Configured with text-only navigation while maintaining the console aesthetic:
 * - BrandTab on the left with clean text logo
 * - Center text navigation links (Home, Explore, About, Contact)
 * - Right text actions (Sign In)
 */
export const ConsoleNavbar: React.FC<ConsoleNavbarProps> = ({
  brandText = "SkillSync",
  navItems = DEFAULT_NAV_ITEMS,
  rightActionText = "Sign In",
  rightActionHref = "/login",
  showToggle = false,
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
      className={`relative w-full h-10 sm:h-12 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl overflow-hidden select-none ${className}`}
    >
      {/* Left: Brand Tab with chamfered cut and text */}
      <BrandTab brandText={brandText} />

      {/* Center: Text-only navigation links */}
      <nav
        aria-label="Main navigation links"
        className="flex items-center gap-4 sm:gap-7 md:gap-9 mx-auto px-2"
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="text-xs sm:text-sm font-medium text-[#EFE6D8]/80 hover:text-[#EFE6D8] hover:bg-[#8A5A62]/20 px-2.5 py-1 rounded-md transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right: Text-only action link (with optional toggle support) */}
      <div className="flex items-center gap-3 sm:gap-4 pr-4 sm:pr-5">
        {rightActionText && (
          <Link
            to={rightActionHref}
            className="text-xs sm:text-sm font-bold text-[#EFE6D8] bg-[#A75D43] hover:bg-[#8F4E37] px-4 py-1.5 rounded-full shadow-sm transition-all"
          >
            {rightActionText}
          </Link>
        )}

        {showToggle && (
          <button
            type="button"
            onClick={handleToggle}
            aria-label="Mode toggle"
            aria-pressed={toggled}
            className="relative w-11 sm:w-13 h-5 sm:h-6 rounded-full border border-[#8A5A62] bg-[#28090E] p-0.5 flex items-center cursor-pointer transition-colors duration-200 hover:border-[#EFE6D8] focus:outline-none focus:ring-1 focus:ring-[#A75D43]"
          >
            <div
              className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-[#EFE6D8] transition-transform duration-200 ease-out shadow-sm ${
                toggled ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        )}
      </div>
    </header>
  );
};
