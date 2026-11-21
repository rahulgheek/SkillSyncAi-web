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

export interface ConsoleNavbarProps {
  isToggled?: boolean;
  onToggle?: (newState: boolean) => void;
  className?: string;
}

export interface HeroContentCardProps {
  className?: string;
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
  onCircleClick?: () => void;
}

export interface HeroMediaCardProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface FeatureSidebarProps {
  className?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export interface FeatureCardProps {
  index?: number;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface WireframeConsoleProps {
  className?: string;
  interactive?: boolean;
}
