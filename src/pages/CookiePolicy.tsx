import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Cookie } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            SkillSync AI
          </span>
        </div>
        <Link to="/">
          <Button variant="ghost" className="font-semibold text-foreground/80 hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <Cookie className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2>1. What are cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you browse websites.
            </p>

            <h2>2. How we use cookies</h2>
            <p>
              We use strictly necessary cookies to keep you logged in securely using JSON Web Tokens (JWT) and to remember your preferences (such as dark mode).
            </p>

            <h2>3. Third-party cookies</h2>
            <p>
              We do not use third-party tracking or advertising cookies.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
