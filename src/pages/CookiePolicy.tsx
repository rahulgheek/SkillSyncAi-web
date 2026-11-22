import { Cookie } from "react-bootstrap-icons";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export function CookiePolicy() {
  return (
    <PublicPageLayout>
      <header className="public-hero">
        <p className="dash-eyebrow">
          <Cookie size={11} aria-hidden="true" /> Legal
        </p>
        <h1 className="public-title">
          Cookie <em>policy.</em>
        </h1>
        <p className="public-copy">
          Effective date: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="public-panel public-legal">
        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile
          device when you browse websites.
        </p>

        <h2>2. How we use cookies</h2>
        <p>
          We use strictly necessary cookies and local storage tokens to keep you
          logged in securely and maintain session continuity.
        </p>

        <h2>3. Third-party cookies</h2>
        <p>We do not use third-party tracking or advertising cookies.</p>
      </article>
    </PublicPageLayout>
  );
}
