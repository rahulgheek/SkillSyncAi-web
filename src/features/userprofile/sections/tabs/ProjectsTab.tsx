import { ProfileResponse } from "../../../schemas";
import { ProjectsManager } from "../../components/ProjectsManager";

export function ProjectsTab({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  return (
    <div className="space-y-6">
      <ProjectsManager profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
