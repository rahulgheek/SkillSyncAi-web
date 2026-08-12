import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile } from "@/features/userprofile/api";
import { getMyTodos, updateTodoStatus } from "@/features/todo/api";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Map, Users, Target, ArrowRight, Loader2, Plus, CheckCircle2, Circle, ListTodo } from "lucide-react";

import { FadeIn } from "@/components/ui/animated/FadeIn";

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
      color: "from-blue-500 to-cyan-400 text-white shadow-blue-500/20",
    },
    {
      title: "AI Roadmap",
      description: "Continue your personalized learning journey based on your goals.",
      icon: Map,
      color: "from-primary to-accent text-white shadow-primary/20",
    },
    {
      title: "Active Projects",
      description: "You have 3 active projects that need your attention.",
      icon: Users,
      color: "from-orange-500 to-amber-400 text-white shadow-orange-500/20",
    },
    {
      title: "Skills & Goals",
      description: "Update your skill tags to get better AI recommendations.",
      icon: Target,
      color: "from-emerald-500 to-green-400 text-white shadow-emerald-500/20",
    },
  ];

  return (
    <FadeIn delay={0.1} className="mx-auto max-w-6xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Welcome back, <span className="font-handwriting text-primary text-5xl md:text-6xl inline-block -rotate-2 -translate-y-1">{firstName}</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-medium max-w-2xl">
            Here is what's happening with your projects and AI learning roadmap today. Let's make some progress.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/projects/new">
            <Button className="h-11 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 gap-2 text-base">
              <Plus className="w-5 h-5 mr-1 inline-block" /> Create Project
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
          <FadeIn key={idx} delay={0.2 + idx * 0.1}>
            <div className="h-full group cursor-pointer bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden flex flex-col">
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 bg-gradient-to-br ${widget.color.split(' text-')[0]}`} />
              
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ${widget.color}`}>
                <widget.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-foreground">{widget.title}</h3>
              <p className="text-base text-muted-foreground font-medium mb-8 flex-1">{widget.description}</p>
              
              <div className="flex items-center text-sm font-bold text-primary transition-colors group-hover:text-primary/80 mt-auto">
                Explore <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      
      <FadeIn delay={0.6} className="mt-12 rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-12 shadow-xl shadow-gray-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <ListTodo className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black">My To-Do List</h2>
        </div>
        
        {isTodosLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !todos || todos.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-50" />
            <p className="text-xl font-bold text-foreground">All caught up!</p>
            <p className="text-base font-medium text-muted-foreground mt-2">Generate a new AI roadmap or create projects to get more tasks.</p>
            <Link to="/roadmap">
              <Button className="mt-6 font-bold rounded-xl h-11 shadow-md shadow-primary/20">Go to AI Roadmap</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {todos.slice(0, 6).map((todo, idx) => (
              <div 
                key={todo.id} 
                className={`flex items-start gap-4 p-5 rounded-2xl transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg ${todo.status === 'COMPLETED' ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border border-gray-200 shadow-sm hover:border-primary/50'}`}
                onClick={() => handleToggleTodo(todo.id, todo.status)}
              >
                <div className="mt-0.5">
                  {todo.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-7 h-7 text-green-500 drop-shadow-sm" />
                  ) : (
                    <Circle className="w-7 h-7 text-gray-300 hover:text-primary transition-colors drop-shadow-sm" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-bold ${todo.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-foreground'}`}>
                    {todo.title}
                  </h4>
                  {todo.sourceTitle && (
                    <p className="text-sm text-muted-foreground font-medium mt-1 line-clamp-1">{todo.sourceTitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

    </FadeIn>
  );
}
