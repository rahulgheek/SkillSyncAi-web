import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileResponse } from "../schemas";
import { FileText, UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUploadSignature, updateResume } from "../api";
import axios from "axios";

export function ResumeUploader({ profile }: { profile: ProfileResponse }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateResumeMutation = useMutation({
    mutationFn: updateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume updated successfully!");
    },
    onError: () => {
      toast.error("Failed to save resume URL to profile.");
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get signature from backend
      const sigData = await getUploadSignature("resume");
      
      // 2. Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      // 3. Upload to Cloudinary (use raw to bypass image/PDF transformation security restrictions)
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/raw/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      const secureUrl = uploadRes.data.secure_url;
      
      // 4. Update backend profile with new URL
      updateResumeMutation.mutate(secureUrl);
      
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
        <CardTitle className="text-lg">Resume</CardTitle>
        <CardDescription>Upload your latest resume for recruiters and teammates.</CardDescription>
      </CardHeader>
      <CardContent>
        {profile.resumeUrl && (
          <div className="flex items-center justify-between p-4 mb-4 border rounded-lg bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Current Resume</p>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  View Document
                </a>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
        
        <div className="border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-3 bg-muted/20 transition-colors hover:bg-muted/30">
          <div className="p-3 bg-secondary/20 rounded-full">
            <UploadCloud className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 5MB</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx" 
            className="hidden" 
          />
          <Button onClick={handleUploadClick} disabled={isUploading || updateResumeMutation.isPending} variant="outline" className="mt-2 w-32">
            {(isUploading || updateResumeMutation.isPending) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              profile.resumeUrl ? "Replace File" : "Select File"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
