import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ConnectionStatus } from "@/components/ConnectionStatus";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background/95 transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-violet-500/20 blur-[120px]"></div>

      <div className="absolute top-4 right-4 z-50">
        <ConnectionStatus />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              SkillSync AI
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-medium">Unlock your true potential today.</p>
          </div>
        </div>
        
        <div className="rounded-3xl border border-white/20 bg-white/40 p-1 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/40">
          <div className="rounded-[1.35rem] bg-card/60 backdrop-blur-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
