import { useState } from "react";
import {
  FileEarmarkText,
  Image,
  Link45deg,
  PencilSquare,
  PersonVcard,
  Trophy,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProfileForm } from "./EditProfileForm";
import { SocialLinksForm } from "./SocialLinksForm";
import { ResumeUploader } from "./ResumeUploader";
import { AvatarUploader } from "./AvatarUploader";
import { AchievementsManager } from "./AchievementsManager";
import { ProfileResponse } from "../schemas";

type EditTab = "basic" | "picture" | "socials" | "resume" | "achievements";

interface EditProfileModalProps {
  profile: ProfileResponse;
}

export function EditProfileModal({ profile }: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<EditTab>("basic");

  const tabs: { id: EditTab; label: string; icon: typeof Image }[] = [
    { id: "basic", label: "Basic info", icon: PersonVcard },
    { id: "picture", label: "Picture", icon: Image },
    { id: "socials", label: "Socials", icon: Link45deg },
    { id: "resume", label: "Resume", icon: FileEarmarkText },
    { id: "achievements", label: "Awards", icon: Trophy },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="dash-btn dash-btn-solid">
          <PencilSquare size={12} aria-hidden="true" />
          Edit profile
        </button>
      </DialogTrigger>
      <DialogContent className="dash-modal dash-modal-lg">
        <div className="dash-modal-head">
          <div>
            <DialogTitle className="dash-modal-title">Edit profile</DialogTitle>
            <DialogDescription className="dash-modal-desc">
              Keep your professional identity current. Changes save per section.
            </DialogDescription>
          </div>
        </div>

        <div className="dash-tabs" role="tablist" style={{ paddingInline: 6 }}>
          {tabs.map((tab) => {
            const IconGlyph = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`dash-tab${activeTab === tab.id ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconGlyph size={11} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="dash-modal-body">
          {activeTab === "basic" && <EditProfileForm profile={profile} />}
          {activeTab === "picture" && <AvatarUploader profile={profile} />}
          {activeTab === "socials" && <SocialLinksForm profile={profile} />}
          {activeTab === "resume" && <ResumeUploader profile={profile} />}
          {activeTab === "achievements" && <AchievementsManager profile={profile} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
