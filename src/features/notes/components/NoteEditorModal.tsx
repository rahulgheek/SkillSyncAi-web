import React, { useEffect, useState } from "react";
import { NoteResponse, NoteRequest, summarizeNote } from "../api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Pin, PinOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
    setTags(tags.filter((t) => t !== tagToRemove));
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
      toast.success("AI Summarization started. It will appear shortly.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start summarization");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {note ? "Edit Note" : "Create Note"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPinned(!pinned)}
              className={pinned ? "text-primary hover:text-primary/80" : "text-muted-foreground"}
            >
              {pinned ? <Pin className="h-5 w-5 fill-current" /> : <PinOff className="h-5 w-5" />}
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-background/50 border-border/50"
          />
          
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1 cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} <span className="text-xs opacity-50 hover:opacity-100">&times;</span>
              </Badge>
            ))}
            <Input
              placeholder="Add tag (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-48 h-8 text-xs bg-background/50 border-border/50"
            />
          </div>

          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[250px] resize-none bg-background/50 border-border/50 font-medium"
          />

          {note && note.aiSummary && (
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                <Sparkles className="h-4 w-4" />
                AI Summary
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {note.aiSummary}
              </p>
              {note.summaryStatus === "OUTDATED" && (
                <div className="mt-2 text-xs text-orange-400 font-medium">
                  Note was updated since last summary.
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {note && (
              <Button
                variant="outline"
                className="gap-2 bg-gradient-to-r hover:from-primary/10 hover:to-violet-500/10 border-primary/20 text-primary transition-all"
                onClick={handleSummarize}
                disabled={isSummarizing || note.summaryStatus === "PENDING"}
              >
                {isSummarizing || note.summaryStatus === "PENDING" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Summarize with AI
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {note ? "Save Changes" : "Create Note"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
