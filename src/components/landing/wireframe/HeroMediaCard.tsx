import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, CpuIcon, FileTextIcon, PeopleIcon } from "./icons";
import { HeroMediaCardProps } from "./types";

const MATCH_CRITERIA = [
  { label: "Verified skills", Icon: CpuIcon },
  { label: "Shipped projects", Icon: FileTextIcon },
  { label: "Working style", Icon: PeopleIcon },
];

/**
 * Editorial hero visual: cream match card and the team cutout. The card only
 * describes how matching works; it never displays invented user metrics.
 */
export const HeroMediaCard: React.FC<HeroMediaCardProps> = ({
  className = "",
  onClick,
}) => {
  return (
    <div className={`hero-visual ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
        className="hero-info-card"
      >
        <div className="hero-card-top">
          <span className="hero-tag">Skills</span>
          <span className="hero-tag">Projects</span>
          <span className="hero-tag">Chemistry</span>
          <span className="hero-tag hero-tag-dark">AI</span>
        </div>

        <div className="hero-card-body">
          <div>
            <h2 className="hero-card-title">
              Great teams
              <br />
              aren&apos;t random.
            </h2>
            <p className="hero-card-copy">
              We match student builders by verified skills, shipped projects, and how they
              like to work.
            </p>
            <Link
              to="/about"
              onClick={onClick}
              className="hero-card-link"
              aria-label="See how SkillSync matching works"
            >
              See how matching works
              <span className="hero-card-link-icon">
                <ArrowUpRightIcon className="h-3 w-3" />
              </span>
            </Link>
          </div>

          <div className="hero-criteria" aria-hidden="true">
            {MATCH_CRITERIA.map(({ label, Icon }) => (
              <div key={label} className="hero-criteria-row">
                <span className="hero-criteria-icon">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.38, ease: "easeOut" }}
        className="hero-team-wrap"
      >
        <div className="hero-team-shadow" aria-hidden="true" />
        <img
          src="/team.png"
          alt="Six SkillSync student builders standing together at a hackathon"
          width={577}
          height={433}
          loading="eager"
          fetchPriority="high"
          className="hero-team-image"
        />
      </motion.div>
    </div>
  );
};
