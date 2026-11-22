import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, ChartIcon, FileTextIcon, GrowthIcon } from "./icons";
import { TONES } from "./tones";
import { FeatureCardProps } from "./types";

const CARD_ICONS = [FileTextIcon, ChartIcon, GrowthIcon];

/**
 * Colourful capability card used in the "three moves" section.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  index = 1,
  data,
  tone = "violet",
  className = "",
  onClick,
  children,
}) => {
  const palette = TONES[tone];
  const Icon = CARD_ICONS[(index - 1) % CARD_ICONS.length];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={data?.title ? `${data.title} capability` : `Feature ${index}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-white/[0.035] p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors duration-300 hover:border-white/20 sm:p-7 ${palette.glow} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${palette.gradient} opacity-70`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full ${palette.bg} blur-3xl`}
      />

      {children || (
        <>
          <div className="relative flex items-start justify-between gap-3">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${palette.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span
              aria-hidden="true"
              className="landing-display text-4xl font-extrabold leading-none text-white/[0.07]"
            >
              0{index}
            </span>
          </div>

          <div className="relative mt-7 flex flex-1 flex-col">
            {data?.badge && (
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border ${palette.border} ${palette.bg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${palette.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
                {data.badge}
              </span>
            )}

            <h3 className="landing-display mt-4 text-xl font-bold leading-snug tracking-tight text-white sm:text-[22px]">
              {data?.title || `Feature ${index}`}
            </h3>
            <p className="mt-2.5 text-sm font-medium leading-relaxed text-[#A7A9C7]">
              {data?.description}
            </p>
          </div>

          <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              {data?.tag || `0${index} / Core`}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold ${palette.text} transition-transform duration-300 group-hover:translate-x-0.5`}
            >
              Learn more
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </span>
          </div>
        </>
      )}
    </motion.article>
  );
};
