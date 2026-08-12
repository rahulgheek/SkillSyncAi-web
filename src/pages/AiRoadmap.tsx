import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateCustomRoadmap, Roadmap, CustomRoadmapPayload, chatWithRoadmap, getActiveRoadmap } from "@/features/roadmap/api";
import { getMyTodos, updateTodoStatus, toggleSubtask } from "@/features/todo/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
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
          <h1 className="text-4xl font-extrabold tracking-tight">AI Career <span className="font-handwriting text-primary text-5xl inline-block -rotate-2">Roadmap</span></h1>
          <p className="text-lg font-medium text-muted-foreground mt-2">Get a personalized learning path and track your progress.</p>
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
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-300">
              <div className="bg-primary/5 px-8 py-8 border-b border-primary/10">
                <h2 className="text-2xl font-black text-foreground">Plan Your Next Move</h2>
                <p className="text-muted-foreground font-medium mt-2">
                  Tell us where you are and where you want to go. Leave the target role blank if you want the AI to recommend a path for you!
                </p>
              </div>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold leading-none">Target Role (What I want to know/do)</label>
                    <Input
                      placeholder="e.g. Full Stack Developer... (Leave blank for recommendations)"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="text-base h-14 px-6 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary/20 shadow-inner font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold leading-none">Current Knowledge (What I know)</label>
                    <Textarea
                      placeholder="e.g. I know basic React and Python, but have never built a full app."
                      value={currentKnowledge}
                      onChange={(e) => setCurrentKnowledge(e.target.value)}
                      className="resize-none text-base p-6 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary/20 shadow-inner font-medium"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold leading-none">Knowledge Gaps (What I don't know)</label>
                    <Textarea
                      placeholder="e.g. I struggle with databases and backend deployment."
                      value={knowledgeGaps}
                      onChange={(e) => setKnowledgeGaps(e.target.value)}
                      className="resize-none text-base p-6 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary/20 shadow-inner font-medium"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold gap-2 shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1"
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
              </div>
            </div>
          )}

          {roadmap && (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
              <div className="bg-primary/5 px-8 py-8 border-b border-primary/10">
                <h2 className="text-3xl font-black text-foreground">{roadmap.title}</h2>
                <p className="text-base font-medium text-muted-foreground mt-3">{roadmap.description}</p>
              </div>
              <div className="p-8">
                <div className="relative border-l-4 border-primary/20 pl-8 ml-4 space-y-10">
                  {roadmap.checkpoints?.sort((a, b) => a.orderIndex - b.orderIndex).map((checkpoint, index) => (
                    <div key={checkpoint.id} className="relative">
                      <div className="absolute -left-[45px] bg-white p-1 rounded-full shadow-sm">
                        {checkpoint.status === "COMPLETED" ? (
                          <CheckCircle2 className="w-8 h-8 text-green-500 bg-white rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full border-4 border-primary bg-white" />
                        )}
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-black text-xl flex items-center gap-3">
                            <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Step {index + 1}</span>
                            {checkpoint.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground font-medium whitespace-pre-wrap">{checkpoint.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm font-bold text-muted-foreground">Tasks have been automatically added to your To-Do list!</p>
                  <Button variant="outline" className="rounded-full font-bold bg-white hover:bg-gray-50" onClick={() => setRoadmap(null)}>Generate New Roadmap</Button>
              </div>
            </div>
          )}

          {roadmap && (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 mt-8 overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
              <div className="bg-primary/5 px-8 py-6 border-b border-primary/10">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" /> Roadmap Assistant
                </h2>
                <p className="text-muted-foreground font-medium mt-1">Stuck on a topic? Ask the AI for help.</p>
              </div>
              <div className="p-6 h-[400px] overflow-y-auto space-y-4 bg-gray-50/50">
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
              </div>
              <div className="p-6 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex w-full gap-3">
                  <Input 
                    placeholder="Type your question..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                    className="flex-1 h-12 rounded-full px-6 bg-gray-50 border-gray-200 focus-visible:ring-primary/20 shadow-inner font-medium"
                  />
                  <Button type="submit" size="icon" disabled={isChatLoading || !chatInput.trim()} className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 text-white">
                    <Send className="w-5 h-5 ml-0.5" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: To-Do List Widget */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 h-[fit-content] sticky top-24 overflow-hidden">
            <div className="bg-primary/5 px-6 py-6 border-b border-primary/10">
              <h2 className="text-xl font-black flex items-center gap-3">
                <ListTodo className="w-6 h-6 text-primary" /> {roadmap?.currentTopic ? `Topic: ${roadmap.currentTopic}` : 'My To-Do List'}
              </h2>
              <p className="text-muted-foreground font-medium mt-2">Track your roadmap milestones and tasks.</p>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
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
                      className={`flex flex-col p-4 rounded-2xl border transition-all ${todo.status === 'COMPLETED' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}
                    >
                      <div className="flex items-start gap-4 cursor-pointer" onClick={() => handleToggleTodo(todo.id, todo.status)}>
                        <div className="mt-0.5">
                          {todo.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-300 hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-base font-bold ${todo.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {todo.title}
                          </h4>
                          {todo.sourceTitle && (
                            <p className="text-sm font-medium text-muted-foreground mt-1">{todo.sourceTitle}</p>
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
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
