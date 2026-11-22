import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, BriefcaseIcon, LightningIcon, PeopleIcon } from "./icons";
import { ImpactStat } from "./types";

interface ImpactStatCardProps {
  stat: ImpactStat;
  className?: string;
  onClick?: () => void;
}

const ICONS = {
  lightning: LightningIcon,
  briefcase: BriefcaseIcon,
  people: PeopleIcon,
};

/**
 * Warm editorial outcome card. The large serif word gives each card a clear
 * anchor without relying on unsourced numbers.
 */
export const ImpactStatCard: React.FC<ImpactStatCardProps> = ({
  stat,
  className = "",
  onClick,
}) => {
  const Icon = ICONS[stat.iconType];

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
      aria-label={`${stat.value} - ${stat.label}`}
      className={`impact-card group ${onClick ? "is-clickable" : ""} ${className}`}
    >
      <div className="impact-card-top">
        <span className="impact-card-icon">
          <Icon className="h-5 w-5" />
        </span>
        <span className="impact-card-badge">{stat.badge}</span>
      </div>

      <div className="impact-card-body">
        <span className="impact-card-value">{stat.value}</span>
        <h3 className="impact-card-title">{stat.label}</h3>
        <p className="impact-card-copy">{stat.desc}</p>
      </div>

      <div className="impact-card-footer">
        <span className="impact-card-engine">Student outcome</span>
        <span className="impact-card-arrow">
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.article>
  );
};
