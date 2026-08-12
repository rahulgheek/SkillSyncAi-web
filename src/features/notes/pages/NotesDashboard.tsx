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
      className="group relative flex flex-col justify-between p-6 rounded-[2rem] border border-gray-100 bg-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-black text-xl line-clamp-1 group-hover:text-primary transition-colors">
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
        
        <p className="text-base font-medium text-muted-foreground line-clamp-3 mb-5">
          {note.content}
        </p>

        {note.aiSummary && (
          <div className="mb-5 p-3 rounded-2xl bg-primary/5 border border-primary/10 text-sm font-medium text-foreground line-clamp-2">
            <span className="font-black text-primary mr-1">AI:</span> 
            {note.aiSummary}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {note.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-2.5 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 border-0 font-bold">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs px-2.5 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 border-0 font-bold">
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
          <h1 className="text-4xl font-extrabold tracking-tight">My <span className="font-handwriting text-primary text-5xl inline-block -rotate-2">Notes</span></h1>
          <p className="text-lg font-medium text-muted-foreground mt-2">Capture ideas, summarize with AI, and stay organized.</p>
        </div>
        <Button onClick={() => handleOpenEditor()} className="gap-2 rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 text-base font-bold">
          <Plus className="h-5 w-5" />
          New Note
        </Button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14 rounded-full bg-white border-gray-200 shadow-sm focus-visible:ring-primary/20 text-base font-medium"
        />
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-[2rem] bg-white shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-black mb-3 text-foreground">No notes yet</h3>
          <p className="text-lg font-medium text-muted-foreground max-w-md mb-8">
            Create your first note to start organizing your thoughts. You can even use AI to summarize long notes!
          </p>
          <Button onClick={() => handleOpenEditor()} className="gap-2 rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold">
            <Plus className="h-5 w-5" />
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
