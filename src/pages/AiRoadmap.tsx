import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateCustomRoadmap, Roadmap, CustomRoadmapPayload, chatWithRoadmap, getActiveRoadmap } from "@/features/roadmap/api";
import { getMyTodos, updateTodoStatus, toggleSubtask } from "@/features/todo/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Route, ArrowRight, CheckCircle2, Circle, ListTodo, Sparkles, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function AiRoadmap() {
  const queryClient = useQueryClient();
  const [targetRole, setTargetRole] = useState("");
  const [currentKnowledge, setCurrentKnowledge] = useState("");
  const [knowledgeGaps, setKnowledgeGaps] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const { data: activeRoadmap, isLoading: isActiveRoadmapLoading } = useQuery({
    queryKey: ["activeRoadmap"],
    queryFn: getActiveRoadmap,
  });

  useEffect(() => {
    if (activeRoadmap) {
      setRoadmap(activeRoadmap);
    }
  }, [activeRoadmap]);

  const { data: todos, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getMyTodos(),
    refetchInterval: 5000, // Automatically poll for new tasks every 5 seconds
  });

  const generateMutation = useMutation({
    mutationFn: generateCustomRoadmap,
    onSuccess: (data) => {
      setRoadmap(data);
      toast.success("Your personalized AI Roadmap is ready!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Roadmap generation failed:", error);
      toast.error("Failed to generate roadmap. Please try again.");
    },
  });

  const todoMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task updated!");
    },
  });

  const subtaskMutation = useMutation({
    mutationFn: ({ todoId, subtaskId }: { todoId: string, subtaskId: string }) => toggleSubtask(todoId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CustomRoadmapPayload = {
      targetRole: targetRole.trim(),
      currentKnowledge: currentKnowledge.trim(),
      knowledgeGaps: knowledgeGaps.trim(),
    };
    generateMutation.mutate(payload);
  };

  const handleToggleTodo = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    todoMutation.mutate({ id, status: newStatus });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !roadmap) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const reply = await chatWithRoadmap(roadmap.id, userMsg);
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (error) {
      toast.error("Failed to send message to AI.");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Route className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Career Roadmap</h1>
          <p className="text-muted-foreground mt-1">Get a personalized learning path and track your progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isActiveRoadmapLoading && !roadmap ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Left Column: Roadmap Generator or Display */}
            <div className="lg:col-span-2 space-y-6">
          {!roadmap && (
            <Card className="shadow-lg border-primary/20 bg-card overflow-hidden transition-all duration-300">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-xl">Plan Your Next Move</CardTitle>
                <CardDescription>
                  Tell us where you are and where you want to go. Leave the target role blank if you want the AI to recommend a path for you!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Target Role (What I want to know/do)</label>
                    <Input
                      placeholder="e.g. Full Stack Developer... (Leave blank for recommendations)"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="text-lg py-6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Current Knowledge (What I know)</label>
                    <Textarea
                      placeholder="e.g. I know basic React and Python, but have never built a full app."
                      value={currentKnowledge}
                      onChange={(e) => setCurrentKnowledge(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Knowledge Gaps (What I don't know)</label>
                    <Textarea
                      placeholder="e.g. I struggle with databases and backend deployment."
                      value={knowledgeGaps}
                      onChange={(e) => setKnowledgeGaps(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating your roadmap...
                      </>
                    ) : targetRole.trim() ? (
                      <>
                        Generate My Roadmap <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-yellow-300" /> Recommend a Path for Me
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {roadmap && (
            <Card className="border-primary/20 shadow-md animate-in slide-in-from-bottom-4 duration-700">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl">{roadmap.title}</CardTitle>
                <CardDescription className="text-base mt-2">{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative border-l-2 border-primary/20 pl-6 ml-4 space-y-8">
                  {roadmap.checkpoints?.sort((a, b) => a.orderIndex - b.orderIndex).map((checkpoint, index) => (
                    <div key={checkpoint.id} className="relative">
                      <div className="absolute -left-[35px] bg-background p-1 rounded-full">
                        {checkpoint.status === "COMPLETED" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500 bg-background" />
                        ) : (
                          <Circle className="w-6 h-6 text-primary fill-background" />
                        )}
                      </div>
                      <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-0.5 rounded">Step {index + 1}</span>
                            {checkpoint.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap">{checkpoint.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-between items-center py-4 rounded-b-xl border-t border-border">
                  <p className="text-sm text-muted-foreground">Tasks have been automatically added to your To-Do list!</p>
                  <Button variant="outline" onClick={() => setRoadmap(null)}>Generate New Roadmap</Button>
              </CardFooter>
            </Card>
          )}

          {roadmap && (
            <Card className="border-primary/20 shadow-md mt-6 animate-in slide-in-from-bottom-6 duration-700">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Roadmap Assistant
                </CardTitle>
                <CardDescription>Stuck on a topic? Ask the AI for help.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 px-4 pb-0 h-[300px] overflow-y-auto space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                    <MessageSquare className="w-12 h-12 mb-2" />
                    <p>Ask anything about your current tasks!</p>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 pb-4">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input 
                    placeholder="Type your question..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isChatLoading || !chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Column: To-Do List Widget */}
        <div className="space-y-6">
          <Card className="shadow-md h-[fit-content] sticky top-24">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-primary" /> {roadmap?.currentTopic ? `Topic: ${roadmap.currentTopic}` : 'My To-Do List'}
              </CardTitle>
              <CardDescription>Track your roadmap milestones and tasks.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 max-h-[600px] overflow-y-auto">
              {isTodosLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : !todos || todos.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>All caught up!</p>
                  <p className="text-sm mt-1">Generate a roadmap to get new tasks.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos
                    .filter(todo => todo.status !== 'CANCELLED')
                    // Filter to only show tasks belonging to the current topic
                    .filter(todo => {
                      if (!roadmap?.currentTopic) return true; // Show all if no topic (e.g. initial generation)
                      return todo.sourceTitle?.includes(roadmap.currentTopic);
                    })
                    // Sort by dueDate to ensure they appear in chronological order (Step 1, Step 2, etc.)
                    .sort((a, b) => {
                      if (!a.dueDate) return 1;
                      if (!b.dueDate) return -1;
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    })
                    .map(todo => (
                    <div 
                      key={todo.id} 
                      className={`flex flex-col p-3 rounded-lg border transition-all ${todo.status === 'COMPLETED' ? 'bg-muted/30 border-transparent opacity-60' : 'bg-card border-border shadow-sm'}`}
                    >
                      <div className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-1 rounded" onClick={() => handleToggleTodo(todo.id, todo.status)}>
                        <div className="mt-0.5">
                          {todo.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${todo.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {todo.title}
                          </h4>
                          {todo.sourceTitle && (
                            <p className="text-xs text-muted-foreground mt-1">{todo.sourceTitle}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Subtasks rendering */}
                      {todo.subtasks && todo.subtasks.length > 0 && (
                        <div className="mt-3 ml-8 space-y-2 border-l-2 border-muted pl-4">
                          {todo.subtasks.map(subtask => (
                            <div 
                              key={subtask.id} 
                              className="flex items-center gap-2 cursor-pointer group"
                              onClick={() => subtaskMutation.mutate({ todoId: todo.id, subtaskId: subtask.id })}
                            >
                              <div className="mt-0.5">
                                {subtask.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                              </div>
                              <span className={`text-xs ${subtask.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
