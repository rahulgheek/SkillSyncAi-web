import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "./icons";
import { ImpactStatCard } from "./ImpactStatCard";
import { HackathonImpactSectionProps, ImpactStat } from "./types";
import "./impact.css";

const DEFAULT_IMPACT_STATS: ImpactStat[] = [
  {
    id: "tech-learning",
    value: "Learn",
    label: "Ship to learn",
    desc: "Hackathons are the fastest way to pick up a new stack.",
    badge: "Skill acceleration",
    iconType: "lightning",
  },
  {
    id: "interview-prep",
    value: "Build",
    label: "Proof over practice",
    desc: "Real-world projects stand out more than another practice set.",
    badge: "Career ROI",
    iconType: "briefcase",
  },
  {
    id: "connections",
    value: "Belong",
    label: "Find your people",
    desc: "Meet co-founders, mentors, and lifelong friends.",
    badge: "Network growth",
    iconType: "people",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

/**
 * Editorial impact section. The old numeric claims are replaced with three
 * honest outcomes: learning by shipping, proof of work, and community.
 */
export const HackathonImpactSection: React.FC<HackathonImpactSectionProps> = ({
  badge = "Why it matters",
  titlePrefix = "The true",
  highlightText = "impact",
  titleSuffix = "of hackathons.",
  subtitle = "It's not just about winning prizes. It's about building a portfolio, accelerating your career, and finding your tribe in the tech ecosystem.",
  stats = DEFAULT_IMPACT_STATS,
  className = "",
  onStatClick,
}) => {
  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className={`impact-section ${className}`}
    >
      <div className="impact-backdrop" aria-hidden="true">
        <span className="impact-sun" />
        <span className="impact-hills" />
        <span className="impact-grain" />
      </div>

      <div className="impact-inner">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="impact-header"
        >
          <span className="impact-eyebrow">
            <SparklesIcon className="h-3 w-3" />
            {badge}
          </span>

          <h2 id="impact-title" className="impact-title">
            {titlePrefix} <span className="impact-title-accent">{highlightText}</span>{" "}
            {titleSuffix}
          </h2>

          <p className="impact-subtitle">{subtitle}</p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="impact-grid"
        >
          {stats.map((stat) => (
            <motion.div key={stat.id} variants={cardVariants} className="impact-card-wrap">
              <ImpactStatCard
                stat={stat}
                onClick={() => onStatClick?.(stat.id)}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="impact-note"
        >
          The outcome is the portfolio, the people, and the proof you can ship.
        </motion.p>
      </div>
    </section>
  );
};
