import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectDetails, getProjectMembers, getMyApplications, removeMember, leaveProject, transferOwnership } from "../api";
import { getMyProfile } from "@/features/userprofile/api";
import { 
  Users, Calendar, ChevronLeft, Building, 
  GraduationCap, Mail, UserPlus, Info,
  MoreVertical, LogOut, Crown, UserMinus, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import ApplicationFormModal from "../components/ApplicationFormModal";
import { useState } from "react";
import { toast } from "sonner";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetails(projectId!),
    enabled: !!projectId,
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId!),
    enabled: !!projectId,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const { data: myApps } = useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });

  const isOwner = project?.ownerId === profile?.userId;
  const isMember = members?.some(m => m.userId === profile?.userId);
  const pendingApp = myApps?.find(a => a.projectId === projectId && a.status === "PENDING");

  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: (memberUserId: string) => removeMember(projectId!, memberUserId),
    onSuccess: () => {
      toast.success("Member removed from team.");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to remove member");
    }
  });

  const leaveProjectMutation = useMutation({
    mutationFn: () => leaveProject(projectId!),
    onSuccess: () => {
      toast.success("You have left the project.");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to leave project");
    }
  });

  const transferOwnershipMutation = useMutation({
    mutationFn: (newOwnerId: string) => transferOwnership(projectId!, newOwnerId),
    onSuccess: () => {
      toast.success("Leadership transferred successfully.");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to transfer leadership");
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-6 text-center max-w-4xl pt-24">
        <div className="bg-destructive/10 text-destructive p-6 rounded-xl inline-block mb-6">
          <Info className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Project Not Found</h2>
          <p className="text-sm mt-2">The project you're looking for doesn't exist or has been deleted.</p>
        </div>
        <div>
          <Button variant="outline" onClick={() => navigate("/discover")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Header Section */}
      <div className="bg-card rounded-2xl p-8 border shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-0 font-medium">
                {project.status.replace("_", " ")}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Posted {format(new Date(project.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-card-foreground">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {project.requiredSkills?.map((skill) => (
                <Badge key={skill.skillId || skill.skillName} variant="outline" className="px-3 py-1 bg-background text-sm">
                  {skill.skillName}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-40 md:text-right shrink-0">
            {!isOwner && !isMember && (
              <Button 
                size="lg" 
                className="w-full sm:w-auto font-medium shadow-sm group"
                disabled={!!pendingApp || project?.status !== "RECRUITING" || (project?.currentMemberCount || 0) >= (project?.maxTeamSize || 0)}
                onClick={() => setIsApplyModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                {pendingApp ? "Application Pending" : "Apply to Join"}
              </Button>
            )}
            {!isOwner && isMember && (
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-full sm:w-auto font-medium shadow-sm"
                onClick={() => {
                  if (confirm("Are you sure you want to leave this project?")) {
                    leaveProjectMutation.mutate();
                  }
                }}
                disabled={leaveProjectMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Leave Project
              </Button>
            )}
            
            {!isOwner && !isMember && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto font-medium shadow-sm group"
                onClick={() => navigate(`/messages?userId=${project?.ownerId}&name=${encodeURIComponent(project?.owner?.name || 'Project Leader')}`)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Leader
              </Button>
            )}
            
            {(isOwner || isMember) && (
              <Button 
                className="w-full sm:w-auto font-medium shadow-sm bg-primary/90 hover:bg-primary"
                onClick={() => navigate(`/messages?projectId=${projectId}`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Team Chat
              </Button>
            )}

            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Users className="h-4 w-4 mr-2" />
              View Team
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" />
              About the Project
            </h2>
            <div className="bg-card rounded-xl p-6 border shadow-sm prose prose-sm sm:prose-base max-w-none text-muted-foreground">
              {project.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Team Roster Section */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Team Members
            </h2>
            
            {isLoadingMembers ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ) : members && members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map(member => (
                  <div 
                    key={member.id} 
                    className="bg-card rounded-xl p-5 border shadow-sm flex items-start space-x-4 transition-colors relative hover:border-primary/50"
                  >
                    <Avatar 
                      className="h-12 w-12 border-2 border-background shadow-sm shrink-0 cursor-pointer"
                      onClick={() => navigate(`/users/${member.userId}`)}
                    >
                      <AvatarImage src={member.profilePictureUrl || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/users/${member.userId}`)}
                    >
                      <h4 className="font-semibold text-sm truncate">{member.name}</h4>
                      <p className="text-xs text-primary font-medium truncate mb-1">
                        {member.roleTitle || "Project Owner"}
                      </p>
                      
                      {(member.department || member.graduationYear) && (
                        <div className="text-[10px] text-muted-foreground mb-2 flex items-center gap-2 truncate">
                          {member.department && <span className="truncate">{member.department}</span>}
                          {member.department && member.graduationYear && <span>•</span>}
                          {member.graduationYear && <span>{member.graduationYear}</span>}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.topSkills?.map(skill => (
                          <Badge key={skill} variant="secondary" className="px-1.5 py-0 text-[10px] bg-secondary/50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {member.userId !== profile?.userId && (
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {member.userId !== profile?.userId && (
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/messages?userId=${member.userId}&name=${encodeURIComponent(member.name || 'User')}`);
                                }}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" /> Message
                              </DropdownMenuItem>
                            )}
                            {isOwner && member.userId !== profile?.userId && (
                              <>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm("Are you sure you want to transfer leadership to this member? You will lose owner privileges.")) {
                                      transferOwnershipMutation.mutate(member.userId);
                                    }
                                  }}
                                >
                                  <Crown className="w-4 h-4 mr-2" /> Make Leader
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm("Are you sure you want to remove this member from the team?")) {
                                      removeMemberMutation.mutate(member.userId);
                                    }
                                  }}
                                >
                                  <UserMinus className="w-4 h-4 mr-2" /> Remove Member
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No team members yet.</p>
                <p className="text-sm mt-1">Be the first to apply and join!</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Owner & Team Stats */}
        <div className="space-y-8">
          
          {/* Owner Card */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Project Leader</h3>
            
            {project.owner ? (
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm mb-4">
                  <AvatarImage src={project.owner.profilePictureUrl || ""} />
                  <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                    {project.owner.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <h4 className="font-semibold text-lg">{project.owner.name}</h4>
                
                <div className="w-full space-y-3 mt-6 text-sm text-muted-foreground text-left">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-3 text-primary/70 shrink-0" />
                    <span className="truncate">{project.owner.department || "Department not listed"}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-3 text-primary/70 shrink-0" />
                    <span>Class of {project.owner.graduationYear || "Unknown"}</span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full mt-6 bg-secondary hover:bg-secondary/80">
                  <Mail className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Owner information unavailable
              </div>
            )}
          </section>

          {/* Team Stats */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Team Status</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Current Size</span>
                <span>{project.currentMemberCount} / {project.maxTeamSize}</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(100, (project.currentMemberCount / project.maxTeamSize) * 100)}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">
                {project.maxTeamSize - project.currentMemberCount} spots remaining
              </p>
            </div>
            
            {project.applicationDeadline && (
              <div className="mt-6 pt-6 border-t flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Deadline
                </span>
                <span className="text-sm font-medium">
                  {format(new Date(project.applicationDeadline), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </section>

        </div>
      </div>
      
      {project && (
        <ApplicationFormModal 
          project={project} 
          isOpen={isApplyModalOpen} 
          onClose={() => setIsApplyModalOpen(false)} 
        />
      )}
    </div>
  );
}
