import { Envelope, SendFill } from "react-bootstrap-icons";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export function ContactPage() {
  return (
    <PublicPageLayout>
      <header className="public-hero" style={{ maxWidth: 700 }}>
        <p className="dash-eyebrow">Contact</p>
        <h1 className="public-title">
          Say <em>hello.</em>
        </h1>
        <p className="public-copy">
          Have a question or want to partner with us for your next university
          hackathon? Send us a message below.
        </p>
      </header>

      <section className="public-panel public-contact">
        <form className="dash-form" onSubmit={(e) => e.preventDefault()}>
          <div className="dash-field">
            <label className="dash-label" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              className="dash-input"
              type="text"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="dash-field">
            <label className="dash-label" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              className="dash-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="dash-field">
            <label className="dash-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              className="dash-textarea"
              placeholder="How can we help you?"
              rows={5}
            />
          </div>

          <div className="dash-form-actions" style={{ justifyContent: "flex-start" }}>
            <button type="submit" className="dash-btn dash-btn-solid dash-btn-lg">
              <SendFill size={12} aria-hidden="true" />
              Send message
            </button>
          </div>
        </form>

        <div
          className="dash-inline"
          style={{ marginTop: 14, color: "var(--dash-muted)" }}
        >
          <Envelope size={12} aria-hidden="true" />
          <span className="dash-help">
            Prefer email? Write to demotesting2200@gmail.com
          </span>
        </div>
      </section>
    </PublicPageLayout>
  );
}
