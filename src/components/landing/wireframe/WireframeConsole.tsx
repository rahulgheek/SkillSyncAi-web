import React, { useState } from "react";
import { ConsoleNavbar } from "./ConsoleNavbar";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { WireframeConsoleProps } from "./types";

/**
 * WireframeConsole represents the full interactive HUD wireframe console.
 * Replicates the black-and-white placeholder layout with pixel-accurate
 * proportions, chamfered tabs, stepped dividers, and modular sub-components.
 */
export const WireframeConsole: React.FC<WireframeConsoleProps> = ({
  className = "",
  interactive = true,
}) => {
  const [isToggled, setIsToggled] = useState(true);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#ebebec] via-[#e2e2e5] to-[#d8d8dc] flex items-center justify-center p-3 sm:p-6 md:p-10 lg:p-14 overflow-hidden select-none">
      {/* Decorative dark background curve in top-left as seen in mockup */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 sm:-top-32 sm:-left-32 w-72 sm:w-96 md:w-[480px] h-72 sm:h-96 md:h-[480px] rounded-full bg-[#242424] opacity-95 blur-[1px]"
      />

      {/* Main Console Container */}
      <main
        role="region"
        aria-label="Wireframe preview console"
        className={`relative z-10 w-full max-w-5xl xl:max-w-6xl bg-[#242424] rounded-3xl sm:rounded-[32px] md:rounded-[36px] p-2.5 sm:p-3.5 md:p-4 border-[4px] sm:border-[6px] md:border-[7px] border-[#242424] shadow-2xl shadow-neutral-900/25 flex flex-col gap-2.5 sm:gap-3 md:gap-3.5 ${className}`}
      >
        {/* 1. Header / Navbar */}
        <ConsoleNavbar isToggled={isToggled} onToggle={interactive ? setIsToggled : undefined} />

        {/* 2. Hero Section (Top Half) */}
        <HeroSection />

        {/* 3. Features Section (Bottom Half) */}
        <FeaturesSection />

        {/* 4. Bottom Frame Ledge / Footer bar indicator */}
        <footer
          aria-hidden="true"
          className="w-full h-1 sm:h-1.5 bg-[#242424] rounded-full opacity-60"
        />
      </main>
    </div>
  );
};
