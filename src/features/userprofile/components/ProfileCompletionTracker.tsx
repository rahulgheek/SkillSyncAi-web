import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileResponse } from "../../../schemas";

export function ProfileCompletionTracker({ profile }: { profile: ProfileResponse }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !profile) return null;

  const tasks = [
    { label: "Add profile picture", completed: !!profile.profilePictureUrl },
    { label: "Upload resume", completed: !!profile.resumeUrl },
    { label: "Add 5 skills", completed: (profile.skills?.length || 0) >= 5 },
    { label: "Add GitHub", completed: !!profile.githubUrl },
    { label: "Add project", completed: (profile.projects?.length || 0) > 0 },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  if (percentage === 100) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <Card className="p-5 shadow-lg border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm">Profile Setup</h4>
            <p className="text-xs text-muted-foreground">{percentage}% Complete</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Progress value={percentage} className="h-2 mb-4" />
        
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm">
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
