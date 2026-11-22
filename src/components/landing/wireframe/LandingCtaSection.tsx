import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, CheckIcon, SparklesIcon } from "./icons";
import "./cta.css";

/**
 * Closing editorial panel. The dark espresso surface picks up the hero's dark
 * CTA and trust strip, while the warm serif accents keep it inside the same
 * visual family as the sections above.
 */
export const LandingCtaSection: React.FC = () => {
  return (
    <section aria-label="Join SkillSync" className="cta-section">
      <div className="cta-backdrop" aria-hidden="true" />

      <div className="cta-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="cta-panel"
        >
          <svg
            className="cta-orbit"
            viewBox="0 0 900 300"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              cx="450"
              cy="150"
              rx="420"
              ry="110"
              stroke="rgba(251, 247, 240, 0.13)"
              strokeWidth="1"
              transform="rotate(-8 450 150)"
            />
            <circle cx="832" cy="84" r="3" fill="#d8b591" />
          </svg>

          <div className="cta-panel-inner">
            <span className="cta-eyebrow">
              <SparklesIcon className="h-3 w-3" />
              Your next chapter
            </span>

            <h2 className="cta-title">
              Your next team is{" "}
              <span className="cta-title-accent">already building.</span>
            </h2>

            <p className="cta-copy">
              Create a profile, get matched with complementary builders, and spend your
              next hackathon shipping instead of searching for a team.
            </p>

            <div className="cta-actions">
              <Link to="/register" className="cta-primary">
                Create your profile
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
              <Link to="/explore" className="cta-secondary">
                Browse projects
              </Link>
            </div>

            <div className="cta-points">
              <span>
                <CheckIcon className="h-3.5 w-3.5" />
                Open to every student
              </span>
              <span>
                <CheckIcon className="h-3.5 w-3.5" />
                Verified profiles
              </span>
              <span>
                <CheckIcon className="h-3.5 w-3.5" />
                Built for hackathons
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
