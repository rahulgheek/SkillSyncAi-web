import {
  Briefcase,
  CheckCircleFill,
  Envelope,
  GeoAlt,
  Mortarboard,
  Share,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/features/dashboard/utils";
import { ProfileResponse } from "../schemas";
import { EditProfileModal } from "../components/EditProfileModal";

export function ProfileHero({
  profile,
  isOwnProfile = true,
}: {
  profile: ProfileResponse;
  isOwnProfile?: boolean;
}) {
  const avatarUrl =
    profile.profilePictureUrl ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.userId;

  const handleShare = async () => {
    const url = `${window.location.origin}/profiles/${profile.userId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard");
    } catch {
      toast.error("Could not copy the profile link");
    }
  };

  const classYear = profile.graduationYear
    ? `Class of ${profile.graduationYear}`
    : "Class of 2026";

  return (
    <section className="dash-profile-hero" aria-labelledby="profile-name">
      <div className="dash-profile-hero-cover">
        <span className="dash-profile-hero-grain" aria-hidden="true" />
      </div>

      <div className="dash-profile-hero-body">
        <div className="dash-profile-hero-main">
          <div className="dash-profile-hero-identity">
            <Avatar className="dash-profile-hero-avatar">
              <AvatarImage src={avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="dash-avatar-fallback">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="dash-profile-hero-copy">
              <h1 className="dash-profile-hero-name" id="profile-name">
                {profile.fullName}
                {(profile.isVerified ?? true) && (
                  <CheckCircleFill size={16} color="#8f8d6e" aria-label="Verified profile" />
                )}
              </h1>
              <p className="dash-profile-hero-role">
                {profile.currentRole || "Software Engineering Student"}
              </p>
              {isOwnProfile && profile.email && (
                <span className="dash-profile-hero-email">
                  <Envelope size={10} aria-hidden="true" />
                  {profile.email}
                </span>
              )}
            </div>
          </div>

          <div className="dash-profile-hero-actions">
            {isOwnProfile ? (
              <>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={handleShare}>
                  <Share size={12} aria-hidden="true" />
                  Share
                </button>
                <EditProfileModal profile={profile} />
              </>
            ) : (
              <Link
                to={`/messages?userId=${profile.userId}`}
                className="dash-btn dash-btn-solid"
              >
                <Envelope size={12} aria-hidden="true" />
                Message
              </Link>
            )}
          </div>
        </div>

        <div className="dash-profile-hero-meta">
          {profile.location && (
            <span>
              <GeoAlt size={11} aria-hidden="true" />
              {profile.location}
            </span>
          )}
          <span>
            <Mortarboard size={11} aria-hidden="true" />
            {profile.major || "Computer Science"} · {classYear}
          </span>
          {profile.availability && (
            <span>
              <Briefcase size={11} aria-hidden="true" />
              {profile.availability}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
