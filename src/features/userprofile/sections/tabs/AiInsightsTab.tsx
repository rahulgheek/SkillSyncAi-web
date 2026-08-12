import { ProfileResponse } from "../../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Target, ArrowRight, Route, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateAiInsights } from "../../api";
import { toast } from "sonner";

export function AiInsightsTab({ profile }: { profile: ProfileResponse }) {
  const queryClient = useQueryClient();
  
  const generateMutation = useMutation({
    mutationFn: generateAiInsights,
    onSuccess: (updatedProfile) => {
      // Update cache with the new profile directly
      queryClient.setQueryData(["profile"], updatedProfile);
      toast.success("AI Insights generated successfully!");
    },
    onError: () => {
      toast.error("Failed to generate AI insights. Please try again.");
    }
  });

  const ai = profile.aiInsights;

  if (!ai) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2 px-1">
          <div className="p-2 bg-black rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AI Career Analysis</h2>
        </div>
        <Card className="border-border shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Brain className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">AI Insights Not Available Yet</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto mb-6">
            Add more skills, projects, or progress on your roadmap to generate personalized AI insights.
          </p>
          <Button 
            onClick={() => generateMutation.mutate()} 
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate AI Insights</>
            )}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AI Career Analysis</h2>
        </div>
        {profile.insightsOutdated && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => generateMutation.mutate()} 
            disabled={generateMutation.isPending}
            className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
          >
            {generateMutation.isPending ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...</>
            ) : (
              <><RefreshCw className="mr-2 h-4 w-4" /> Refresh Insights</>
            )}
          </Button>
        )}
      </div>

      <Card className="border-border shadow-sm bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" /> Executive Summary
            </h3>
            <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
              Confidence Score: <span className="text-green-600">{ai.confidenceScore}%</span>
            </div>
          </div>
          <p className="text-foreground/90 leading-relaxed text-lg">
            {ai.careerSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" /> Core Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {ai.strengths.map(s => (
                <li key={s} className="flex items-center gap-3 text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-orange-500" /> Skill Gaps & Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {ai.skillGaps.map(g => (
                <li key={g} className="flex items-center gap-3 text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> {g}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" /> Recommended Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-wrap gap-2">
            {ai.recommendedRoles.map(r => (
              <span key={r} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-medium text-sm">
                {r}
              </span>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Route className="h-4 w-4 text-purple-500" /> Actionable Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {ai.learningRoadmap.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  {i !== ai.learningRoadmap.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
                </div>
                <div className="pb-2">
                  <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1">{item.description}</p>
                  <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{item.dueDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
