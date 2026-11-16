import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentRecommendations, generateStudentRecommendations } from "../api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDiscoveryModal({ isOpen, onClose }: ProjectDiscoveryModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: page, isLoading, refetch } = useQuery({
    queryKey: ["studentRecommendations"],
    queryFn: () => getStudentRecommendations(0, 10),
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
            toast.success("AI has finished analyzing projects for you!");
          }
        });
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isGenerating, refetch]);

  const generateMutation = useMutation({
    mutationFn: () => generateStudentRecommendations(),
    onSuccess: () => {
      setIsGenerating(true);
      toast.success("AI analysis started! This usually takes 15-30 seconds.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start AI analysis");
    }
  });

  const recommendations = page?.content || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1rem)] max-w-4xl flex-col overflow-hidden rounded-2xl border-border/50 bg-background/95 p-0 backdrop-blur-md sm:w-full sm:rounded-lg">
        <div className="border-b border-border/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 pb-4 sm:p-6">
          <DialogHeader>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider sm:text-sm">AI Discovery</span>
            </div>
            <DialogTitle className="text-2xl font-bold sm:text-3xl">Recommended Projects</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-foreground/80 sm:text-base">
              Our AI has analyzed your skills and achievements and matched them against all active projects to find the best fit for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {recommendations.length > 0 
                ? `Showing top ${recommendations.length} AI-ranked projects.` 
                : "No projects generated yet."}
            </p>
            <Button 
              onClick={() => generateMutation.mutate()} 
              disabled={generateMutation.isPending || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 sm:w-auto sm:hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <BrainCircuit className="w-4 h-4 mr-2 animate-pulse text-blue-200" />
                  SkillSync AI is Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Best Projects
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6">
          {isLoading && !isGenerating ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              <p className="text-muted-foreground animate-pulse">Loading previous AI recommendations...</p>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-12 sm:py-20">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-cyan-500/50 rounded-full animate-spin"></div>
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium text-foreground sm:text-xl">Groq AI is analyzing projects...</h3>
                <p className="text-sm text-muted-foreground sm:text-base">Evaluating semantic matches based on your skills and achievements.</p>
              </div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No Recommendations</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-2 sm:text-base">
                Click the button above to let AI find the best projects for you based on your profile.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div 
                  key={rec.id} 
                  className={`relative bg-card rounded-xl border p-4 transition-all duration-300 hover:shadow-xl sm:p-6 ${
                    index === 0 ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-border'
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Top Match
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="text-lg font-bold break-words sm:text-2xl">{rec.projectTitle}</h4>
                          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                            <Badge variant={rec.finalScore >= 80 ? "default" : "secondary"} className={rec.finalScore >= 80 ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : ""}>
                              {rec.finalScore}% Match
                            </Badge>
                            <Badge variant="outline" className="border-blue-200 text-blue-700">
                              {rec.confidence} Confidence
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Button 
                            variant="outline"
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 sm:w-auto"
                            onClick={() => {
                              onClose();
                              navigate(`/projects/${rec.projectId}`);
                            }}
                          >
                            View Project
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mt-4 line-clamp-2">{rec.projectDescription}</p>

                      <div className="mt-4 bg-muted/40 rounded-lg p-3 border border-border/50 sm:p-4">
                        <div className="flex items-start gap-3">
                          <BrainCircuit className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground mb-1">AI Rationale</p>
                            <p className="text-sm text-muted-foreground italic leading-relaxed break-words">
                              "{rec.rationale}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground mr-2">Matched Skills:</span>
                      {rec.matchedSkills && rec.matchedSkills.length > 0 ? (
                        rec.matchedSkills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border border-primary/10 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">None identified</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
