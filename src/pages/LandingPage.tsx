import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Code, Rocket, Shield } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="pointer-events-none fixed top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/10 blur-[120px]"></div>
      <div className="pointer-events-none fixed bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/3 rounded-full bg-violet-600/10 blur-[120px]"></div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            SkillSync AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold text-foreground/80 hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="font-semibold shadow-md transition-transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 shadow-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">The Future of AI-Powered Teambuilding</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
          Build Your Dream Team with <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent animate-gradient">Intelligent Matching</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          SkillSync AI analyzes your skills, projects, and goals to connect you with the perfect collaborators. Automatically extract skills from your resume and get AI-driven career roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link to="/register">
            <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-1">
              Start Building Now <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 bg-background/50 backdrop-blur-sm transition-all hover:bg-muted/50">
              Explore Projects
            </Button>
          </Link>
        </div>

        {/* Feature Highlights placeholder for React Bits later */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left w-full max-w-6xl">
          <div className="p-8 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all">
            <Brain className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">AI Resume Parsing</h3>
            <p className="text-muted-foreground">Upload your resume and let our Gemini-powered AI extract your core skills, strengths, and weaknesses instantly.</p>
          </div>
          <div className="p-8 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all">
            <Code className="h-10 w-10 text-violet-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Smart Matchmaking</h3>
            <p className="text-muted-foreground">Create projects with specific requirements and let the orchestrator find the best students across your campus.</p>
          </div>
          <div className="p-8 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all">
            <Shield className="h-10 w-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Verified Skills</h3>
            <p className="text-muted-foreground">Endorsements, hackathons, and certifications help prove your capabilities to future teammates and employers.</p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/40 bg-background/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground/80">SkillSync AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SkillSync AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
