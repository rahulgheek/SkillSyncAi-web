import React from "react";

/**
 * Layered editorial backdrop: warm sky, soft hills, and an olive field. Purely
 * decorative, rendered behind the hero content.
 */
export const HeroBackdrop: React.FC = () => {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-sky" />
      <div className="hero-sun" />
      <div className="hero-cloud hero-cloud-a" />
      <div className="hero-cloud hero-cloud-b" />
      <div className="hero-cloud hero-cloud-c" />
      <div className="hero-hills">
        <div className="hero-hill hero-hill-far" />
        <div className="hero-hill hero-hill-mid" />
        <div className="hero-hill hero-hill-near" />
      </div>
      <div className="hero-field" />
      <div className="hero-grain" />
    </div>
  );
};
