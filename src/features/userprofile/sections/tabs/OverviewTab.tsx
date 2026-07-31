import { ProfileResponse } from "../../../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Globe, Mail, FileText } from "lucide-react";

export function OverviewTab({ profile }: { profile: ProfileResponse }) {
  const socials = [
    { name: "GitHub", url: profile.githubUrl, icon: Github },
    { name: "LinkedIn", url: profile.linkedinUrl, icon: Linkedin },
    { name: "Portfolio", url: profile.portfolioUrl, icon: Globe },
  ].filter((s) => !!s.url);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {profile.bio || "No bio added yet. Write something about yourself!"}
            </p>
          </CardContent>
        </Card>

        {profile.lookingFor && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Looking For</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{profile.lookingFor}</p>
            </CardContent>
          </Card>
        )}

        {profile.resumeUrl && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-gray-50">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <FileText className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Resume.pdf</p>
                  <p className="text-sm text-muted-foreground">Updated recently</p>
                </div>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                  View PDF
                </a>
              </div>
              {profile.resumeSummary && (
                <div className="mt-4 p-4 rounded-xl border border-border bg-blue-50/50">
                  <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                    {profile.resumeSummary}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {socials.length === 0 && <p className="text-sm text-muted-foreground">No links added.</p>}
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url!}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-foreground"
              >
                <social.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-sm">{social.name}</span>
              </a>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">University</p>
              <p className="text-sm text-muted-foreground">{profile.major || "Computer Science"}</p>
              <p className="text-sm text-muted-foreground">Class of {profile.graduationYear || "2026"}</p>
            </div>
          </CardContent>
        </Card>

        {profile.languages && profile.languages.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 text-foreground text-xs font-medium rounded-md">
                    {lang}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
