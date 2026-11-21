import React from "react";
import { StaggeredHeader } from "./StaggeredHeader";
import { StaggeredCardColumn } from "./StaggeredCardColumn";
import { StaggeredCardData, StaggeredShowcaseSectionProps } from "./types";

const DEFAULT_SHOWCASE_CARDS: StaggeredCardData[] = [
  {
    tag: "01 / PARSING",
    title: "AI Resume Parsing",
    description:
      "Upload your resume and let our Gemini-powered AI instantly extract your core skills, strengths, and experience with zero manual entry.",
    badge: "Instant Extraction",
  },
  {
    tag: "02 / ANALYTICS",
    title: "Deep AI Insights",
    description:
      "Get comprehensive analytics on your profile. Identify skill gaps and discover your unique competitive advantages in the tech landscape.",
    badge: "Gap Analysis",
  },
  {
    tag: "03 / ROADMAP",
    title: "Dynamic Career Roadmap",
    description:
      "Stop guessing your next steps. Generate a personalized, step-by-step learning path based on your dream roles and current skill level",
    badge: "Adaptive Path",
  },
];

/**
 * StaggeredShowcaseSection renders the frameless second section that appears
 * on scroll from the landing hero, featuring the three key feature cards:
 * 1. AI Resume Parsing
 * 2. Deep AI Insights
 * 3. Dynamic Career Roadmap
 */
export const StaggeredShowcaseSection: React.FC<StaggeredShowcaseSectionProps> = ({
  cards = DEFAULT_SHOWCASE_CARDS,
  className = "",
  onCardClick,
}) => {
  return (
    <section
      role="region"
      aria-label="Wireframe showcase section"
      className={`relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-28 flex flex-col gap-10 sm:gap-14 md:gap-18 ${className}`}
    >
      {/* 1. Staggered Headline Area */}
      <StaggeredHeader />

      {/* 2. Three Staggered Cards (Column 1 High, Column 2 Low, Column 3 Medium) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 items-start w-full">
        {/* Column 1: Top-aligned with bottom text lines */}
        <StaggeredCardColumn
          index={1}
          data={cards[0]}
          staggerClass="translate-y-0"
          hasBottomLines={true}
          onClick={() => onCardClick?.(1)}
        />

        {/* Column 2: Staggered lowest downwards */}
        <StaggeredCardColumn
          index={2}
          data={cards[1]}
          staggerClass="mt-0 sm:mt-20 md:mt-28"
          hasBottomLines={false}
          onClick={() => onCardClick?.(2)}
        />

        {/* Column 3: Moderately staggered with bottom text lines */}
        <StaggeredCardColumn
          index={3}
          data={cards[2]}
          staggerClass="mt-0 sm:mt-10 md:mt-14"
          hasBottomLines={true}
          onClick={() => onCardClick?.(3)}
        />
      </div>
    </section>
  );
};
