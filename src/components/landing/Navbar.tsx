import { Link } from "react-router-dom";
import { Sparkles, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 w-full max-w-7xl mx-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-foreground">
          SkillSync
        </span>
      </Link>

      {/* Desktop Links - Center Pill */}
      <div className="hidden md:flex items-center gap-2 px-6 py-2 border border-border rounded-full bg-card/90 shadow-sm backdrop-blur-sm">
        <Link to="/" className="px-4 py-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
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
          <Button variant="ghost" className="font-bold text-foreground hover:text-primary hover:bg-muted/50 rounded-full px-5">
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button className="rounded-full bg-primary hover:bg-[#340C12] text-white shadow-md shadow-primary/25 px-6 h-10 group transition-all font-bold">
            Get Started
            <div className="ml-2 bg-[#A75D43] group-hover:bg-[#8F4E37] rounded-full p-1 transition-colors">
              <ArrowRight className="h-3 w-3 text-white" />
            </div>
          </Button>
        </Link>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground" aria-label="Open mobile menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-card border-l border-border text-foreground">
            <div className="flex flex-col gap-4 mt-8">
              <Link to="/" className="px-2 py-2 text-base font-bold text-foreground hover:text-primary">
                Home
              </Link>
              <Link to="/explore" className="px-2 py-2 text-base font-bold text-muted-foreground hover:text-primary">
                Explore
              </Link>
              <Link to="/about" className="px-2 py-2 text-base font-bold text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="px-2 py-2 text-base font-bold text-muted-foreground hover:text-primary">
                Contact
              </Link>
              <div className="h-px bg-border my-2" />
              <Link to="/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-base rounded-xl font-bold"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
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
