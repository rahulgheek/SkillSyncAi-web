import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRepeat,
  BoxArrowUpRight,
  CheckCircleFill,
  CloudUpload,
  FileEarmarkText,
} from "react-bootstrap-icons";
import { toast } from "sonner";
import axios from "axios";
import { ProfileResponse } from "../schemas";
import { getUploadSignature, updateResume } from "../api";

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
    },
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
      const sigData = await getUploadSignature("resume");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/raw/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const secureUrl = uploadRes.data.secure_url;

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
    <div className="dash-stack">
      <div>
        <h2 className="dash-mini-title">Resume</h2>
        <p className="dash-mini-sub">
          Keep your latest resume on hand for recruiters and teammates.
        </p>
      </div>

      {profile.resumeUrl && (
        <div className="dash-entry">
          <div className="dash-spread">
            <div className="dash-inline" style={{ flexWrap: "nowrap" }}>
              <span className="dash-list-icon">
                <FileEarmarkText size={14} aria-hidden="true" />
              </span>
              <div>
                <span className="dash-list-title">Current resume</span>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dash-list-sub"
                  style={{ color: "var(--dash-terracotta)" }}
                >
                  View document
                </a>
              </div>
            </div>
            <span className="dash-inline" style={{ color: "#6f7a56" }}>
              <CheckCircleFill size={14} aria-label="Resume uploaded" />
            </span>
          </div>
        </div>
      )}

      <div className="dash-dropzone">
        <span className="dash-dropzone-icon">
          <CloudUpload size={16} aria-hidden="true" />
        </span>
        <div>
          <strong>Click to upload or drop a file</strong>
          <p>PDF, DOC or DOCX · up to 5MB</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
        <button
          type="button"
          className="dash-btn dash-btn-ghost dash-btn-sm"
          onClick={handleUploadClick}
          disabled={isUploading || updateResumeMutation.isPending}
        >
          {isUploading || updateResumeMutation.isPending ? (
            <>
              <ArrowRepeat size={11} className="dash-icon-spin" aria-hidden="true" />
              Uploading
            </>
          ) : (
            <>
              <CloudUpload size={11} aria-hidden="true" />
              {profile.resumeUrl ? "Replace file" : "Select file"}
            </>
          )}
        </button>
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="dash-help"
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            Open current resume
            <BoxArrowUpRight size={9} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
