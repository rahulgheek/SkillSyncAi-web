import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProjects, deleteProject } from "@/features/projects/api";
import { useState } from "react";
import { Sparkles, Trash2, Inbox, FolderKanban } from "lucide-react";
import ProjectRecommendationsModal from "@/features/projects/components/ProjectRecommendationsModal";
import ManageApplicationsModal from "@/features/projects/components/ManageApplicationsModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [manageProject, setManageProject] = useState<any>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: projectsPage, isLoading } = useQuery({
    queryKey: ["myProjects"],
    queryFn: () => getMyProjects(),
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
    onError: (err: any) => {
      console.error("Failed to delete project", err);
      alert(err.response?.data?.message || "Failed to delete project.");
    }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
  
  const projects = projectsPage?.content || [];

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FolderKanban className="h-10 w-10 text-primary" />
            My Projects
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Manage your published projects, view applications, and find AI matches.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/projects/new')}
          className="rounded-full shadow-sm hover:shadow-md transition-all gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Create New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60 bg-muted/10">
          <FolderKanban className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-xl font-bold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">Create your first project to start recruiting team members.</p>
          <Button onClick={() => navigate('/projects/new')}>Create Project</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project: any) => (
            <div key={project.id} className="p-6 border border-border/50 rounded-xl bg-card shadow-sm hover:shadow-md flex flex-col justify-between group relative transition-all">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if(confirm("Are you sure you want to permanently delete this project?")) {
                    deleteMutation.mutate(project.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <div>
                <div className="flex items-center gap-3 mb-2 pr-10">
                  <h3 
                    className="text-xl font-bold cursor-pointer hover:text-primary transition-colors truncate"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.title}
                  </h3>
                  {project.status === 'IN_PROGRESS' && (
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                      Team Full
                    </Badge>
                  )}
                  {project.status === 'RECRUITING' && (
                    <Badge variant="outline" className="text-indigo-500 border-indigo-200 bg-indigo-50 dark:bg-indigo-500/10">
                      Recruiting
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{project.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-border/40">
                <Button 
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm border-0"
                  disabled={project.status === 'IN_PROGRESS'}
                >
                  <Sparkles className="w-4 h-4 mr-2" /> AI Matches
                </Button>
                <Button
                  onClick={() => setManageProject(project)}
                  variant="outline"
                  className="flex-1 border-primary/20 hover:bg-primary/5"
                >
                  <Inbox className="w-4 h-4 mr-2" /> Candidates
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedProject && (
        <ProjectRecommendationsModal 
          project={selectedProject} 
          isOpen={!!selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
      
      {manageProject && (
        <ManageApplicationsModal 
          project={manageProject} 
          isOpen={!!manageProject} 
          onClose={() => setManageProject(null)} 
        />
      )}
    </div>
  );
}
