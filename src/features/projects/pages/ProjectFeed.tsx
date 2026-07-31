import { useQuery } from "@tanstack/react-query";
import { getRecruitingFeed, ProjectResponse } from "../api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Discover Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Find exciting projects recruiting at your college and join a team.
          </p>
        </div>
        <Button 
          onClick={() => setIsDiscoveryOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20"
        >
          <Sparkles className="w-4 h-4 mr-2" />
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
            <Card 
              key={project.id} 
              className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm group cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    Recruiting
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3 text-sm text-foreground/80 mb-4">
                  {project.description}
                </CardDescription>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Max Team Size: <strong className="text-foreground">{project.maxTeamSize}</strong></span>
                  </div>
                  {project.applicationDeadline && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Deadline: <strong className="text-foreground">{new Date(project.applicationDeadline).toLocaleDateString()}</strong></span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-border/50">
                <Button className="w-full group-hover:bg-primary" variant="default">
                  View Roles & Apply
                </Button>
              </CardFooter>
            </Card>
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
