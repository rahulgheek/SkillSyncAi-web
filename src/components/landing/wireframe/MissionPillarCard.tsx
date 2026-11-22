import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  CpuIcon,
  GrowthIcon,
  ProfileIcon,
  SearchIcon,
} from "./icons";
import { MissionPillar } from "./types";

interface MissionPillarCardProps {
  pillar: MissionPillar;
  className?: string;
  onClick?: () => void;
}

const ICONS = {
  brain: CpuIcon,
  profile: ProfileIcon,
  search: SearchIcon,
  growth: GrowthIcon,
};

/**
 * Standard warm mission card. It shares the icon treatment, serif titles and
 * fine rule lines used by the showcase cards so the two sections read as one
 * system.
 */
export const MissionPillarCard: React.FC<MissionPillarCardProps> = ({
  pillar,
  className = "",
  onClick,
}) => {
  const Icon = ICONS[pillar.iconType];

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
      aria-label={pillar.title}
      className={`mission-card group ${onClick ? "is-clickable" : ""} ${className}`}
    >
      <div className="mission-card-top">
        <span className="mission-card-icon">
          <Icon className="h-5 w-5" />
        </span>
        <span className="mission-card-badge">{pillar.badge}</span>
      </div>

      <div className="mission-card-body">
        <h3 className="mission-card-title">{pillar.title}</h3>
        <p className="mission-card-copy">{pillar.description}</p>
      </div>

      <div className="mission-card-footer">
        <span className="mission-card-engine">SkillSync engine</span>
        <span className="mission-card-arrow">
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.article>
  );
};
