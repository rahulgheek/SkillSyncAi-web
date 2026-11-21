import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { ImpactStat } from "./types";

interface ImpactStatCardProps {
  stat: ImpactStat;
  className?: string;
  onClick?: () => void;
}

/**
 * Bootstrap Icon SVGs strictly adhering to .agents/skills/frontend/SKILL.md
 */
const renderStatIcon = (type: ImpactStat["iconType"]) => {
  switch (type) {
    case "lightning":
      // bi-lightning-charge
      return (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z" />
        </svg>
      );
    case "briefcase":
      // bi-briefcase
      return (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5" />
        </svg>
      );
    case "people":
      // bi-people
      return (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.004-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
      );
  }
};

/**
 * ImpactStatCard represents one of the three large metric cards:
 * 80% (Learn a new technology), 3x (Faster Interview Prep), 10k+ (Connections Made)
 */
export const ImpactStatCard: React.FC<ImpactStatCardProps> = ({
  stat,
  className = "",
  onClick,
}) => {
  return (
    <PlaceholderBox
      color="dark"
      interactive
      onClick={onClick}
      ariaLabel={`${stat.value} - ${stat.label}`}
      className={`relative w-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-neutral-800 shadow-xl group hover:-translate-y-2 transition-all duration-300 ${className}`}
    >
      <div className="w-full flex flex-col justify-between gap-6">
        {/* Top: Icon + Badge */}
        <div className="flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#1a1a1c] border border-neutral-800 flex items-center justify-center text-[#d9d9d9] group-hover:text-white group-hover:scale-105 group-hover:border-neutral-700 transition-all shadow-md">
            {renderStatIcon(stat.iconType)}
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-[#1c1c1f] px-3 py-1 rounded-full border border-neutral-800">
            {stat.badge}
          </span>
        </div>

        {/* Middle: Big Stat & Title */}
        <div className="space-y-2 pt-2">
          <div className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono leading-none">
            {stat.value}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#d9d9d9] tracking-tight leading-snug m-0 group-hover:text-white transition-colors">
            {stat.label}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed m-0 pt-1">
            {stat.desc}
          </p>
        </div>

        {/* Bottom Detail Ledge */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-500">
          <span>Verified Student Outcome</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
        </div>
      </div>
    </PlaceholderBox>
  );
};
