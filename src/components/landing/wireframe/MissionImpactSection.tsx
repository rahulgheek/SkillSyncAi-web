import React from "react";
import { motion } from "framer-motion";
import GhostFibers from "../GhostFibers";
import { SparklesIcon } from "./icons";
import { MissionPillarCard } from "./MissionPillarCard";
import { MissionImpactSectionProps, MissionPillar } from "./types";
import "./mission.css";

const DEFAULT_PILLARS: MissionPillar[] = [
  {
    id: "matching",
    title: "AI-Powered Matching",
    description:
      "Autonomous skill synthesis pairing complementary developers, designers, and innovators for hackathon dominance.",
    badge: "01 / Match",
    iconType: "brain",
  },
  {
    id: "profiles",
    title: "Smart Profiles",
    description:
      "Gemini-extracted developer identities highlighting verified competencies, past submissions, and strengths.",
    badge: "02 / Identity",
    iconType: "profile",
  },
  {
    id: "discovery",
    title: "Project Discovery",
    description:
      "Real-time visibility into open hackathon teams, active project squads, and trending high-impact build ideas.",
    badge: "03 / Explore",
    iconType: "search",
  },
  {
    id: "growth",
    title: "Career Growth",
    description:
      "Convert weekend competition wins into career-defining milestones with adaptive learning roadmaps and job prep.",
    badge: "04 / Trajectory",
    iconType: "growth",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/**
 * Mission panel in the warm editorial language. The landscape reverses here:
 * the showcase's olive field carries across the seam, lifts into cream, and
 * settles into a cool sky. GhostFibers adds ambient motion behind a normal
 * four-card grid, keeping the content readable and consistent with the rest
 * of the landing page.
 */
export const MissionImpactSection: React.FC<MissionImpactSectionProps> = ({
  badge = "The mission",
  titlePrefix = "We help students",
  highlightText = "discover the joy of seamless hackathons",
  titleSuffix = "and grow into top developers.",
  subtitle = "Four connected systems that turn a scattered campus into a network of complementary builders, ready to ship together.",
  pillars = DEFAULT_PILLARS,
  className = "",
  onPillarClick,
}) => {
  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className={`mission-section ${className}`}
    >
      <div className="mission-backdrop" aria-hidden="true">
        <span className="mission-grain" />
      </div>

      <div className="mission-fibers" aria-hidden="true">
        <GhostFibers
          glowColor="#8a5a3f"
          layers={3}
          twist={1.2}
          threads={72}
          fiberStyle="dots"
          depthOfField={0.85}
          hoverEffect="focus"
          intro
          mouseInteraction
          lineColor="#6b5747"
          secondaryColor="#8f9474"
          gradient="depth"
          waves={1}
          volume={0.7}
          spread={1}
          scale={1}
          rotation={18}
          perspective={0.65}
          density={1}
          thickness={1}
          tips={0}
          foldGlow={1}
          speed={0.5}
          flow={0.4}
          rollSpeed={0.15}
          focusDepth={0}
          particles={0.4}
          sparkle={0.4}
          glow={0.7}
          brightness={1}
          vignette={0.3}
          grain={0.06}
          mouseStrength={1}
          pulseOnClick
          lightMode
        />
      </div>

      <div className="mission-inner">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mission-header"
        >
          <span className="mission-eyebrow">
            <SparklesIcon className="h-3 w-3" />
            {badge}
          </span>

          <h2 id="mission-title" className="mission-title">
            {titlePrefix}{" "}
            <span className="mission-title-accent">{highlightText}</span>{" "}
            {titleSuffix}
          </h2>

          <p className="mission-subtitle">{subtitle}</p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mission-grid"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.id} variants={cardVariants} className="mission-card-wrap">
              <MissionPillarCard
                pillar={pillar}
                onClick={() => onPillarClick?.(pillar.id)}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="mission-values"
        >
          <span>
            <span className="mission-dot mission-dot-a" aria-hidden="true" />
            One profile
          </span>
          <span>
            <span className="mission-dot mission-dot-b" aria-hidden="true" />
            Every opportunity
          </span>
          <span>
            <span className="mission-dot mission-dot-c" aria-hidden="true" />
            Built for students
          </span>
          <span>
            <span className="mission-dot mission-dot-d" aria-hidden="true" />
            Zero random teams
          </span>
        </motion.div>
      </div>
    </section>
  );
};
