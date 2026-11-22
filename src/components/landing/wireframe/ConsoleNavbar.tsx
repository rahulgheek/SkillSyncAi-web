import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRightIcon, CloseIcon, MenuIcon, PeopleIcon } from "./icons";
import type { ConsoleNavbarProps, NavItem } from "./types";

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Fixed editorial navigation. It stays available while scrolling and fades in
 * a cream glass surface once the page moves, so the links remain readable over
 * the dark sections below the hero.
 */
export const ConsoleNavbar: React.FC<ConsoleNavbarProps> = ({
  brandText = "SkillSync",
  navItems = DEFAULT_NAV_ITEMS,
  rightActionText = "Sign in",
  rightActionHref = "/login",
  className = "",
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`hero-nav ${scrolled || mobileOpen ? "is-scrolled" : ""} ${className}`}
    >
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: scrolled || mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="hero-nav-surface"
      />

      <div className="hero-nav-inner">
        <Link to="/" aria-label="SkillSync home" className="hero-brand">
          <span className="hero-brand-mark">
            <PeopleIcon className="h-4 w-4" />
          </span>
          <span className="hero-brand-word">
            {brandText}
            <span className="hero-brand-ai">AI</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hero-nav-links">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className="hero-nav-link"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hero-nav-actions">
          <Link to={rightActionHref} className="hero-nav-signin">
            {rightActionText}
          </Link>
          <Link to="/register" className="hero-nav-cta">
            Get started
            <ArrowUpRightIcon className="h-3 w-3" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="hero-mobile-nav"
          className="hero-menu-button"
        >
          {mobileOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="hero-mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hero-mobile-menu"
          >
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="hero-mobile-link"
                  >
                    {item.label}
                    <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-45" />
                  </Link>
                );
              })}
            </nav>
            <div className="hero-mobile-actions">
              <Link
                to={rightActionHref}
                onClick={() => setMobileOpen(false)}
                className="hero-mobile-signin"
              >
                {rightActionText}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="hero-mobile-cta"
              >
                Get started
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
