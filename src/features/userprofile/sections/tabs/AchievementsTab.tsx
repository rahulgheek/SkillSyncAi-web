import { ProfileResponse } from "../../../schemas";
import { AchievementsManager } from "../../components/AchievementsManager";

export function AchievementsTab({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  return (
    <div className="space-y-6">
      <AchievementsManager profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
