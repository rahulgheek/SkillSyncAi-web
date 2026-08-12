import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProjects, deleteProject } from "@/features/projects/api";
import { useState } from "react";
import { Sparkles, Trash2, Inbox, FolderKanban } from "lucide-react";
import ProjectRecommendationsModal from "@/features/projects/components/ProjectRecommendationsModal";
import ManageApplicationsModal from "@/features/projects/components/ManageApplicationsModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/animated/FadeIn";
import Folder from "@/components/ui/react-bits/Folder";

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
    <FadeIn delay={0.1} className="mx-auto max-w-6xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FolderKanban className="h-10 w-10 text-primary" />
            My <span className="font-handwriting text-primary text-5xl inline-block -rotate-2 ml-1">Projects</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Manage your published projects, view applications, and find AI matches.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-semibold text-primary block">Create New</span>
            <span className="text-xs text-muted-foreground block">Click folder to start</span>
          </div>
          <div className="relative h-20 w-24 flex items-center justify-center -mt-4 cursor-pointer" onClick={() => navigate('/projects/new')}>
             <Folder size={1.2} color="#6366f1" />
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-[2rem] bg-white shadow-xl shadow-gray-200/50 border border-gray-100 mt-8">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
            <FolderKanban className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-black mb-3 text-foreground">No projects yet</h3>
          <p className="text-lg font-medium text-muted-foreground max-w-md mb-8">
            Create your first project to start recruiting team members.
          </p>
          <Button onClick={() => navigate('/projects/new')} className="gap-2 rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold">
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {projects.map((project: any, idx: number) => (
            <FadeIn key={project.id} delay={0.2 + idx * 0.1} className="h-full">
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 h-full flex flex-col justify-between shadow-xl shadow-gray-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 z-10 rounded-full h-10 w-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Are you sure you want to permanently delete this project?")) {
                      deleteMutation.mutate(project.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <div className="relative z-10 mt-2">
                  <div className="flex items-center gap-3 mb-4 pr-10">
                    <h3 
                      className="text-2xl font-black cursor-pointer hover:text-primary transition-colors truncate"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      {project.title}
                    </h3>
                    {project.status === 'IN_PROGRESS' && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold border-0">
                        Team Full
                      </Badge>
                    )}
                    {project.status === 'RECRUITING' && (
                      <Badge className="bg-primary text-white font-bold border-0 shadow-sm shadow-primary/20 hover:bg-primary/90">
                        Recruiting
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-base font-medium text-muted-foreground line-clamp-2 mb-8">{project.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-gray-100 relative z-10">
                  <Button 
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 rounded-xl h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold transition-transform hover:-translate-y-1"
                    disabled={project.status === 'IN_PROGRESS'}
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> AI Matches
                  </Button>
                  <Button
                    onClick={() => setManageProject(project)}
                    variant="outline"
                    className="flex-1 rounded-xl h-12 border-gray-200 hover:border-primary hover:bg-primary/5 hover:text-primary font-bold shadow-sm transition-all hover:-translate-y-1"
                  >
                    <Inbox className="w-4 h-4 mr-2" /> Candidates
                  </Button>
                </div>
              </div>
            </FadeIn>
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
    </FadeIn>
  );
}
