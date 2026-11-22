import React from "react";
import { ConsoleNavbar } from "./ConsoleNavbar";
import { HeroSection } from "./HeroSection";
import { WireframeConsoleProps } from "./types";

/**
 * Landing hero shell: a fixed editorial navigation above a full-bleed hero
 * panel. The page background stays plain white outside the hero.
 */
export const WireframeConsole: React.FC<WireframeConsoleProps> = ({ className = "" }) => {
  return (
    <div className={`hero-editorial ${className}`}>
      <ConsoleNavbar />
      <section aria-label="SkillSync introduction" className="hero-shell">
        <div className="hero-panel">
          <HeroSection />
        </div>
      </section>
    </div>
  );
};
