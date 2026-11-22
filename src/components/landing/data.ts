import {
  Brain, Target, Layers, Zap, Shield, Globe, Code, Users, Lock,
  type LucideIcon,
} from "lucide-react";

/**
 * SkillSync Brand Color Palette Tones.
 * Foundation:
 * - Primary: Deep Burgundy (#4A121A)
 * - Secondary: Warm Terracotta (#A75D43)
 * - Tertiary: Muted Rose (#8A5A62)
 * - Neutral: Warm Cream (#EFE6D8)
 */
export const TONES = {
  burgundy: {
    text: "text-[#4A121A]",
    ring: "border-[#4A121A]/40",
    glow: "shadow-[0_0_30px_rgba(74,18,26,0.18)]",
    bg: "bg-[#4A121A]/10",
  },
  terracotta: {
    text: "text-[#A75D43]",
    ring: "border-[#A75D43]/40",
    glow: "shadow-[0_0_30px_rgba(167,93,67,0.2)]",
    bg: "bg-[#A75D43]/10",
  },
  rose: {
    text: "text-[#8A5A62]",
    ring: "border-[#8A5A62]/40",
    glow: "shadow-[0_0_30px_rgba(138,90,98,0.2)]",
    bg: "bg-[#8A5A62]/10",
  },
  cream: {
    text: "text-[#340C12]",
    ring: "border-[#E2D5C3]",
    glow: "shadow-[0_0_30px_rgba(239,230,216,0.25)]",
    bg: "bg-[#EFE6D8]",
  },
  // Legacy aliases mapped to the brand palette
  indigo: {
    text: "text-[#4A121A]",
    ring: "border-[#4A121A]/40",
    glow: "shadow-[0_0_30px_rgba(74,18,26,0.18)]",
    bg: "bg-[#4A121A]/10",
  },
  purple: {
    text: "text-[#8A5A62]",
    ring: "border-[#8A5A62]/40",
    glow: "shadow-[0_0_30px_rgba(138,90,98,0.2)]",
    bg: "bg-[#8A5A62]/10",
  },
  pink: {
    text: "text-[#8A5A62]",
    ring: "border-[#8A5A62]/40",
    glow: "shadow-[0_0_30px_rgba(138,90,98,0.2)]",
    bg: "bg-[#8A5A62]/10",
  },
  emerald: {
    text: "text-[#A75D43]",
    ring: "border-[#A75D43]/40",
    glow: "shadow-[0_0_30px_rgba(167,93,67,0.2)]",
    bg: "bg-[#A75D43]/10",
  },
  blue: {
    text: "text-[#4A121A]",
    ring: "border-[#4A121A]/40",
    glow: "shadow-[0_0_30px_rgba(74,18,26,0.18)]",
    bg: "bg-[#4A121A]/10",
  },
  amber: {
    text: "text-[#A75D43]",
    ring: "border-[#A75D43]/40",
    glow: "shadow-[0_0_30px_rgba(167,93,67,0.2)]",
    bg: "bg-[#A75D43]/10",
  },
} as const;

export type Tone = keyof typeof TONES;

export interface StepItem {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  description: string;
}

export const HOW_IT_WORKS: StepItem[] = [
  {
    icon: Brain,
    tone: "burgundy",
    title: "1. AI Profile Parsing",
    description:
      "Upload your resume and let our Gemini-powered AI automatically extract your skills, experiences, and core competencies.",
  },
  {
    icon: Target,
    tone: "terracotta",
    title: "2. Smart Matching",
    description:
      "Our orchestrator analyzes project requirements and finds the exact talent needed, ensuring the perfect fit for every role.",
  },
  {
    icon: Layers,
    tone: "rose",
    title: "3. Collaborate & Ship",
    description:
      "Manage tasks, roles, and deadlines within our immersive workspace. Focus on building while we handle the orchestration.",
  },
];

export interface ValueProp {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  description: string;
}

export const WHY_CHOOSE: ValueProp[] = [
  {
    icon: Zap,
    tone: "terracotta",
    title: "Instant Synergy",
    description:
      "No more endless searching. Get matched with peers whose skills perfectly complement yours in milliseconds.",
  },
  {
    icon: Shield,
    tone: "burgundy",
    title: "Privacy First",
    description:
      "Your data belongs to you. We use AI to generate insights for your profile, not to train global language models.",
  },
  {
    icon: Globe,
    tone: "rose",
    title: "Campus to Global",
    description:
      "Start by finding collaborators within your university, then scale your network to top talent worldwide.",
  },
];

export interface FeatureCardItem {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  description: string;
}

export const PLATFORM_FEATURES: FeatureCardItem[] = [
  {
    icon: Brain,
    tone: "burgundy",
    title: "AI Resume Parsing",
    description:
      "Upload your resume and let our Gemini-powered AI extract your core skills, strengths, and weaknesses instantly.",
  },
  {
    icon: Users,
    tone: "terracotta",
    title: "Smart Matchmaking",
    description:
      "Create projects with specific requirements and let the orchestrator find the best students across your campus.",
  },
  {
    icon: Target,
    tone: "rose",
    title: "AI Career Roadmap",
    description:
      "Get personalized step-by-step guidance based on your dream role. Let AI break down complex goals into manageable tasks.",
  },
  {
    icon: Code,
    tone: "burgundy",
    title: "Project Orchestration",
    description:
      "Manage roles, tasks, and deadlines in one place. Streamline your collaboration from ideation to deployment.",
  },
  {
    icon: Lock,
    tone: "terracotta",
    title: "Secure & Private",
    description:
      "Your data is kept safe. Resume content is processed securely to generate insights for you, never to train global models.",
  },
];
