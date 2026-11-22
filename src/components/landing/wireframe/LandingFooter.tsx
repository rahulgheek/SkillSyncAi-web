import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ArrowUpIcon, PeopleIcon } from "./icons";
import "./footer.css";

const PRODUCT_LINKS = [
  { to: "/explore", label: "Explore Projects", external: false },
  { to: "#features", label: "Features", external: true },
  { to: "#impact", label: "Impact", external: true },
  { to: "/register", label: "Create Account", external: false },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/login", label: "Sign In" },
];

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
  { to: "/cookie-policy", label: "Cookie Policy" },
];

const scrollToTop = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
};

/**
 * Dark closing footer. Deep espresso, cream type, and a cropped serif
 * wordmark keep it consistent with the hero's dark trust strip.
 */
export const LandingFooter: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-grain" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand" aria-label="SkillSync home">
              <span className="footer-brand-mark">
                <PeopleIcon className="h-4 w-4" />
              </span>
              <span className="footer-brand-word">
                SkillSync
                <span className="footer-brand-ai">AI</span>
              </span>
            </Link>

            <p className="footer-copy">
              The platform for connecting student builders, engineers, and creators.
              Assemble balanced teams and turn ideas into real hackathon wins.
            </p>

            <div className="footer-demo">
              <p>
                <strong>Live demo:</strong> Anyone can sign in to explore. Testing
                credentials available at{" "}
                <a href="mailto:demotesting2200@gmail.com">demotesting2200@gmail.com</a>
              </p>
            </div>

            <div className="footer-status">
              <span className="footer-status-dot" aria-hidden="true" />
              Built for student builders
            </div>
          </div>

          <FooterColumn title="Product" dotClass="is-terracotta" links={PRODUCT_LINKS} />
          <FooterColumn title="Company" dotClass="is-olive" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" dotClass="is-peach" links={LEGAL_LINKS} />
        </div>

        <div className="footer-bottom">
          <div className="footer-meta">
            <span>
              <span className="footer-dot" aria-hidden="true" />
              SkillSync AI ecosystem
            </span>
            <span className="footer-sep" aria-hidden="true" />
            <span>Built with care for student builders.</span>
            <span className="footer-sep" aria-hidden="true" />
            <span>© {new Date().getFullYear()} SkillSync. All rights reserved.</span>
          </div>

          <button type="button" onClick={scrollToTop} className="footer-top">
            Back to top
            <span>
              <ArrowUpIcon className="h-3 w-3" />
            </span>
          </button>
        </div>
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        SkillSync
      </div>
    </footer>
  );
};

interface FooterLink {
  to: string;
  label: string;
  external?: boolean;
}

const FooterColumn: React.FC<{
  title: string;
  dotClass: string;
  links: FooterLink[];
}> = ({ title, dotClass, links }) => {
  return (
    <div>
      <h4 className="footer-col-title">
        <span className={dotClass} aria-hidden="true" />
        {title}
      </h4>
      <ul className="footer-links">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.to} className="footer-link">
                {link.label}
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            ) : (
              <Link to={link.to} className="footer-link">
                {link.label}
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
