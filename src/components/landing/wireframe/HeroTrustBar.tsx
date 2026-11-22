import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "./icons";

const SKILL_CARDS = [
  { label: "React", className: "hero-skill-card-1" },
  { label: "Python", className: "hero-skill-card-2" },
  { label: "Figma", className: "hero-skill-card-3" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

/**
 * Bottom editorial strip: a proof-first statement, a decorative serif mark,
 * and the closing promise. No invented statistics are shown.
 */
export const HeroTrustBar: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="hero-trust"
    >
      <motion.div variants={itemVariants} className="hero-materials">
        <div className="hero-materials-copy-wrap">
          <h2 className="hero-materials-title">Built on proof, not promises.</h2>
          <p className="hero-materials-copy">
            Every profile is backed by real projects and verified skills.
          </p>
        </div>
        <div className="hero-skill-stack" aria-hidden="true">
          {SKILL_CARDS.map((card) => (
            <div key={card.label} className={`hero-skill-card ${card.className}`}>
              {card.label}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="hero-mark">
        <p className="hero-mark-glyph" aria-hidden="true">
          &amp;
        </p>
        <p className="hero-mark-label">Skills meet chemistry</p>
      </motion.div>

      <motion.div variants={itemVariants} className="hero-statement">
        <p className="hero-statement-text">
          We build teams
          <br />
          that build things.
        </p>
        <Link to="/about" className="hero-statement-link">
          Why SkillSync
          <ArrowUpRightIcon className="h-3 w-3" />
        </Link>
      </motion.div>
    </motion.div>
  );
};
