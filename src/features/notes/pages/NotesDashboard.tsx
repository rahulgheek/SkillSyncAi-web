import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyNotes, deleteNote, createNote, updateNote, NoteResponse, NoteRequest } from "../api";
import { NoteEditorModal } from "../components/NoteEditorModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Pin, Clock, MoreVertical, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
  
  const filteredNotes = notes.filter((note) => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  const renderNoteCard = (note: NoteResponse) => (
    <div
      key={note.id}
      onClick={() => handleOpenEditor(note)}
      className="group relative flex flex-col justify-between p-5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-primary/30 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-violet-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {note.title}
          </h3>
          <div className="flex items-center gap-1">
            {note.pinned && <Pin className="h-4 w-4 text-primary fill-current" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => handleDelete(e, note.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {note.content}
        </p>

        {note.aiSummary && (
          <div className="mb-4 p-2.5 rounded bg-primary/5 border border-primary/10 text-xs text-foreground/80 line-clamp-2">
            <span className="font-semibold text-primary mr-1">AI:</span> 
            {note.aiSummary}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 2 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              +{note.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
          <p className="text-muted-foreground mt-1">Capture ideas, summarize with AI, and stay organized.</p>
        </div>
        <Button onClick={() => handleOpenEditor()} className="gap-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white shadow-md">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card/50 backdrop-blur-sm border-border/50"
        />
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl border-dashed border-border/50 bg-card/20">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Create your first note to start organizing your thoughts. You can even use AI to summarize long notes!
          </p>
          <Button onClick={() => handleOpenEditor()} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Pin className="h-4 w-4" /> Pinned
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </div>
          )}

          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Others
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherNotes.map(renderNoteCard)}
              </div>
            </div>
          )}
        </div>
      )}

      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        note={editingNote}
        onSave={handleSave}
      />
    </div>
  );
}
