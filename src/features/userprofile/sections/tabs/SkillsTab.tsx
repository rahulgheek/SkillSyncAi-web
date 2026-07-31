import { ProfileResponse } from "../../../schemas";
import { SkillsManager } from "../../components/SkillsManager";

export function SkillsTab({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  return (
    <div className="space-y-6">
      <SkillsManager profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
