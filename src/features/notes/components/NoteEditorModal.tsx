import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { normalizeError } from "@/lib/api/errors";
import { NoteResponse, NoteRequest, getNote, summarizeNote } from "../api";

const SUMMARY_POLL_INTERVAL_MS = 2000;
const SUMMARY_POLL_ATTEMPTS = 45;

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteResponse | null;
  onSave: (note: NoteRequest, id?: string) => Promise<void>;
  onSummaryUpdated?: () => void;
}

export function NoteEditorModal({
  isOpen,
  onClose,
  note,
  onSave,
  onSummaryUpdated,
}: NoteEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryStatus, setSummaryStatus] =
    useState<NoteResponse["summaryStatus"]>("IDLE");

  const pollToken = useRef(0);
  const onSummaryUpdatedRef = useRef(onSummaryUpdated);

  useEffect(() => {
    onSummaryUpdatedRef.current = onSummaryUpdated;
  }, [onSummaryUpdated]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setPinned(note.pinned);
      setTags(note.tags || []);
      setSummary(note.aiSummary || "");
      setSummaryStatus(note.summaryStatus);
    } else {
      setTitle("");
      setContent("");
      setPinned(false);
      setTags([]);
      setSummary("");
      setSummaryStatus("IDLE");
    }
  }, [note, isOpen]);

  const pollSummary = useCallback(async (noteId: string, announce: boolean) => {
    const token = ++pollToken.current;

    for (let attempt = 0; attempt < SUMMARY_POLL_ATTEMPTS; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, SUMMARY_POLL_INTERVAL_MS));
      if (pollToken.current !== token) return;

      try {
        const latest = await getNote(noteId);
        if (pollToken.current !== token) return;

        if (latest.summaryStatus === "COMPLETED") {
          setSummary(latest.aiSummary || "");
          setSummaryStatus("COMPLETED");
          onSummaryUpdatedRef.current?.();
          if (announce) toast.success("AI summary is ready.");
          return;
        }

        if (latest.summaryStatus === "FAILED") {
          setSummaryStatus("FAILED");
          if (announce) {
            toast.error("AI could not summarize this note. Please try again.");
          }
          return;
        }
      } catch {
        // A transient read failure should not stop the polling loop.
      }
    }

    if (pollToken.current === token) {
      setSummaryStatus("FAILED");
      if (announce) {
        toast.error("Summarization is taking too long. Please try again.");
      }
    }
  }, []);

  // A summarization may already be running when the modal is opened.
  useEffect(() => {
    if (!isOpen || !note?.id || note.summaryStatus !== "PROCESSING") {
      return;
    }

    let active = true;
    setIsSummarizing(true);
    pollSummary(note.id, false).finally(() => {
      if (active) setIsSummarizing(false);
    });

    return () => {
      active = false;
      pollToken.current += 1;
    };
  }, [isOpen, note?.id, note?.summaryStatus, pollSummary]);

  const isSummaryPending = isSummarizing || summaryStatus === "PROCESSING";

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
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!note?.id || isSummaryPending) return;

    setIsSummarizing(true);
    setSummaryStatus("PROCESSING");

    try {
      await summarizeNote(note.id);
      toast.success("AI is summarizing your note...");
      await pollSummary(note.id, true);
    } catch (err) {
      setSummaryStatus("FAILED");
      toast.error(normalizeError(err).message);
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

          {note && summaryStatus === "PROCESSING" && (
            <div className="dash-note-ai" role="status" aria-live="polite">
              <strong>AI summary</strong>
              <p
                className="dash-help"
                style={{ margin: "5px 0 0", display: "flex", alignItems: "center", gap: 8 }}
              >
                <ArrowRepeat size={11} className="dash-icon-spin" aria-hidden="true" />
                Summarizing your note...
              </p>
            </div>
          )}

          {note && summaryStatus === "FAILED" && !summary && (
            <div className="dash-note-ai">
              <strong>AI summary</strong>
              <p className="dash-help" style={{ margin: "5px 0 0" }}>
                The last summarization failed. You can try again.
              </p>
            </div>
          )}

          {note && summary && (
            <div className="dash-note-ai">
              <strong>AI summary</strong>
              <p style={{ margin: "5px 0 0", whiteSpace: "pre-wrap" }}>{summary}</p>
              {summaryStatus === "FAILED" && (
                <p className="dash-help" style={{ marginTop: 6 }}>
                  A newer summary could not be generated. Showing the last saved one.
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
                disabled={isSummaryPending}
                aria-busy={isSummaryPending}
              >
                {isSummaryPending ? (
                  <>
                    <ArrowRepeat size={11} className="dash-icon-spin" aria-hidden="true" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Stars size={11} aria-hidden="true" />
                    {summaryStatus === "FAILED" ? "Retry summary" : "Summarize with AI"}
                  </>
                )}
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
