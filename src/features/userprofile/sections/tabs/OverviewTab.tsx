import { ProfileResponse } from "../../schemas";
import { Github, Linkedin, Globe, Mail, FileText } from "lucide-react";

export function OverviewTab({ profile }: { profile: ProfileResponse }) {
  const socials = [
    { name: "GitHub", url: profile.githubUrl, icon: Github },
    { name: "LinkedIn", url: profile.linkedinUrl, icon: Linkedin },
    { name: "Portfolio", url: profile.portfolioUrl, icon: Globe },
  ].filter((s) => !!s.url);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          <h2 className="text-2xl font-black mb-4 text-foreground">About Me</h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            {profile.bio || "No bio added yet. Write something about yourself!"}
          </p>
        </div>

        {profile.lookingFor && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
            <h2 className="text-2xl font-black mb-4 text-foreground">Looking For</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">{profile.lookingFor}</p>
          </div>
        )}

        {profile.resumeUrl && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
            <h2 className="text-2xl font-black mb-6 text-foreground">Resume</h2>
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 group hover:border-primary/30 hover:bg-primary/5 transition-all">
              <div className="p-4 bg-white rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-foreground">Resume.pdf</p>
                <p className="text-sm text-muted-foreground font-medium">Updated recently</p>
              </div>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                View PDF
              </a>
            </div>
            {profile.resumeSummary && (
              <div className="mt-6 p-6 rounded-2xl border border-blue-100 bg-blue-50/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
                <p className="text-base text-foreground font-medium whitespace-pre-line leading-relaxed">
                  {profile.resumeSummary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          <h2 className="text-2xl font-black mb-5 text-foreground">Social Links</h2>
          <div className="space-y-3">
            {socials.length === 0 && <p className="text-base font-medium text-muted-foreground">No links added.</p>}
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url!}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-gray-100"
              >
                <div className="p-2.5 bg-gray-100 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors text-muted-foreground">
                  <social.icon className="h-5 w-5" />
                </div>
                <span className="font-bold text-base text-foreground">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          <h2 className="text-2xl font-black mb-4 text-foreground">Education</h2>
          <div className="space-y-1">
            <p className="font-bold text-lg text-foreground">University</p>
            <p className="text-base font-medium text-muted-foreground">{profile.major || "Computer Science"}</p>
            <p className="text-base font-medium text-primary">Class of {profile.graduationYear || "2026"}</p>
          </div>
        </div>

        {profile.languages && profile.languages.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
            <h2 className="text-2xl font-black mb-5 text-foreground">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang: string) => (
                <span key={lang} className="px-4 py-2 bg-gray-50 border border-gray-100 text-foreground text-sm font-bold rounded-xl shadow-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
