import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile } from "@/features/userprofile/api";
import { getMyTodos, updateTodoStatus } from "@/features/todo/api";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Map, Users, Target, ArrowRight, Loader2, Plus, CheckCircle2, Circle, ListTodo } from "lucide-react";

export function Dashboard() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const { data: todos, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getMyTodos(),
  });

  const todoMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleToggleTodo = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    todoMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !profile) {
    return <Navigate to="/onboarding" />;
  }

  const firstName = profile.fullName.split(" ")[0];

  const widgets = [
    {
      title: "Discover Matches",
      description: "Find the perfect team members for your next big project.",
      icon: Compass,
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-500",
    },
    {
      title: "AI Roadmap",
      description: "Continue your personalized learning journey based on your goals.",
      icon: Map,
      color: "from-primary/20 to-violet-500/20 text-primary",
    },
    {
      title: "Active Projects",
      description: "You have 3 active projects that need your attention.",
      icon: Users,
      color: "from-orange-500/20 to-amber-500/20 text-orange-500",
    },
    {
      title: "Skills & Goals",
      description: "Update your skill tags to get better AI recommendations.",
      icon: Target,
      color: "from-emerald-500/20 to-green-500/20 text-emerald-500",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Welcome back, {firstName}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Here is what's happening with your projects and AI learning roadmap today. Let's make some progress.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/projects/new">
            <Button className="rounded-full shadow-sm hover:shadow-md transition-all gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4" /> Create Project
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all gap-2">
              View Profile <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {widgets.map((widget, idx) => (
          <Card 
            key={idx} 
            className="group relative overflow-hidden border-white/10 bg-card/40 backdrop-blur-md transition-all hover:bg-card/60 hover:shadow-xl hover:-translate-y-1 dark:bg-card/20 dark:hover:bg-card/40 cursor-pointer"
          >
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-all group-hover:opacity-100 ${widget.color.split(' ')[0]} ${widget.color.split(' ')[1]}`} />
            <CardHeader>
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${widget.color}`}>
                <widget.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">{widget.title}</CardTitle>
              <CardDescription className="text-base">{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                Explore <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <ListTodo className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">My To-Do List</h2>
        </div>
        
        {isTodosLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !todos || todos.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-border rounded-xl">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">Generate a new AI roadmap or create projects to get more tasks.</p>
            <Link to="/roadmap">
              <Button variant="outline" className="mt-4">Go to AI Roadmap</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {todos.slice(0, 6).map(todo => (
              <div 
                key={todo.id} 
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${todo.status === 'COMPLETED' ? 'bg-muted/50 border-transparent opacity-70' : 'bg-background border-border shadow-sm hover:border-primary/50'}`}
                onClick={() => handleToggleTodo(todo.id, todo.status)}
              >
                <div className="mt-0.5">
                  {todo.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-base font-semibold ${todo.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {todo.title}
                  </h4>
                  {todo.sourceTitle && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{todo.sourceTitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
