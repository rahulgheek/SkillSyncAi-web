import { ShieldCheck } from "react-bootstrap-icons";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export function PrivacyPolicy() {
  return (
    <PublicPageLayout>
      <header className="public-hero">
        <p className="dash-eyebrow">
          <ShieldCheck size={11} aria-hidden="true" /> Legal
        </p>
        <h1 className="public-title">
          Privacy <em>policy.</em>
        </h1>
        <p className="public-copy">
          Effective date: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="public-panel public-legal">
        <p>
          Welcome to SkillSync. We are committed to protecting your personal
          information and your right to privacy. This Privacy Policy applies to all
          information collected through our application, website, and related
          services.
        </p>

        <h2>1. Information we collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you
          register on the application, including but not limited to your name, email
          address, university affiliation, and profile information (such as your
          resume, skills, and projects).
        </p>
        <p>
          When you use Google OAuth to sign in, we collect your Google email address
          and basic profile information to authenticate your account.
        </p>

        <h2>2. How we use your information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and maintain our application.</li>
          <li>Improve, personalize, and expand our application features.</li>
          <li>Analyze how you use our application.</li>
          <li>
            Develop AI-powered teambuilding algorithms and matchmaking services.
          </li>
          <li>
            Communicate with you, including sending verification emails and project
            updates.
          </li>
        </ul>

        <h2>3. Information sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          necessary to provide our services. Information that you choose to make
          public, such as your profile, skills, previous projects, and portfolio
          links, may be visible to other authenticated users of the platform for
          matchmaking purposes, or to comply with the law.
        </p>

        <h2>4. Third-party services (Google and Gemini AI)</h2>
        <p>
          Our application uses Google OAuth in accordance with Google's OAuth
          implementation guidelines and requests only the permissions necessary for
          authentication.
        </p>
        <p>
          We also use Google Gemini AI to analyze your uploaded resume and generate
          career insights. Resume content is processed through the Gemini API solely
          to generate insights for the user. Uploaded resumes are stored securely and
          are used only for profile generation, AI-based skill extraction, and career
          guidance features.
        </p>
        <div className="public-legal-note">
          <p>
            <strong>AI disclaimer:</strong> AI-generated recommendations, skill
            analyses, and career roadmaps are intended to assist users and should not
            be considered professional or career advice.
          </p>
        </div>

        <h2>5. Data security</h2>
        <p>
          We implement appropriate technical and organizational security measures
          designed to protect the security of any personal information we process.
          However, despite our safeguards, no internet transmission is 100% secure.
        </p>

        <h2>6. Data retention</h2>
        <p>
          We retain user information only for as long as necessary to provide our
          services. Users may request deletion of their account and associated data at
          any time.
        </p>

        <h2>7. Account deletion</h2>
        <p>
          Users may request deletion of their account, after which their personal
          information and uploaded files will be removed from the platform, except
          where retention is required for technical or legal reasons.
        </p>

        <h2>8. Contact us</h2>
        <p>
          Please note that anyone can sign in on this site using any email address for
          demonstration and testing purposes.
        </p>
        <p>
          If you have questions or comments about this policy, please contact us at{" "}
          <a href="mailto:demotesting2200@gmail.com">demotesting2200@gmail.com</a>.
        </p>
      </article>
    </PublicPageLayout>
  );
}
