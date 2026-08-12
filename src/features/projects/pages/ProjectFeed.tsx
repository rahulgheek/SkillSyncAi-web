import { useQuery } from "@tanstack/react-query";
import { getRecruitingFeed, ProjectResponse } from "../api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProjectDiscoveryModal from "../components/ProjectDiscoveryModal";
import { Sparkles } from "lucide-react";

export default function ProjectFeed() {
  const navigate = useNavigate();
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["recruitingFeed"],
    queryFn: () => getRecruitingFeed(0, 20),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Failed to load projects. Please try again later.
      </div>
    );
  }

  const projects = page?.content || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Discover <span className="font-handwriting text-primary text-5xl md:text-6xl inline-block -rotate-2 -translate-y-1">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium mt-2">
            Find exciting projects recruiting at your college and join a team.
          </p>
        </div>
        <Button 
          onClick={() => setIsDiscoveryOpen(true)}
          className="h-12 px-6 rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 font-bold text-base"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Discover Best Projects with AI
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium">No active projects found</h3>
          <p className="text-muted-foreground">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex flex-col h-full bg-white rounded-[2rem] p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 shadow-xl shadow-gray-100/50 border border-gray-100 group cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="flex justify-between items-start mb-5">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold px-3 py-1 rounded-lg border-0">
                  Recruiting
                </Badge>
                <span className="text-xs text-muted-foreground font-bold">
                  {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-xl font-black mb-3 line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                {project.title}
              </h3>
              
              <p className="line-clamp-3 text-sm text-muted-foreground font-medium mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm font-bold text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span>Max Team Size: <strong className="text-foreground">{project.maxTeamSize}</strong></span>
                </div>
                {project.applicationDeadline && (
                  <div className="flex items-center text-sm font-bold text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-accent" />
                    <span>Deadline: <strong className="text-foreground">{new Date(project.applicationDeadline).toLocaleDateString()}</strong></span>
                  </div>
                )}
              </div>
              
              <div className="pt-5 border-t border-gray-100">
                <Button className="w-full font-bold rounded-xl h-11 bg-gray-50 text-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-none group-hover:shadow-md group-hover:shadow-primary/20">
                  View Roles & Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectDiscoveryModal 
        isOpen={isDiscoveryOpen} 
        onClose={() => setIsDiscoveryOpen(false)} 
      />
    </div>
  );
}
