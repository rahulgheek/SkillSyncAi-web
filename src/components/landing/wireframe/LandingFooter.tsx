import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const PLATFORM_LINKS = [
  { to: "/explore", label: "Explore Projects" },
  { to: "/login", label: "Sign In" },
  { to: "/register", label: "Create Account" },
];

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
  { to: "/cookie-policy", label: "Cookie Policy" },
];

const SOCIAL_LINKS = ["Twitter", "LinkedIn", "GitHub"];

/**
 * LandingFooter is the landing-page-specific footer adhering strictly
 * to the warm palette (Deep Burgundy #4A121A, Warm Terracotta #A75D43,
 * Muted Rose #8A5A62, Warm Cream #EFE6D8).
 */
export const LandingFooter: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-[#4A121A]/80 bg-[#340C12] pt-16 sm:pt-20 pb-12 select-none">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-14">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A75D43] text-[#EFE6D8] shadow-md shadow-[#A75D43]/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl text-[#EFE6D8] tracking-tight">SkillSync AI</span>
          </div>

          <p className="text-[#EFE6D8]/70 text-sm sm:text-base max-w-md leading-relaxed font-medium">
            The premier platform for connecting student builders, engineers, and creators. Assemble balanced teams and turn ideas into real hackathon wins.
          </p>

          <div className="bg-[#28090E] border border-[#8A5A62]/30 rounded-xl p-4 inline-block shadow-sm">
            <p className="text-xs sm:text-sm text-[#EFE6D8]/80 font-medium">
              <strong className="text-[#EFE6D8] font-bold">Live Demo:</strong> Anyone can sign in to explore. Testing credentials available at{" "}
              <a
                href="mailto:demotesting2200@gmail.com"
                className="text-[#D98268] hover:underline font-semibold"
              >
                demotesting2200@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-[#EFE6D8] font-bold text-sm uppercase tracking-wider mb-5">Platform</h4>
          <ul className="space-y-3 text-sm text-[#EFE6D8]/70 font-medium">
            {PLATFORM_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-[#D98268] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-[#EFE6D8] font-bold text-sm uppercase tracking-wider mb-5">Legal & Policies</h4>
          <ul className="space-y-3 text-sm text-[#EFE6D8]/70 font-medium">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-[#D98268] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Status Bar */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 pt-8 border-t border-[#4A121A]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8A5A62]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A75D43]" />
          <span>SkillSync AI Ecosystem • Production Ready</span>
        </div>

        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map((social) => (
            <span key={social} className="hover:text-[#EFE6D8] transition-colors cursor-pointer">
              {social}
            </span>
          ))}
          <span>© {new Date().getFullYear()} SkillSync. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
