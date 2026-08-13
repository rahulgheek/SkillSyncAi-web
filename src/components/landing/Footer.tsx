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
    <footer className="relative z-10 border-t border-white/10 bg-[#050505] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl text-white">SkillSync AI</span>
          </div>
          <p className="text-white/60 text-lg max-w-md mb-6 leading-relaxed">
            The premier platform for connecting talent with opportunity. Powered by state-of-the-art AI.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 inline-block">
            <p className="text-sm text-white/80">
              <strong className="text-white">Note:</strong> Anyone can sign in. Demo testing available at{" "}
              {/* NOTE: the original mailto had two "@" characters (demotesting@2200@gmail.com),
                  which is not a valid email address — fix the address below to the real one. */}
              <a href="mailto:demotesting2200@gmail.com" className="text-indigo-400 hover:underline">
                demotesting2200@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Platform</h4>
          <ul className="space-y-4 text-white/60 font-medium">
            {PLATFORM_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
          <ul className="space-y-4 text-white/60 font-medium">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
        <p>© {new Date().getFullYear()} SkillSync AI. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          {SOCIAL_LINKS.map((label) => (
            <span key={label} className="hover:text-white cursor-pointer transition-colors">
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}