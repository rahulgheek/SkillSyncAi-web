import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRepeat,
  BoxArrowUpRight,
  Building,
  Calendar3,
  PencilSquare,
  PlusLg,
  Trash3,
  Trophy,
  Upload,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileResponse, Achievement } from "../schemas";
import {
  addAchievement,
  updateAchievement,
  deleteAchievement,
  AchievementInput,
  getUploadSignature,
} from "../api";
import axios from "axios";

export function AchievementsManager({
  profile,
  isOwnProfile = true,
}: {
  profile: ProfileResponse;
  isOwnProfile?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Certificate");
  const [certificateUrl, setCertificateUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setOrganization("");
    setDate("");
    setDescription("");
    setType("Certificate");
    setCertificateUrl("");
    setEditingAchievement(null);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setTitle(achievement.title);
    setOrganization(achievement.organization);
    setDate(achievement.date);
    setDescription(achievement.description || "");
    setType(achievement.type);
    setCertificateUrl(achievement.certificateUrl || "");
    setIsOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const sigData = await getUploadSignature("raw");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/raw/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCertificateUrl(res.data.secure_url);
      toast.success("Certificate uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload certificate.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addMutation = useMutation({
    mutationFn: addAchievement,
    onSuccess: () => {
      toast.success("Achievement added successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add achievement."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; input: AchievementInput }) =>
      updateAchievement(data.id, data.input),
    onSuccess: () => {
      toast.success("Achievement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update achievement."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      toast.success("Achievement deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to delete achievement."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: AchievementInput = {
      title,
      organization,
      date,
      description,
      type,
      certificateUrl: certificateUrl || undefined,
    };
    if (editingAchievement && editingAchievement.id) {
      updateMutation.mutate({ id: editingAchievement.id, input });
    } else {
      addMutation.mutate(input);
    }
  };

  return (
    <div className="dash-stack">
      <div className="dash-spread">
        <div>
          <h2 className="dash-mini-title">Honors & awards</h2>
          <p className="dash-mini-sub">
            Certificates, hackathons, and the moments worth keeping.
          </p>
        </div>
        {isOwnProfile && (
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <button type="button" className="dash-btn dash-btn-ghost dash-btn-sm">
                <PlusLg size={11} aria-hidden="true" />
                Add achievement
              </button>
            </DialogTrigger>
            <DialogContent className="dash-modal">
              <div className="dash-modal-head">
                <div>
                  <DialogTitle className="dash-modal-title">
                    {editingAchievement ? "Edit achievement" : "Add an achievement"}
                  </DialogTitle>
                  <DialogDescription className="dash-modal-desc">
                    Record the win and attach a certificate or proof.
                  </DialogDescription>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="dash-modal-body dash-form">
                  <div className="dash-field">
                    <label className="dash-label" htmlFor="achievement-title">
                      Title *
                    </label>
                    <input
                      id="achievement-title"
                      className="dash-input"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. AWS Solutions Architect"
                    />
                  </div>

                  <div className="dash-form-grid">
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="achievement-org">
                        Organization *
                      </label>
                      <input
                        id="achievement-org"
                        className="dash-input"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="achievement-date">
                        Date achieved *
                      </label>
                      <input
                        id="achievement-date"
                        className="dash-input"
                        type="month"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="dash-form-grid">
                    <div className="dash-field">
                      <label className="dash-label" htmlFor="achievement-type">
                        Type *
                      </label>
                      <select
                        id="achievement-type"
                        className="dash-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="Certificate">Certificate</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Competition">Competition</option>
                        <option value="Award">Award</option>
                        <option value="Badge">Badge</option>
                      </select>
                    </div>
                    <div className="dash-field">
                      <span className="dash-label">Certificate / proof</span>
                      <button
                        type="button"
                        className="dash-btn dash-btn-ghost"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploading ? (
                          <ArrowRepeat
                            size={12}
                            className="dash-icon-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Upload size={12} aria-hidden="true" />
                        )}
                        {certificateUrl ? "Replace file" : "Upload file"}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>

                  {certificateUrl && (
                    <div className="dash-alert">
                      <Trophy size={12} aria-hidden="true" />
                      <span style={{ flex: 1 }}>Certificate uploaded successfully.</span>
                      <a
                        href={certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                      >
                        View
                        <BoxArrowUpRight size={10} aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        className="dash-icon-btn-sm is-danger"
                        aria-label="Remove certificate"
                        onClick={() => setCertificateUrl("")}
                      >
                        <Trash3 size={10} aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  <div className="dash-field">
                    <label className="dash-label" htmlFor="achievement-description">
                      Description
                    </label>
                    <textarea
                      id="achievement-description"
                      className="dash-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what this achievement is about."
                    />
                  </div>
                </div>

                <div className="dash-modal-foot">
                  <span className="dash-help">Proof builds trust with teammates</span>
                  <div className="dash-modal-actions">
                    <button
                      type="button"
                      className="dash-btn dash-btn-ghost"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dash-btn dash-btn-solid"
                      disabled={
                        addMutation.isPending ||
                        updateMutation.isPending ||
                        isUploading
                      }
                    >
                      {(addMutation.isPending || updateMutation.isPending) && (
                        <ArrowRepeat
                          size={12}
                          className="dash-icon-spin"
                          aria-hidden="true"
                        />
                      )}
                      Save achievement
                    </button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {(!profile.achievements || profile.achievements.length === 0) && (
        <div className="dash-empty-inline dash-panel-soft">
          <Trophy size={18} color="#8f8d6e" aria-hidden="true" />
          <p>No achievements added yet.</p>
        </div>
      )}

      <div className="dash-stack-sm">
        {profile.achievements?.map((achievement) => (
          <article key={achievement.id} className="dash-entry">
            <div className="dash-spread">
              <div style={{ minWidth: 0 }}>
                <h3 className="dash-entry-title">
                  {achievement.title}
                  <span className="dash-badge dash-badge-soft">{achievement.type}</span>
                </h3>
                <div className="dash-entry-meta">
                  <span>
                    <Building size={10} aria-hidden="true" />
                    {achievement.organization}
                  </span>
                  <span>
                    <Calendar3 size={10} aria-hidden="true" />
                    {achievement.date}
                  </span>
                </div>
              </div>

              {isOwnProfile && (
                <div className="dash-entry-actions">
                  <button
                    type="button"
                    className="dash-icon-btn-sm"
                    aria-label={`Edit ${achievement.title}`}
                    onClick={() => handleEdit(achievement)}
                  >
                    <PencilSquare size={11} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="dash-icon-btn-sm is-danger"
                    aria-label={`Delete ${achievement.title}`}
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this achievement?")) {
                        deleteMutation.mutate(achievement.id!);
                      }
                    }}
                  >
                    <Trash3 size={11} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {achievement.description && (
              <p className="dash-entry-text">{achievement.description}</p>
            )}

            {achievement.certificateUrl && (
              <div style={{ marginTop: 10 }}>
                <a
                  href={achievement.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dash-btn dash-btn-ghost dash-btn-sm"
                >
                  <BoxArrowUpRight size={11} aria-hidden="true" />
                  View certificate
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
