import React, { useEffect, useState } from "react";
import {
  ArrowRepeat,
  PinAngle,
  PinAngleFill,
  Stars,
  XLg,
} from "react-bootstrap-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { NoteResponse, NoteRequest, summarizeNote } from "../api";

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteResponse | null;
  onSave: (note: NoteRequest, id?: string) => Promise<void>;
}

export function NoteEditorModal({ isOpen, onClose, note, onSave }: NoteEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setPinned(note.pinned);
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setPinned(false);
      setTags([]);
    }
  }, [note, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ title, content, pinned, tags }, note?.id);
      toast.success(note ? "Note updated" : "Note created");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!note?.id) return;
    setIsSummarizing(true);
    try {
      await summarizeNote(note.id);
      toast.success("AI summarization started. It will appear shortly.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start summarization");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dash-modal dash-modal-lg dash-modal-fixed">
        <div className="dash-modal-head">
          <div>
            <DialogTitle className="dash-modal-title">
              {note ? "Edit note" : "New note"}
            </DialogTitle>
            <DialogDescription className="dash-modal-desc">
              Write freely. Pin the ones worth keeping close, and let AI distill the
              long reads.
            </DialogDescription>
          </div>
          <button
            type="button"
            className={`dash-icon-btn-sm${pinned ? " is-pinned" : ""}`}
            onClick={() => setPinned(!pinned)}
            aria-pressed={pinned}
            aria-label={pinned ? "Unpin note" : "Pin note"}
            title={pinned ? "Unpin note" : "Pin note"}
            style={
              pinned
                ? { color: "var(--dash-terracotta)", borderColor: "rgba(138, 90, 63, 0.3)" }
                : undefined
            }
          >
            {pinned ? (
              <PinAngleFill size={12} aria-hidden="true" />
            ) : (
              <PinAngle size={12} aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="dash-modal-body dash-form">
          <div className="dash-field">
            <label className="dash-label" htmlFor="note-title">
              Title
            </label>
            <input
              id="note-title"
              className="dash-input"
              placeholder="Give this note a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="dash-field">
            <label className="dash-label" htmlFor="note-tags">
              Tags
            </label>
            {tags.length > 0 && (
              <div className="dash-tag-row" style={{ marginBottom: 6 }}>
                {tags.map((tag) => (
                  <span key={tag} className="dash-tag">
                    {tag}
                    <button
                      type="button"
                      className="dash-tag-remove"
                      aria-label={`Remove ${tag}`}
                      onClick={() => removeTag(tag)}
                    >
                      <XLg size={9} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              id="note-tags"
              className="dash-input"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>

          <div className="dash-field">
            <label className="dash-label" htmlFor="note-content">
              Note
            </label>
            <textarea
              id="note-content"
              className="dash-textarea"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: 240 }}
            />
          </div>

          {note && note.aiSummary && (
            <div className="dash-note-ai">
              <strong>AI summary</strong>
              <p style={{ margin: "5px 0 0", whiteSpace: "pre-wrap" }}>
                {note.aiSummary}
              </p>
              {note.summaryStatus === "OUTDATED" && (
                <p className="dash-help" style={{ marginTop: 6 }}>
                  Note was updated since the last summary.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="dash-modal-foot">
          <div>
            {note && (
              <button
                type="button"
                className="dash-btn dash-btn-ghost dash-btn-sm"
                onClick={handleSummarize}
                disabled={isSummarizing || note.summaryStatus === "PENDING"}
              >
                {isSummarizing || note.summaryStatus === "PENDING" ? (
                  <ArrowRepeat size={11} className="dash-icon-spin" aria-hidden="true" />
                ) : (
                  <Stars size={11} aria-hidden="true" />
                )}
                Summarize with AI
              </button>
            )}
          </div>
          <div className="dash-modal-actions">
            <button
              type="button"
              className="dash-btn dash-btn-ghost"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-solid"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && (
                <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
              )}
              {note ? "Save changes" : "Create note"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
