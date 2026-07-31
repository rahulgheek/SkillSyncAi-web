import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectApplications, getProjectInvitations, approveApplication, rejectApplication, revokeInvitation, ProjectResponse } from "../api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Inbox, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ManageApplicationsModalProps {
  project: ProjectResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageApplicationsModal({ project, isOpen, onClose }: ManageApplicationsModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: applications, isLoading: isLoadingApps } = useQuery({
    queryKey: ["projectApplications", project.id],
    queryFn: () => getProjectApplications(project.id),
    enabled: isOpen,
  });

  const { data: invitations, isLoading: isLoadingInvs } = useQuery({
    queryKey: ["projectInvitations", project.id],
    queryFn: () => getProjectInvitations(project.id),
    enabled: isOpen,
  });

  const approveMutation = useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      toast.success("Application approved! They are now part of the team.");
      queryClient.invalidateQueries({ queryKey: ["projectApplications", project.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve application");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      toast.success("Application rejected.");
      queryClient.invalidateQueries({ queryKey: ["projectApplications", project.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject application");
    }
  });

  const revokeMutation = useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      toast.success("Invitation revoked.");
      queryClient.invalidateQueries({ queryKey: ["projectInvitations", project.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revoke invitation");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-md border-border/50">
        <div className="p-6 pb-4 border-b border-border/50 bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Manage Candidates</DialogTitle>
            <DialogDescription className="text-base mt-1 text-foreground/80">
              Review incoming applications and sent invitations for <strong className="text-foreground">{project.title}</strong>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="applications" className="flex-grow flex flex-col h-full overflow-hidden">
          <div className="px-6 pt-4 border-b border-border/50 bg-background">
            <TabsList className="w-full max-w-md grid grid-cols-2">
              <TabsTrigger value="applications">Applications ({applications?.length || 0})</TabsTrigger>
              <TabsTrigger value="invitations">Sent Invitations ({invitations?.length || 0})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications" className="flex-grow m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
            <ScrollArea className="flex-grow p-6">
              {isLoadingApps ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-5 rounded-xl border bg-card border-border/50 shadow-sm flex flex-col md:flex-row gap-4">
                  
                  <div 
                    className="flex items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                    onClick={() => {
                        onClose();
                        navigate(`/users/${app.userId}`);
                    }}
                  >
                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm shrink-0">
                      <AvatarImage src={app.applicantProfilePictureUrl || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {app.applicantName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-base truncate">{app.applicantName}</h4>
                      
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground truncate">
                         {app.applicantDepartment && <span>{app.applicantDepartment}</span>}
                         {app.applicantDepartment && app.applicantGraduationYear && <span>•</span>}
                         {app.applicantGraduationYear && <span>{app.applicantGraduationYear}</span>}
                      </div>

                      <div className="mt-2 text-sm bg-muted/30 p-3 rounded-lg border border-border/50 italic text-muted-foreground">
                        "{app.coverMessage}"
                      </div>
                      
                      {app.applicantTopSkills && app.applicantTopSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {app.applicantTopSkills.map(skill => (
                            <Badge key={skill} variant="secondary" className="px-1.5 py-0 text-[10px] bg-secondary/50">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4">
                    <p className="text-xs font-semibold text-muted-foreground text-center mb-1 hidden md:block">
                      Role: {app.roleTitle || "Any"}
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-none"
                      onClick={() => approveMutation.mutate(app.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="flex-1 md:flex-none"
                      onClick={() => rejectMutation.mutate(app.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Inbox className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">No pending applications</p>
              <p className="text-sm mt-1">You're all caught up! Applications will appear here.</p>
            </div>
          )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="invitations" className="flex-grow m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
            <ScrollArea className="flex-grow p-6">
              {isLoadingInvs ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : invitations && invitations.length > 0 ? (
                <div className="space-y-4">
                  {invitations.map((inv) => (
                    <div key={inv.id} className="p-5 rounded-xl border bg-card border-border/50 shadow-sm flex flex-col md:flex-row gap-4 opacity-80">
                      
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-sm shrink-0">
                          <AvatarImage src={inv.invitedUserProfilePictureUrl || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {inv.invitedUserName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-base truncate">{inv.invitedUserName}</h4>
                            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200">
                              {inv.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground truncate">
                             {inv.invitedUserDepartment && <span>{inv.invitedUserDepartment}</span>}
                             {inv.invitedUserDepartment && inv.invitedUserGraduationYear && <span>•</span>}
                             {inv.invitedUserGraduationYear && <span>{inv.invitedUserGraduationYear}</span>}
                          </div>

                          <div className="mt-2 text-sm bg-muted/30 p-3 rounded-lg border border-border/50 italic text-muted-foreground">
                            "{inv.message}"
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => revokeMutation.mutate(inv.id)}
                          disabled={revokeMutation.isPending || inv.status !== "PENDING"}
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Send className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium text-foreground">No sent invitations</p>
                  <p className="text-sm mt-1">Use AI Recommendations to find and invite great candidates.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
