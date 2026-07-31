import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyToProject, ProjectResponse, ProjectRoleResponse } from "../api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ApplicationFormModalProps {
  project: ProjectResponse | any;
  role?: ProjectRoleResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationFormModal({ project, role, isOpen, onClose }: ApplicationFormModalProps) {
  const [coverMessage, setCoverMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: () => applyToProject({
      projectId: project.id,
      projectRoleId: role?.id,
      coverMessage: coverMessage
    }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Application Submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      // Automatically close after a short delay so the user sees the success state
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setCoverMessage("");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    }
  });

  const handleSubmit = () => {
    if (coverMessage.trim().length < 10) {
      toast.error("Please write a slightly longer cover message to pitch yourself!");
      return;
    }
    applyMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-border/50 bg-background/95 backdrop-blur-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Apply to Join</DialogTitle>
              <DialogDescription>
                You are applying {role ? <>for <strong className="text-foreground">{role.title}</strong> in</> : "to"} <strong className="text-foreground">{project.title}</strong>.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <label htmlFor="coverMessage" className="block text-sm font-medium text-foreground mb-2">
                Pitch Yourself (Cover Message)
              </label>
              <Textarea
                id="coverMessage"
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                placeholder="Hi! I have 3 years of experience in React and I'd love to help build this..."
                className="min-h-[150px] resize-none focus-visible:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Briefly explain why you're a good fit for this role and mention any relevant skills.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={applyMutation.isPending}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={applyMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px] shadow-md transition-all"
              >
                {applyMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {applyMutation.isPending ? "Sending..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Application Sent!</h3>
            <p className="text-muted-foreground">
              The project owner will review your profile and get back to you soon.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
