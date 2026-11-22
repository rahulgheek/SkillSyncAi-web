import type { ReactNode } from "react";
import { ConsoleNavbar, LandingFooter } from "@/components/landing/wireframe";
import "@/components/landing/wireframe/landing.css";
import "@/features/dashboard/dashboard.css";
import "@/features/dashboard/pages.css";

interface PublicPageLayoutProps {
  children: ReactNode;
}

/**
 * Shared shell for unauthenticated marketing and legal pages. It keeps the
 * editorial landing navigation and footer while borrowing the dashboard's
 * paper, ink and accent tokens for page-level content.
 */
export function PublicPageLayout({ children }: PublicPageLayoutProps) {
  return (
    <div className="public-page">
      <ConsoleNavbar />
      <main className="public-main">{children}</main>
      <LandingFooter />
    </div>
  );
}
