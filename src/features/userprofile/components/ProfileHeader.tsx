import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileResponse } from "../schemas";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Building2, User } from "lucide-react";

export function ProfileHeader({ profile }: { profile: ProfileResponse }) {
  const initials = profile.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden relative mb-6">
      <div className="h-32 bg-gradient-to-r from-primary via-accent to-secondary" />
      <CardContent className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 relative">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start -mt-12">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-sm bg-muted">
            <AvatarImage src={profile.profilePictureUrl || ""} alt={profile.fullName} />
            <AvatarFallback className="text-3xl bg-secondary/20 text-secondary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-14 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {profile.fullName}
            </h1>
            
            {profile.major && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>
                  {profile.major} {profile.graduationYear ? `• Class of ${profile.graduationYear}` : ""}
                </span>
              </div>
            )}
            
            {profile.bio && (
              <p className="text-foreground/80 mt-2 max-w-2xl text-sm sm:text-base">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 pt-2">
              {profile.skills?.slice(0, 4).map((skill) => (
                <Badge key={skill.skillId} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {skill.name}
                </Badge>
              ))}
              {(profile.skills?.length || 0) > 4 && (
                <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                  +{profile.skills!.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
