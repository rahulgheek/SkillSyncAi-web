import { ProfileResponse } from "../schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "../components/EditProfileModal";
import { MapPin, Briefcase, GraduationCap, CheckCircle, Share } from "lucide-react";

import { Link } from "react-router-dom";
import { MessageSquare, Mail } from "lucide-react";
import { useAuth } from "@/features/auth/context";

import { tokenStorage } from "@/lib/token-storage";

export function ProfileHero({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  const avatarUrl = profile.profilePictureUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.userId;

  return (
    <div className="relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50 transition-all">
      {/* Banner */}
      <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-primary/10 to-accent/10 relative">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
      </div>

      <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-14 sm:-mt-16 md:-mt-20 gap-4 md:gap-0 relative z-10">
          <div className="flex items-end gap-3 sm:gap-5 min-w-0">
            <div className="relative shrink-0">
              <div className="h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                <img src={avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
              </div>
              {profile.availability && (
                <div className="absolute bottom-3 right-3 h-6 w-6 bg-green-500 rounded-full border-4 border-white shadow-sm" title={profile.availability} />
              )}
            </div>
            <div className="pb-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight break-words">{profile.fullName}</h1>
                {(profile.isVerified ?? true) && <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-blue-500" />}
              </div>
              <p className="text-base sm:text-lg text-muted-foreground font-bold break-words">{profile.currentRole || "Software Engineering Student"}</p>
              {isOwnProfile && profile.email && (
                <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-muted-foreground bg-gray-50/50 px-2 py-1 rounded-md border border-gray-100 w-fit max-w-full">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="break-all">{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 sm:pt-4 md:pt-0 w-full md:w-auto">
            {isOwnProfile ? (
              <>
                <Button variant="outline" className="flex-1 sm:flex-none gap-2 rounded-xl px-6 bg-white hover:bg-gray-50 border-gray-200 font-bold shadow-sm h-11">
                  <Share className="h-4 w-4" /> Share
                </Button>
                <EditProfileModal profile={profile} />
              </>
            ) : (
              <Button asChild className="flex-1 sm:flex-none gap-2 rounded-xl px-8 h-11 bg-primary text-white hover:bg-primary/90 font-bold shadow-md shadow-primary/20">
                <Link to={`/messages?userId=${profile.userId}`}>
                  <MessageSquare className="h-4 w-4" /> Message
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-muted-foreground">
          {profile.location && (
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 shrink-0 text-primary" /> <span className="break-words">{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <GraduationCap className="h-4 w-4 shrink-0 text-accent" /> <span className="break-words">{profile.major || "Computer Science"} {profile.graduationYear ? `'${profile.graduationYear.toString().slice(2)}` : ""}</span>
          </div>
          {profile.availability && (
            <div className="flex items-center gap-2 min-w-0">
              <Briefcase className="h-4 w-4 shrink-0 text-blue-500" /> <span className="break-words">{profile.availability}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
