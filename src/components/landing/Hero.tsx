import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/animated/FadeIn";
import { Navbar } from "./Navbar";

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col bg-white overflow-hidden pb-20">
      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center mt-12 md:mt-20">
        
        {/* Floating Background Graphics */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Target circles left */}
          <div className="absolute top-1/4 left-[15%] w-16 h-16 rounded-full border-[10px] border-secondary opacity-50 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-[6px] border-secondary" />
          </div>
          {/* Swirl / Arrow left */}
          <svg className="absolute top-[35%] left-[20%] text-primary/60 w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80 Q 40 20, 80 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M70 40 L 80 50 L 70 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
          </svg>
          
          {/* Circular badge top right */}
          <div className="absolute top-1/4 right-[15%] w-24 h-24 rounded-full border border-accent/30 flex items-center justify-center animate-spin-slow">
            <div className="text-[10px] font-bold text-accent uppercase tracking-widest absolute text-center w-full h-full rotate-45">
              • SkillSync • Top • Talent •
            </div>
            <Star className="w-8 h-8 text-accent fill-accent absolute" />
          </div>
        </div>

        <FadeIn delay={0.1}>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto text-foreground relative z-10">
            The smartest way to <br/>
            <span className="font-handwriting text-primary text-6xl md:text-8xl lg:text-[100px] leading-none inline-block -rotate-2 -translate-y-2 mr-4">build</span>
            and
            <span className="font-handwriting text-accent text-6xl md:text-8xl lg:text-[100px] leading-none inline-block rotate-2 -translate-y-2 ml-4 relative">
              scale
              <svg className="absolute -bottom-4 left-0 w-full h-4 text-accent" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 20, 100 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <br/>
            your dream team
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-8 mb-10 leading-relaxed font-medium mx-auto relative z-10">
            Discover thousands of brilliant minds and interactive projects to support your startup's growth and learning process.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="relative z-10">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-lg shadow-primary/30 group transition-all"
              onClick={() => navigate("/register")}
            >
              Get started
              <div className="ml-3 bg-white/20 group-hover:bg-white/30 rounded-full p-1.5 transition-colors">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </Button>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}