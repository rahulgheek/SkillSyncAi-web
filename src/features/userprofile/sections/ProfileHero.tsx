import { ProfileResponse } from "../schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "../components/EditProfileModal";
import { MapPin, Briefcase, GraduationCap, CheckCircle, Share } from "lucide-react";

import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export function ProfileHero({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  const avatarUrl = profile.profilePictureUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.userId;

  return (
    <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-all">
      {/* Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-gray-100 to-gray-200" />
      
      <div className="px-8 pb-8 pt-0 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 md:-mt-20 space-y-4 md:space-y-0 relative z-10">
          <div className="flex items-end gap-5">
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background overflow-hidden bg-white shadow-sm">
                <img src={avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
              </div>
              {profile.availability && (
                <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-2 border-background" title={profile.availability} />
              )}
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">{profile.fullName}</h1>
                {(profile.isVerified ?? true) && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </div>
              <p className="text-lg text-secondary-foreground font-medium">{profile.currentRole || "Software Engineering Student"}</p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 md:pt-0">
            {isOwnProfile ? (
              <>
                <Button variant="outline" className="gap-2 rounded-full px-6 bg-white hover:bg-gray-50 border-gray-200">
                  <Share className="h-4 w-4" /> Share
                </Button>
                <EditProfileModal profile={profile} />
              </>
            ) : (
              <Button asChild className="gap-2 rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={`/messages?userId=${profile.userId}`}>
                  <MessageSquare className="h-4 w-4" /> Message
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {profile.location}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" /> {profile.major || "Computer Science"} {profile.graduationYear ? `'${profile.graduationYear.toString().slice(2)}` : ""}
          </div>
          {profile.availability && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> {profile.availability}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
