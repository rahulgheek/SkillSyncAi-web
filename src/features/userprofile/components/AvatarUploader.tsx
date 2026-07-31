import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileResponse } from "../schemas";
import { Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUploadSignature, updateAvatar } from "../api";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    }
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
    <Card className="shadow-sm border-muted">
      <CardHeader>
        <CardTitle className="text-lg">Profile Picture</CardTitle>
        <CardDescription>Upload a professional photo to stand out.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-6">
        <Avatar className="w-24 h-24 border-4 border-background shadow-sm ring-2 ring-primary/20">
          <AvatarImage src={profile.profilePictureUrl || undefined} alt={profile.fullName} />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {profile.fullName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4 w-full">
          <div className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 bg-muted/20 transition-colors hover:bg-muted/30">
            <div className="p-3 bg-background rounded-full shadow-sm">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Drag and drop or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">JPEG, PNG or GIF (max 5MB)</p>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <Button 
              variant="outline" 
              onClick={handleUploadClick}
              disabled={isUploading || updateAvatarMutation.isPending}
            >
              {isUploading || updateAvatarMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Select Image
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
