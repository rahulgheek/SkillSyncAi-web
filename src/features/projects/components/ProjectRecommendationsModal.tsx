import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectRecommendations, generateProjectRecommendations, inviteStudent, ProjectResponse } from "../api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Removed ScrollArea import
import { Sparkles, BrainCircuit, CheckCircle2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ProjectRecommendationsModalProps {
  project: ProjectResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectRecommendationsModal({ project, isOpen, onClose }: ProjectRecommendationsModalProps) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: page, isLoading, refetch } = useQuery({
    queryKey: ["projectRecommendations", project.id],
    queryFn: () => getProjectRecommendations(project.id),
    enabled: isOpen,
  });

  // Polling mechanism if we are generating recommendations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let attempts = 0;
    if (isGenerating) {
      interval = setInterval(() => {
        attempts++;
        if (attempts > 36) { // Stop after 180 seconds (36 * 5s)
          clearInterval(interval);
          setIsGenerating(false);
          toast.error("AI analysis timed out or failed. Please try again later.");
          return;
        }
        refetch().then((res) => {
          if (res.data && res.data.content.length > 0) {
            setIsGenerating(false);
            clearInterval(interval);
            toast.success("AI has finished analyzing candidates!");
          }
        });
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isGenerating, refetch]);

  const generateMutation = useMutation({
    mutationFn: () => generateProjectRecommendations(project.id),
    onSuccess: () => {
      setIsGenerating(true);
      toast.success("AI analysis started! This usually takes 15-30 seconds.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start AI analysis");
    }
  });

  const handleInvite = async (userId: string) => {
    try {
      await inviteStudent({
        projectId: project.id,
        invitedUserId: userId,
        message: "I saw your profile and AI ranked you as a top match for my project. I'd love for you to join the team!"
      });
      toast.success("Invitation sent successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send invitation");
    }
  };

  const recommendations = page?.content || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-md border-border/50">
        <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold tracking-wider uppercase text-sm">AI Matchmaker</span>
            </div>
            <DialogTitle className="text-3xl font-bold">Recommended Candidates</DialogTitle>
            <DialogDescription className="text-base mt-2 text-foreground/80">
              Our AI has analyzed the required skills for <strong className="text-foreground">{project.title}</strong> and matched them against all students in your college.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {recommendations.length > 0 
                ? `Showing top ${recommendations.length} AI-ranked matches.` 
                : "No recommendations generated yet."}
            </p>
            <Button 
              onClick={() => generateMutation.mutate()} 
              disabled={generateMutation.isPending || isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all"
            >
              {(generateMutation.isPending || isGenerating) ? (
                <>
                  <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
                  AI is Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Find Best Candidates
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
          {isLoading && !isGenerating ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (generateMutation.isPending || isGenerating) ? (
            <div className="flex flex-col items-center justify-center p-16 text-center animate-in fade-in duration-700">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">SkillSync AI is Thinking...</h3>
              <p className="text-muted-foreground max-w-sm">
                We are filtering down the entire college pool and semantically matching candidate skills to your project requirements.
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="relative p-6 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                  {/* Rank Badge */}
                  <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                    #{index + 1}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 pl-4">
                    <div className="flex items-center gap-4">
                      {rec.candidateProfilePictureUrl ? (
                        <img src={rec.candidateProfilePictureUrl} alt={rec.candidateName} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                          {(rec.candidateName || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xl font-semibold">{rec.candidateName || "Unknown Candidate"}</h4>
                        <div className="flex items-center gap-3 mt-2">
                        <Badge variant={rec.finalScore >= 80 ? "default" : "secondary"} className={rec.finalScore >= 80 ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : ""}>
                          {rec.finalScore}% Match
                        </Badge>
                        <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                          {rec.confidence} Confidence
                        </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        onClick={() => window.open(`/profile/${rec.userId}`, '_blank')}
                      >
                        View Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => handleInvite(rec.userId)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                  </div>

                  <div className="pl-4">
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg italic">
                      "{rec.rationale}"
                    </p>
                    
                    {rec.matchedSkills && rec.matchedSkills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Matched Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.matchedSkills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-16 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Ready to find your dream team?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click "Find Best Candidates" above. Our AI will analyze your required skills and search the entire college to find the perfect matches for your project.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
