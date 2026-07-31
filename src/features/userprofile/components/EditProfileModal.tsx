import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProfileForm } from "./EditProfileForm";
import { SocialLinksForm } from "./SocialLinksForm";
import { ResumeUploader } from "./ResumeUploader";
import { AvatarUploader } from "./AvatarUploader";
import { AchievementsManager } from "./AchievementsManager";
import { ProfileResponse } from "../schemas";
import { Pencil } from "lucide-react";

interface EditProfileModalProps {
  profile: ProfileResponse;
}

export function EditProfileModal({ profile }: EditProfileModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full px-6 border-border hover:bg-secondary">
          <Pencil className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your professional identity here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="picture">Picture</TabsTrigger>
              <TabsTrigger value="socials">Socials</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="achievements">Awards</TabsTrigger>
            </TabsList>
          <TabsContent value="basic" className="mt-4 space-y-4">
            <EditProfileForm profile={profile} />
          </TabsContent>
          <TabsContent value="picture" className="mt-4 space-y-4">
            <AvatarUploader profile={profile} />
          </TabsContent>
          <TabsContent value="socials" className="mt-4 space-y-4">
            <SocialLinksForm profile={profile} />
          </TabsContent>
          <TabsContent value="resume" className="mt-4 space-y-4">
            <ResumeUploader profile={profile} />
          </TabsContent>
          <TabsContent value="achievements" className="mt-4 space-y-4">
            <AchievementsManager profile={profile} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
