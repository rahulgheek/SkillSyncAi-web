import React from "react";
import { PlaceholderBox } from "./PlaceholderBox";
import { HeroMediaCardProps } from "./types";

/**
 * HeroMediaCard visually models the Smart Team Assembly engine:
 * - 4-role competency matrix
 * - Real-time team balance & synergy scoring (98%)
 * - Dark terminal wireframe styling
 */
export const HeroMediaCard: React.FC<HeroMediaCardProps> = ({
  className = "",
  onClick,
  children,
}) => {
  const teamRoles = [
    {
      role: "Frontend Lead",
      skills: "React, Tailwind, State",
      match: "99%",
      tag: "FE",
    },
    {
      role: "Backend Architect",
      skills: "Node.js, PostgreSQL, Auth",
      match: "97%",
      tag: "BE",
    },
    {
      role: "AI / ML Specialist",
      skills: "Gemini API, LangChain, Python",
      match: "98%",
      tag: "AI",
    },
    {
      role: "UI/UX & Product",
      skills: "Design Systems, Prototyping",
      match: "96%",
      tag: "UX",
    },
  ];

  return (
    <PlaceholderBox
      color="dark"
      interactive
      onClick={onClick}
      ariaLabel="Smart Team Assembly engine preview"
      className={`relative w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px] rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden border border-neutral-800 shadow-2xl group ${className}`}
    >
      {children || (
        <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#1a1a1c] p-3 sm:p-4 md:p-5 flex flex-col justify-between border border-neutral-800/80">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#d9d9d9]">
                Team Synthesis Matrix
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#d9d9d9] bg-[#2a2a2e] px-2.5 py-1 rounded-full border border-neutral-700">
              Synergy: 98.4%
            </span>
          </div>

          {/* 4 Team Member Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 my-3">
            {teamRoles.map((item) => (
              <div
                key={item.role}
                className="bg-[#242426] border border-neutral-800 rounded-xl p-2.5 sm:p-3 flex items-center justify-between hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-[#303036] flex items-center justify-center text-[11px] font-mono font-black text-[#d9d9d9] flex-shrink-0">
                    {item.tag}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#d9d9d9] truncate">{item.role}</div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate">
                      {item.skills}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 pl-1">
                  {item.match}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Metric Status Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d9d9d9]" />
              <span>Hackathon Ready</span>
            </div>
            <span className="text-[#d9d9d9] font-bold">Zero Random Teams</span>
          </div>
        </div>
      )}
    </PlaceholderBox>
  );
};
