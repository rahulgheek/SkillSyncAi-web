import {
  ArrowUpRight,
  FileEarmarkText,
  GeoAlt,
  Github,
  Globe2,
  Linkedin,
  Mortarboard,
  Translate,
} from "react-bootstrap-icons";
import { ProfileResponse } from "../../schemas";

export function OverviewTab({ profile }: { profile: ProfileResponse }) {
  const socials = [
    { name: "GitHub", url: profile.githubUrl, icon: Github },
    { name: "LinkedIn", url: profile.linkedinUrl, icon: Linkedin },
    { name: "Portfolio", url: profile.portfolioUrl, icon: Globe2 },
  ].filter((social) => !!social.url);

  return (
    <div className="dash-detail-layout">
      <div className="dash-detail-main">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">The short version</p>
              <h2 className="dash-panel-title">About me</h2>
            </div>
          </div>
          <div className="dash-panel-body">
            <p className="dash-prose">
              {profile.bio ||
                "No bio added yet. Write something about yourself so teammates know what you bring to a build."}
            </p>
          </div>
        </section>

        {profile.lookingFor && (
          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">Next collaboration</p>
                <h2 className="dash-panel-title">Looking for</h2>
              </div>
            </div>
            <div className="dash-panel-body">
              <p className="dash-prose">{profile.lookingFor}</p>
            </div>
          </section>
        )}

        {profile.resumeUrl && (
          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">On paper</p>
                <h2 className="dash-panel-title">Resume</h2>
              </div>
              <div className="dash-panel-actions">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dash-btn dash-btn-ghost dash-btn-sm"
                >
                  View PDF
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="dash-panel-body">
              <div className="dash-list">
                <div className="dash-list-item">
                  <span className="dash-list-icon">
                    <FileEarmarkText size={14} aria-hidden="true" />
                  </span>
                  <div className="dash-list-copy">
                    <span className="dash-list-title">Resume.pdf</span>
                    <span className="dash-list-sub">Uploaded document</span>
                  </div>
                </div>
              </div>

              {profile.resumeSummary && (
                <div className="dash-alert" style={{ marginTop: 12 }}>
                  <FileEarmarkText size={12} aria-hidden="true" />
                  <span style={{ whiteSpace: "pre-line" }}>{profile.resumeSummary}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <aside className="dash-detail-side">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">Elsewhere</p>
              <h2 className="dash-panel-title">Social links</h2>
            </div>
          </div>
          <div className="dash-panel-body">
            {socials.length === 0 ? (
              <p className="dash-mini-sub">No links added yet.</p>
            ) : (
              <div className="dash-list">
                {socials.map((social) => {
                  const IconGlyph = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url!}
                      target="_blank"
                      rel="noreferrer"
                      className="dash-list-item dash-row-link"
                    >
                      <span className="dash-list-icon">
                        <IconGlyph size={13} aria-hidden="true" />
                      </span>
                      <div className="dash-list-copy">
                        <span className="dash-list-title">{social.name}</span>
                        <span className="dash-list-sub">Open profile</span>
                      </div>
                      <ArrowUpRight
                        size={11}
                        className="dash-list-meta"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <div className="dash-panel-heading">
              <p className="dash-panel-kicker">Foundations</p>
              <h2 className="dash-panel-title">Education</h2>
            </div>
          </div>
          <div className="dash-panel-body">
            <div className="dash-list">
              <div className="dash-list-item">
                <span className="dash-list-icon">
                  <Mortarboard size={13} aria-hidden="true" />
                </span>
                <div className="dash-list-copy">
                  <span className="dash-list-title">University</span>
                  <span className="dash-list-sub">
                    {profile.major || "Computer Science"}
                  </span>
                </div>
              </div>
              <div className="dash-list-item">
                <span className="dash-list-icon">
                  <GeoAlt size={13} aria-hidden="true" />
                </span>
                <div className="dash-list-copy">
                  <span className="dash-list-title">
                    {profile.graduationYear
                      ? `Class of ${profile.graduationYear}`
                      : "Class of 2026"}
                  </span>
                  <span className="dash-list-sub">
                    {profile.location || "Campus"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {profile.languages && profile.languages.length > 0 && (
          <section className="dash-panel">
            <div className="dash-panel-head">
              <div className="dash-panel-heading">
                <p className="dash-panel-kicker">How you speak</p>
                <h2 className="dash-panel-title">Languages</h2>
              </div>
              <Translate size={14} color="#8a5a3f" aria-hidden="true" />
            </div>
            <div className="dash-panel-body">
              <div className="dash-tag-row">
                {profile.languages.map((language) => (
                  <span key={language} className="dash-tag">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </aside>
    </div>
  );
}
