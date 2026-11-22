import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "./icons";
import { HeroContentCardProps } from "./types";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const headlineVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const lineVariants = {
  hidden: { y: "110%" },
  show: {
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/**
 * Hero copy: oversized editorial headline, slash subtitle, and primary action.
 */
export const HeroContentCard: React.FC<HeroContentCardProps> = ({
  className = "",
  onCtaClick,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`hero-copy ${className}`}
    >
      <motion.h1
        variants={headlineVariants}
        aria-label="The right team"
        className="hero-headline"
      >
        <span className="hero-line">
          <motion.span variants={lineVariants}>The</motion.span>
        </span>
        <span className="hero-line">
          <motion.span variants={lineVariants}>Right</motion.span>
        </span>
        <span className="hero-line">
          <motion.span variants={lineVariants}>
            Team
            <span className="hero-reg" aria-hidden="true">
              &reg;
            </span>
          </motion.span>
        </span>
      </motion.h1>

      <motion.p variants={itemVariants} className="hero-subtitle">
        <span className="hero-subtitle-slash">/</span>
        We assemble teams that ship
        <span className="hero-subtitle-slash">/</span>
      </motion.p>

      <motion.div variants={itemVariants}>
        <Link to="/register" onClick={onCtaClick} className="hero-cta">
          Find my team
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
};
