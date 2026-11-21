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
      className={`relative w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px] rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden border border-[#4A121A] shadow-2xl group ${className}`}
    >
      {children || (
        <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#28090E] p-3 sm:p-4 md:p-5 flex flex-col justify-between border border-[#4A121A]/80">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#4A121A]/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A75D43] animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#EFE6D8]">
                Team Synthesis Matrix
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#EFE6D8] bg-[#4A121A] px-2.5 py-1 rounded-full border border-[#8A5A62]/50">
              Synergy: 98.4%
            </span>
          </div>

          {/* 4 Team Member Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 my-3">
            {teamRoles.map((item) => (
              <div
                key={item.role}
                className="bg-[#340C12] border border-[#4A121A] rounded-xl p-2.5 sm:p-3 flex items-center justify-between hover:border-[#8A5A62]/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-[#4A121A] border border-[#8A5A62]/40 flex items-center justify-center text-[11px] font-mono font-black text-[#EFE6D8] flex-shrink-0">
                    {item.tag}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#EFE6D8] truncate">{item.role}</div>
                    <div className="text-[10px] text-[#EFE6D8]/70 font-mono truncate">
                      {item.skills}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#D98268] pl-1">
                  {item.match}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Metric Status Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#4A121A]/80 text-[11px] font-mono text-[#EFE6D8]/75">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A75D43]" />
              <span>Hackathon Ready</span>
            </div>
            <span className="text-[#EFE6D8] font-bold">Zero Random Teams</span>
          </div>
        </div>
      )}
    </PlaceholderBox>
  );
};
