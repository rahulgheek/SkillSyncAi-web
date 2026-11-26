import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRepeat,
  Clock,
  FileEarmarkText,
  JournalText,
  PinAngleFill,
  PinFill,
  PlusLg,
  Search,
  Trash3,
} from "react-bootstrap-icons";
import { toast } from "sonner";
import {
  getMyNotes,
  deleteNote,
  createNote,
  updateNote,
  NoteResponse,
  NoteRequest,
} from "../api";
import { NoteEditorModal } from "../components/NoteEditorModal";

export function NotesDashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getMyNotes(0, 100),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ request, id }: { request: NoteRequest; id?: string }) =>
      id ? updateNote(id, request) : createNote(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = data?.content || [];

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const otherNotes = filteredNotes.filter((note) => !note.pinned);

  const handleOpenEditor = (note?: NoteResponse) => {
    setEditingNote(note || null);
    setIsEditorOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async (request: NoteRequest, id?: string) => {
    await saveMutation.mutateAsync({ request, id });
  };

  const renderNoteCard = (note: NoteResponse) => (
    <article
      key={note.id}
      role="button"
      tabIndex={0}
      onClick={() => handleOpenEditor(note)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenEditor(note);
        }
      }}
      className="dash-note-card"
    >
      <div className="dash-note-top">
        <h3 className="dash-note-title">{note.title}</h3>
        <div className="dash-note-actions">
          {note.pinned && (
            <span className="dash-note-pin" aria-label="Pinned note">
              <PinAngleFill size={12} aria-hidden="true" />
            </span>
          )}
          <button
            type="button"
            className="dash-icon-btn-sm is-danger"
            aria-label={`Delete ${note.title}`}
            onClick={(event) => handleDelete(event, note.id)}
          >
            <Trash3 size={10} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="dash-note-body">{note.content}</p>

      {note.summaryStatus === "PROCESSING" && (
        <div className="dash-note-ai" role="status" aria-live="polite">
          <strong>AI summary</strong>
          <br />
          <span className="dash-help">
            <ArrowRepeat size={10} className="dash-icon-spin" aria-hidden="true" />{" "}
            Summarizing...
          </span>
        </div>
      )}

      {note.summaryStatus === "FAILED" && !note.aiSummary && (
        <div className="dash-note-ai">
          <strong>AI summary</strong>
          <br />
          <span className="dash-help">
            Summarization failed. Open the note to retry.
          </span>
        </div>
      )}

      {note.aiSummary && (
        <div className="dash-note-ai">
          <strong>AI summary</strong>
          <br />
          {note.aiSummary}
        </div>
      )}

      <div className="dash-note-foot">
        <div className="dash-tag-row">
          {note.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="dash-tag">
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="dash-tag">+{note.tags.length - 2}</span>
          )}
        </div>
        <span className="dash-note-time">
          <Clock size={9} aria-hidden="true" />
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </article>
  );

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Notes</p>
          <h1 className="dash-title">
            A desk for <em>loose thoughts.</em>
          </h1>
          <p className="dash-sub">
            Capture ideas, summarize the long ones with AI, and keep them close.
          </p>
        </div>
        <div className="dash-head-actions">
          <button
            type="button"
            className="dash-btn dash-btn-solid"
            onClick={() => handleOpenEditor()}
          >
            <PlusLg size={12} aria-hidden="true" />
            New note
          </button>
        </div>
      </header>

      <div className="dash-searchbar" role="search">
        <div className="dash-input-wrap">
          <Search size={13} aria-hidden="true" />
          <input
            className="dash-input"
            placeholder="Search titles, content, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search notes"
          />
        </div>
        <span className="dash-badge dash-badge-soft">
          {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
        </span>
      </div>

      {isLoading ? (
        <div className="dash-page-loader" role="status" aria-label="Loading notes">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Opening your notes</span>
        </div>
      ) : notes.length === 0 ? (
        <div className="dash-empty dash-panel">
          <span className="dash-empty-icon">
            <FileEarmarkText size={19} aria-hidden="true" />
          </span>
          <h3>No notes yet</h3>
          <p>
            Create your first note to start organizing your thoughts. You can
            even ask AI to summarize the long ones.
          </p>
          <button
            type="button"
            className="dash-btn dash-btn-solid"
            onClick={() => handleOpenEditor()}
          >
            <PlusLg size={12} aria-hidden="true" />
            Create note
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="dash-empty dash-panel">
          <span className="dash-empty-icon">
            <JournalText size={19} aria-hidden="true" />
          </span>
          <h3>Nothing matches that search</h3>
          <p>Try a different title, phrase, or tag.</p>
        </div>
      ) : (
        <div className="dash-stack">
          {pinnedNotes.length > 0 && (
            <section>
              <h2 className="dash-note-section-head">
                <PinFill size={10} aria-hidden="true" />
                Pinned
              </h2>
              <div className="dash-notes-grid">{pinnedNotes.map(renderNoteCard)}</div>
            </section>
          )}

          {otherNotes.length > 0 && (
            <section>
              {pinnedNotes.length > 0 && (
                <h2 className="dash-note-section-head">Others</h2>
              )}
              <div className="dash-notes-grid">{otherNotes.map(renderNoteCard)}</div>
            </section>
          )}
        </div>
      )}

      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        note={editingNote}
        onSave={handleSave}
        onSummaryUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ["notes"] });
        }}
      />
    </div>
  );
}
