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

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#4A121A]/60 bg-[#28090E] pt-20 pb-12 text-[#EFE6D8]">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFE6D8] text-[#4A121A] shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl text-[#EFE6D8]">SkillSync</span>
          </div>
          <p className="text-[#EFE6D8]/70 text-lg max-w-md mb-6 leading-relaxed">
            The student-focused collaboration platform for finding teammates, building hackathon projects, and launching careers.
          </p>
          <div className="bg-[#340C12] border border-[#4A121A] rounded-xl p-4 inline-block">
            <p className="text-sm text-[#EFE6D8]/80">
              <strong className="text-[#EFE6D8]">Demo Testing:</strong> Testing available at{" "}
              <a href="mailto:demotesting2200@gmail.com" className="text-[#D98268] hover:underline font-semibold">
                demotesting2200@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-[#EFE6D8] font-bold text-lg mb-6">Platform</h4>
          <ul className="space-y-4 text-[#EFE6D8]/70 font-medium">
            {PLATFORM_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-[#D98268] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#EFE6D8] font-bold text-lg mb-6">Legal</h4>
          <ul className="space-y-4 text-[#EFE6D8]/70 font-medium">
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

      <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-[#4A121A]/60 flex flex-col md:flex-row items-center justify-between text-sm text-[#EFE6D8]/50">
        <p>© {new Date().getFullYear()} SkillSync. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          {SOCIAL_LINKS.map((label) => (
            <span key={label} className="hover:text-[#D98268] cursor-pointer transition-colors">
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
