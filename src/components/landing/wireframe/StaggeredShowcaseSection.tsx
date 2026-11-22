import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseIcon,
  ChartIcon,
  CheckIcon,
  CpuIcon,
  FileTextIcon,
  GrowthIcon,
  PeopleIcon,
  SparklesIcon,
} from "./icons";
import { StaggeredCardData, StaggeredShowcaseSectionProps } from "./types";
import "./showcase.css";

const DEFAULT_SHOWCASE_CARDS: StaggeredCardData[] = [
  {
    tag: "01 / Parsing",
    title: "AI Resume Parsing",
    description:
      "Upload your resume and let our Gemini-powered AI instantly extract your core skills, strengths, and experience with zero manual entry.",
    badge: "Instant extraction",
  },
  {
    tag: "02 / Analytics",
    title: "Deep AI Insights",
    description:
      "Get comprehensive analytics on your profile. Identify skill gaps and discover your unique competitive advantages in the tech landscape.",
    badge: "Gap analysis",
  },
  {
    tag: "03 / Roadmap",
    title: "Dynamic Career Roadmap",
    description:
      "Stop guessing your next steps. Generate a personalized, step-by-step learning path based on your dream roles and current skill level.",
    badge: "Adaptive path",
  },
];

const NETWORK_CHIPS = [
  { label: "Resume", Icon: FileTextIcon },
  { label: "Skills", Icon: CpuIcon },
  { label: "Projects", Icon: BriefcaseIcon },
  { label: "Team", Icon: PeopleIcon },
];

const CARD_ICONS = [FileTextIcon, ChartIcon, GrowthIcon];
const CARD_LINKS = ["/register", "/explore", "/register"];
const CARD_CTA = ["Parse my resume", "Explore projects", "Build my roadmap"];

const CONNECTOR_PATHS = [
  "M 0 96 H 330 V 150 H 462",
  "M 0 204 H 330 V 150",
  "M 1200 96 H 870 V 150 H 738",
  "M 1200 204 H 870 V 150",
  "M 600 186 V 268",
];

const headerVariants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const networkVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.78, y: 18 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14, delay: 0.16 },
  },
};

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (index: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, delay: 0.3 + index * 0.08, ease: "easeInOut" as const },
  }),
};

const cardsVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 70, rotateX: 14, rotateY: 0, rotateZ: 0 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: index === 0 ? 3.4 : index === 2 ? -3.4 : 0,
    rotateZ: index === 0 ? -1.7 : index === 2 ? 1.7 : 0,
    transition: {
      type: "spring" as const,
      stiffness: 85,
      damping: 16,
      delay: index * 0.08,
    },
  }),
};

