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
    <main
      role="region"
      aria-label="Wireframe preview console"
      className={`relative z-10 w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] bg-[#242424] rounded-2xl sm:rounded-3xl md:rounded-[36px] p-2.5 sm:p-4 md:p-6 border-[4px] sm:border-[6px] md:border-[8px] border-[#242424] shadow-2xl shadow-neutral-950/40 flex flex-col justify-between gap-3 sm:gap-4 md:gap-5 select-none ${className}`}
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
  );
};
