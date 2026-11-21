import React from "react";

interface StaggeredHeaderProps {
  badge?: string;
  title?: string;
  description?: string;
  highlightText?: string;
  className?: string;
}

/**
 * StaggeredHeader renders the top of the second wireframe section:
 * - Top-left small badge/tag pill
 * - Left-aligned main title inside a sleek dark capsule
 * - Staggered right-shifted description capsule replicating the wireframe geometry
 */
export const StaggeredHeader: React.FC<StaggeredHeaderProps> = ({
  badge = "02 / Core Capability",
  title = "Smart Team Assembly",
  description = "Our AI analyzes student skill sets, project history, and behavioral traits to construct perfectly balanced, highly competitive teams tailored for specific hackathon requirements.",
  highlightText = "No more random teaming.",
  className = "",
}) => {
  return (
    <header className={`w-full select-none ${className}`}>
      {/* Top Tag / Category Pill */}
      <div className="mb-3 sm:mb-4">
        <div className="inline-flex items-center gap-2 bg-[#242424] text-[#d9d9d9] px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm border border-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {badge}
        </div>
      </div>

      {/* Main Headline Bar 1 (Left-aligned dark capsule) */}
      <div className="w-full flex justify-start">
        <div className="bg-[#242424] text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg inline-flex items-center gap-3 border border-neutral-800 transition-transform duration-300 hover:scale-[1.01]">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white m-0">
            {title}
          </h2>
        </div>
      </div>

      {/* Staggered Headline Bar 2 (Right-shifted dark capsule) */}
      <div className="w-full flex justify-end mt-2.5 sm:mt-3.5 pr-0 sm:pr-4 md:pr-8">
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[68%] bg-[#242424] text-[#d9d9d9] rounded-2xl sm:rounded-full px-5 sm:px-8 py-3.5 sm:py-4 shadow-lg border border-neutral-800 flex items-center transition-transform duration-300 hover:scale-[1.01]">
          <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-medium leading-relaxed m-0">
            {description}{" "}
            {highlightText && (
              <span className="text-white font-bold whitespace-nowrap">{highlightText}</span>
            )}
          </p>
        </div>
      </div>
    </header>
  );
};