const CardMockup: React.FC<{ index: number }> = ({ index }) => {
  if (index % 3 === 0) {
    return (
      <div className="how-mock-resume">
        <div className="how-resume-sheet">
          <span className="how-resume-bar how-resume-bar-lg" />
          <span className="how-resume-bar" />
          <span className="how-resume-bar how-resume-bar-sm" />
          <div className="how-resume-chips">
            <span>React</span>
            <span>Python</span>
            <span>Figma</span>
          </div>
        </div>
        <span className="how-mock-badge">
          <CheckIcon className="h-2.5 w-2.5" />
          Parsed
        </span>
      </div>
    );
  }

  if (index % 3 === 1) {
    return (
      <div className="how-mock-insights">
        <div className="how-insight-head">
          <span>Skill profile</span>
          <span className="how-insight-dot" />
        </div>
        <div className="how-bars">
          {[54, 78, 42, 66].map((height, barIndex) => (
            <span key={barIndex} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="how-insight-labels">
          <span>Skills</span>
          <span>Projects</span>
          <span>Gaps</span>
        </div>
      </div>
    );
  }

  return (
    <div className="how-mock-roadmap">
      {["Learn", "Build", "Ship"].map((step, stepIndex) => (
        <div
          key={step}
          className={`how-roadmap-step ${stepIndex === 0 ? "is-active" : ""}`}
        >
          <span className="how-roadmap-dot">{stepIndex + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

const ShowcaseCard: React.FC<{
  card: StaggeredCardData;
  index: number;
  onCardClick?: (index: number) => void;
}> = ({ card, index, onCardClick }) => {
  const Icon = CARD_ICONS[index % CARD_ICONS.length];

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      whileHover={{ y: -8, rotateX: 0, rotateY: 0, rotateZ: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`how-card how-card-${(index % 3) + 1}`}
    >
      <div className="how-card-top">
        <span className="how-card-icon">
          <Icon className="h-4 w-4" />
        </span>
        <span className="how-card-tag">{card.tag}</span>
      </div>

      <h3 className="how-card-title">{card.title}</h3>
      <p className="how-card-copy">{card.description}</p>

      <div className="how-card-mock" aria-hidden="true">
        <CardMockup index={index} />
      </div>

      <Link
        to={CARD_LINKS[index % CARD_LINKS.length]}
        onClick={() => onCardClick?.(index + 1)}
        className="how-card-link"
      >
        {CARD_CTA[index % CARD_CTA.length]}
        <ArrowUpRightIcon className="h-3 w-3" />
      </Link>
    </motion.article>
  );
};

/**
 * "How it works" section, modelled on the reference reel: a central SkillSync
 * pill connected to four source chips, with three fanned capability cards.
 * The warm sky/field backdrop keeps it in the same world as the hero.
 */
export const StaggeredShowcaseSection: React.FC<StaggeredShowcaseSectionProps> = ({
  cards = DEFAULT_SHOWCASE_CARDS,
  className = "",
  onCardClick,
}) => {
  return (
    <section
      id="features"
      aria-labelledby="how-title"
      className={`how-section ${className}`}
    >
      <div className="how-backdrop" aria-hidden="true">
        <span className="how-sun" />
        <span className="how-hills" />
      </div>

      <div className="how-inner">
        <motion.header
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="how-header"
        >
          <span className="how-eyebrow">
            <SparklesIcon className="h-3 w-3" />
            How it works
          </span>

          <h2 id="how-title" className="how-title">
            From resume to <span className="how-title-accent">dream team</span> in three
            moves.
          </h2>

          <p className="how-subtitle">
            No spreadsheets, no group-chat chaos. SkillSync turns your profile into a
            living map of what you can build and who you should build it with.
          </p>

          <div className="how-actions">
            <Link to="/register" className="how-cta">
              Start building
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
            <Link to="/explore" className="how-secondary">
              Explore projects
              <ArrowUpRightIcon className="h-3 w-3" />
            </Link>
          </div>
        </motion.header>

        <motion.div
          variants={networkVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="how-network"
        >
          <svg
            className="how-connectors"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {CONNECTOR_PATHS.map((path, index) => (
              <motion.path
                key={path}
                d={path}
                custom={index}
                variants={pathVariants}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <circle cx="330" cy="150" r="2.5" />
            <circle cx="870" cy="150" r="2.5" />
            <circle cx="600" cy="268" r="2.5" />
          </svg>

          <div className="how-chips how-chips-left">
            {NETWORK_CHIPS.slice(0, 2).map(({ label, Icon }) => (
              <motion.span key={label} variants={chipVariants} className="how-chip">
                <span className="how-chip-icon">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </motion.span>
            ))}
          </div>

          <div className="how-pill-wrap">
            <svg
              className="how-orbit"
              viewBox="0 0 460 190"
              fill="none"
              aria-hidden="true"
            >
              <ellipse
                cx="230"
                cy="95"
                rx="212"
                ry="72"
                stroke="rgba(36, 29, 24, 0.14)"
                strokeWidth="1"
                transform="rotate(-11 230 95)"
              />
              <motion.ellipse
                cx="230"
                cy="95"
                rx="212"
                ry="72"
                stroke="rgba(36, 29, 24, 0.32)"
                strokeWidth="1"
                strokeDasharray="260 590"
                animate={{ strokeDashoffset: [0, -850] }}
                transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                transform="rotate(-11 230 95)"
              />
              <motion.circle
                cx="416"
                cy="55"
                r="3"
                fill="#8a5a3f"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            <motion.div variants={pillVariants} className="how-pill-wrap-inner">
              <motion.div
                className="how-pill"
                animate={{ scale: [1, 1.035, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="how-pill-logo">
                  <PeopleIcon className="h-6 w-6" />
                </span>
                <span className="how-pill-word">
                  SkillSync
                  <span className="how-pill-ai">AI</span>
                </span>
              </motion.div>
            </motion.div>
          </div>

          <div className="how-chips how-chips-right">
            {NETWORK_CHIPS.slice(2).map(({ label, Icon }) => (
              <motion.span key={label} variants={chipVariants} className="how-chip">
                <span className="how-chip-icon">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={cardsVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="how-cards"
        >
          {cards.map((card, index) => (
            <ShowcaseCard
              key={card.title}
              card={card}
              index={index}
              onCardClick={onCardClick}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
