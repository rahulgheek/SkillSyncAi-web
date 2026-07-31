import { useQuery } from "@tanstack/react-query";
import { getProjectRoles, ProjectResponse, ProjectRoleResponse } from "../api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import ApplicationFormModal from "./ApplicationFormModal";

interface ProjectDetailsModalProps {
  project: ProjectResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const [selectedRole, setSelectedRole] = useState<ProjectRoleResponse | null>(null);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["projectRoles", project.id],
    queryFn: () => getProjectRoles(project.id),
    enabled: isOpen,
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-md border-border/50">
          <div className="p-6 pb-2 border-b border-border/50 bg-muted/20">
            <DialogHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-primary border-primary/30">
                  {project.status}
                </Badge>
                {project.applicationDeadline && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    Deadline: {new Date(project.applicationDeadline).toLocaleDateString()}
                  </div>
                )}
              </div>
              <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
              <DialogDescription className="text-base mt-2 text-foreground/80">
                {project.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center bg-background px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                <Users className="w-4 h-4 mr-2 text-primary" />
                <span>Max Team Size: <strong>{project.maxTeamSize}</strong></span>
              </div>
              <div className="flex items-center bg-background px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                <Briefcase className="w-4 h-4 mr-2 text-primary" />
                <span>Roles Open: <strong>{roles?.length || 0}</strong></span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-grow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Available Roles
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : roles && roles.length > 0 ? (
              <div className="space-y-4">
                {roles.map((role) => {
                  const isFull = role.filledCount >= role.headcount;
                  
                  return (
                    <div key={role.id} className={`p-5 rounded-xl border ${isFull ? 'bg-muted/30 border-dashed' : 'bg-card border-border/50 hover:border-primary/40 shadow-sm'} transition-colors`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xl font-medium text-foreground">{role.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                        </div>
                        <Badge variant={isFull ? "secondary" : "default"} className={isFull ? "" : "bg-primary/90 hover:bg-primary"}>
                          {role.filledCount} / {role.headcount} Filled
                        </Badge>
                      </div>
                      
                      {role.requiredSkills && role.requiredSkills.length > 0 && (
                        <div className="mt-4 mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {role.requiredSkills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="bg-background/50 border-primary/20 text-foreground">
                                {skill.skillName} <span className="opacity-50 ml-1 text-[10px]">({skill.minimumLevel})</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
                        {isFull ? (
                          <Button variant="outline" disabled className="text-muted-foreground cursor-not-allowed">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Role Filled
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setSelectedRole(role)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:-translate-y-0.5"
                          >
                            Apply for this Role
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg">
                No specific roles defined for this project.
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedRole && (
        <ApplicationFormModal
          project={project}
          role={selectedRole}
          isOpen={!!selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </>
  );
}
