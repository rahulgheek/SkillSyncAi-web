import React from "react";

export interface PlaceholderPillProps {
  width?: string | number;
  height?: string | number;
  color?: "dark" | "light" | "custom";
  customColor?: string;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface PlaceholderBoxProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: "dark" | "light";
  interactive?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ConsoleNavbarProps {
  brandText?: string;
  navItems?: NavItem[];
  rightActionText?: string;
  rightActionHref?: string;
  showToggle?: boolean;
  isToggled?: boolean;
  onToggle?: (newState: boolean) => void;
  className?: string;
}

export interface HeroContentCardProps {
  title?: string;
  description?: string;
  tagline?: string;
  ctaText?: string;
  className?: string;
  style?: React.CSSProperties;
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
  onCircleClick?: () => void;
}

export interface HeroMediaCardProps {
  title?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface FeatureSidebarProps {
  tag?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  className?: string;
  style?: React.CSSProperties;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export interface FeatureCardData {
  tag?: string;
  title: string;
  description: string;
  badge?: string;
}

export interface FeatureCardProps {
  index?: number;
  data?: FeatureCardData;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface WireframeConsoleProps {
  className?: string;
  interactive?: boolean;
}

export interface StaggeredCardData {
  tag?: string;
  title: string;
  description: string;
  badge?: string;
}

export interface StaggeredCardColumnProps {
  index: number;
  data?: StaggeredCardData;
  staggerClass?: string;
  hasBottomLines?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface MissionPillar {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconType: "brain" | "profile" | "search" | "growth";
}

export interface ImpactStat {
  id: string;
  value: string;
  label: string;
  desc: string;
  badge: string;
  iconType: "lightning" | "briefcase" | "people";
}

export interface HackathonImpactSectionProps {
  badge?: string;
  titlePrefix?: string;
  highlightText?: string;
  titleSuffix?: string;
  subtitle?: string;
  stats?: ImpactStat[];
  className?: string;
  onStatClick?: (statId: string) => void;
}

export interface MissionImpactSectionProps {
  badge?: string;
  titlePrefix?: string;
  highlightText?: string;
  titleSuffix?: string;
  pillars?: MissionPillar[];
  className?: string;
  onPillarClick?: (pillarId: string) => void;
}

export interface StaggeredShowcaseSectionProps {
  cards?: StaggeredCardData[];
  className?: string;
  onCardClick?: (index: number) => void;
}
