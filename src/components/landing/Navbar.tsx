import { Link } from "react-router-dom";
import { Sparkles, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 w-full max-w-7xl mx-auto">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary fill-primary" />
        <span className="text-2xl font-bold tracking-tight text-foreground">
          SkillSync
        </span>
      </div>

      {/* Desktop Links - Center Pill */}
      <div className="hidden md:flex items-center gap-2 px-6 py-2 border border-border rounded-full bg-white shadow-sm">
        <Link to="/" className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/explore" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          Explore
        </Link>
        <Link to="/about" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          About
        </Link>
        <Link to="/contact" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          Contact
        </Link>
      </div>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost" className="font-semibold text-foreground hover:text-primary hover:bg-transparent">
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button className="rounded-full bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-sm px-6 h-10 group transition-all">
            Get Started
            <div className="ml-2 bg-primary group-hover:bg-white rounded-full p-1 transition-colors">
              <ArrowRight className="h-3 w-3 text-white group-hover:text-primary" />
            </div>
          </Button>
        </Link>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-white border-l border-border text-foreground">
            <div className="flex flex-col gap-6 mt-12">
              <Link to="/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-lg rounded-xl"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}