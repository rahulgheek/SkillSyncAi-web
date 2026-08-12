import {
  Brain, Target, Layers, Zap, Shield, Globe, Code, Users, Lock,
  type LucideIcon,
} from "lucide-react";

/**
 * Every accent color used across the landing page lives here.
 * Sections reference a `tone` key instead of hardcoding Tailwind classes,
 * so the palette stays consistent and is only defined in one place.
 */
export const TONES = {
  indigo: {
    text: "text-indigo-400",
    ring: "border-indigo-500/50",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    bg: "bg-indigo-500/20",
  },
  purple: {
    text: "text-purple-400",
    ring: "border-purple-500/50",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    bg: "bg-purple-500/20",
  },
  pink: {
    text: "text-pink-400",
    ring: "border-pink-500/50",
    glow: "shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    bg: "bg-pink-500/20",
  },
  emerald: {
    text: "text-emerald-400",
    ring: "border-emerald-500/50",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    bg: "bg-emerald-500/20",
  },
  blue: {
    text: "text-blue-400",
    ring: "border-blue-500/50",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    bg: "bg-blue-500/20",
  },
  rose: {
    text: "text-rose-400",
    ring: "border-rose-500/50",
    glow: "shadow-[0_0_30px_rgba(251,113,133,0.15)]",
    bg: "bg-rose-500/20",
  },
  amber: {
    text: "text-amber-400",
    ring: "border-amber-500/50",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    bg: "bg-amber-500/20",
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
    tone: "indigo",
    title: "1. AI Profile Parsing",
    description:
      "Upload your resume and let our Gemini-powered AI automatically extract your skills, experiences, and core competencies.",
  },
  {
    icon: Target,
    tone: "purple",
    title: "2. Smart Matching",
    description:
      "Our orchestrator analyzes project requirements and finds the exact talent needed, ensuring the perfect fit for every role.",
  },
  {
    icon: Layers,
    tone: "pink",
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
    tone: "amber",
    title: "Instant Synergy",
    description:
      "No more endless searching. Get matched with peers whose skills perfectly complement yours in milliseconds.",
  },
  {
    icon: Shield,
    tone: "emerald",
    title: "Privacy First",
    description:
      "Your data belongs to you. We use AI to generate insights for your profile, not to train global language models.",
  },
  {
    icon: Globe,
    tone: "blue",
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
    tone: "indigo",
    title: "AI Resume Parsing",
    description:
      "Upload your resume and let our Gemini-powered AI extract your core skills, strengths, and weaknesses instantly.",
  },
  {
    icon: Users,
    tone: "purple",
    title: "Smart Matchmaking",
    description:
      "Create projects with specific requirements and let the orchestrator find the best students across your campus.",
  },
  {
    icon: Target,
    tone: "emerald",
    title: "AI Career Roadmap",
    description:
      "Get personalized step-by-step guidance based on your dream role. Let AI break down complex goals into manageable tasks.",
  },
  {
    icon: Code,
    tone: "blue",
    title: "Project Orchestration",
    description:
      "Manage roles, tasks, and deadlines in one place. Streamline your collaboration from ideation to deployment.",
  },
  {
    icon: Lock,
    tone: "rose",
    title: "Secure & Private",
    description:
      "Your data is kept safe. Resume content is processed securely to generate insights for you, never to train global models.",
  },
];