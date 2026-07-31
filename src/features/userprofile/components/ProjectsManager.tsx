import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProfileResponse, PreviousProject } from "../schemas";
import { addProject, updateProject, deleteProject, ProjectInput, searchSkills, Skill } from "../api";
import { Plus, ExternalLink, Calendar, Github, Loader2, Pencil, Trash2, Search, X } from "lucide-react";

export function ProjectsManager({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PreviousProject | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [startedOn, setStartedOn] = useState("");
  const [endedOn, setEndedOn] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techResults, setTechResults] = useState<Skill[]>([]);
  const [isSearchingTech, setIsSearchingTech] = useState(false);

  // Debounced tech search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (techInput.trim().length >= 2) {
        setIsSearchingTech(true);
        try {
          const res = await searchSkills(techInput);
          setTechResults(res);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearchingTech(false);
        }
      } else {
        setTechResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [techInput]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setProjectUrl("");
    setGithubUrl("");
    setStartedOn("");
    setEndedOn("");
    setTechInput("");
    setTechStack([]);
    setEditingProject(null);
  };

  const handleEdit = (project: PreviousProject) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || "");
    setProjectUrl(project.projectUrl || "");
    setGithubUrl(project.githubUrl || "");
    setStartedOn(project.startedOn || "");
    setEndedOn(project.endedOn || "");
    setTechStack(project.techStack || []);
    setIsOpen(true);
  };

  const addTech = (skillName: string) => {
    if (!techStack.includes(skillName)) {
      setTechStack([...techStack, skillName]);
    }
    setTechInput("");
    setTechResults([]);
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      addTech(techInput.trim());
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      toast.success("Project added successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add project."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; input: ProjectInput }) => updateProject(data.id, data.input),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update project."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to delete project."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: ProjectInput = {
      title,
      description,
      projectUrl,
      githubUrl,
      startedOn: startedOn || undefined,
      endedOn: endedOn || undefined,
      techStack,
    };
    if (editingProject && editingProject.id) {
      updateMutation.mutate({ id: editingProject.id, input });
    } else {
      addMutation.mutate(input);
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5 rounded-t-xl">
        <div>
          <CardTitle className="text-xl text-primary">Previous Projects</CardTitle>
          <CardDescription>Showcase your hackathons, coursework, and personal projects.</CardDescription>
        </div>
        {isOwnProfile && (
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                <DialogDescription>
                  Detail the amazing things you've built!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. SkillSync AI" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startedOn">Start Date</Label>
                    <Input id="startedOn" type="date" value={startedOn} onChange={(e) => setStartedOn(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endedOn">End Date</Label>
                    <Input id="endedOn" type="date" value={endedOn} onChange={(e) => setEndedOn(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectUrl">Live Demo URL</Label>
                    <Input id="projectUrl" type="url" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Repository</Label>
                    <Input id="githubUrl" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStack.map(tech => (
                      <Badge key={tech} variant="secondary" className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => removeTech(tech)}>
                        {tech} ✕
                      </Badge>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="techStack" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleTechKeyDown} placeholder="Search skills (e.g. React, Spring Boot)" className="pl-9" autoComplete="off" />
                    {isSearchingTech && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                  {techResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                      {techResults.map(skill => (
                        <div 
                          key={skill.id} 
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex flex-col"
                          onClick={() => addTech(skill.name)}
                        >
                          <span className="font-medium text-sm">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you built, the challenges you faced, and your role." className="h-24" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                    {(addMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {(!profile.projects || profile.projects.length === 0) && (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
            No projects added yet. Click 'Add Project' to showcase your work!
          </div>
        )}
        
        <div className="grid gap-4">
          {profile.projects?.map((project) => (
            <div key={project.id} className="group border border-border bg-card hover:bg-muted/30 rounded-lg p-5 transition-all relative">
              {isOwnProfile && (
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                  <Button size="icon" variant="secondary" className="w-8 h-8" onClick={() => handleEdit(project)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="w-8 h-8" onClick={() => {
                    if (confirm("Are you sure you want to delete this project?")) {
                      deleteMutation.mutate(project.id!);
                    }
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="pr-16">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
                  {project.title}
                  <div className="flex gap-2">
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors" title="Live Demo">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </h4>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                  {(project.startedOn || project.endedOn) && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.startedOn || "Unknown"} {project.endedOn ? `- ${project.endedOn}` : "- Present"}
                    </div>
                  )}
                </div>
                
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack.map(tech => (
                      <Badge key={tech} variant="outline" className="bg-primary/5 text-primary text-[10px] uppercase font-semibold tracking-wider">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {project.description && (
                  <p className="text-sm text-foreground/80 mt-4 leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
