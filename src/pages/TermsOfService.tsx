import { FileEarmarkText } from "react-bootstrap-icons";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export function TermsOfService() {
  return (
    <PublicPageLayout>
      <header className="public-hero">
        <p className="dash-eyebrow">
          <FileEarmarkText size={11} aria-hidden="true" /> Legal
        </p>
        <h1 className="public-title">
          Terms of <em>service.</em>
        </h1>
        <p className="public-copy">
          Effective date: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="public-panel public-legal">
        <h2>1. Acceptance of terms</h2>
        <p>
          By accessing and using SkillSync, you accept and agree to be bound by the
          terms and provisions of this agreement.
        </p>

        <h2>2. User accounts</h2>
        <p>
          Anyone can sign in on the site through any email address for testing and
          demonstration purposes. You are responsible for maintaining the
          confidentiality of your account credentials.
        </p>

        <h2>3. AI disclaimer</h2>
        <p>
          SkillSync uses generative AI (Google Gemini) to parse resumes and suggest
          roadmaps. We do not guarantee the absolute accuracy or fitness for purpose
          of AI-generated insights.
        </p>

        <h2>4. Prohibited conduct</h2>
        <p>
          You agree not to use the platform to harass others, post false information,
          or attempt to compromise the security or stability of the platform.
        </p>
      </article>
    </PublicPageLayout>
  );
}
