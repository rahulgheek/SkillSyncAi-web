import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRepeat, CloudUpload, Image as ImageIcon } from "react-bootstrap-icons";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/features/dashboard/utils";
import { ProfileResponse } from "../schemas";
import { getUploadSignature, updateAvatar } from "../api";

export function AvatarUploader({ profile }: { profile: ProfileResponse }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateAvatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile picture updated successfully!");
    },
    onError: () => {
      toast.error("Failed to save profile picture.");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const sigData = await getUploadSignature("avatar");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const secureUrl = uploadRes.data.secure_url;

      updateAvatarMutation.mutate(secureUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dash-stack">
      <div>
        <h2 className="dash-mini-title">Profile picture</h2>
        <p className="dash-mini-sub">
          A clear, friendly photo helps teammates put a face to the work.
        </p>
      </div>

      <div className="dash-avatar-upload">
        <Avatar className="dash-avatar-xl">
          <AvatarImage src={profile.profilePictureUrl || undefined} alt={profile.fullName} />
          <AvatarFallback className="dash-avatar-fallback">
            {getInitials(profile.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="dash-dropzone">
          <span className="dash-dropzone-icon">
            <ImageIcon size={16} aria-hidden="true" />
          </span>
          <div>
            <strong>Drop a photo or browse</strong>
            <p>JPEG, PNG or GIF · max 5MB</p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="dash-btn dash-btn-ghost dash-btn-sm"
            onClick={handleUploadClick}
            disabled={isUploading || updateAvatarMutation.isPending}
          >
            {isUploading || updateAvatarMutation.isPending ? (
              <>
                <ArrowRepeat size={11} className="dash-icon-spin" aria-hidden="true" />
                Uploading
              </>
            ) : (
              <>
                <CloudUpload size={11} aria-hidden="true" />
                Select image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
