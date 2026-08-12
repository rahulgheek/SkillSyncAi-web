import { Outlet, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ASCIIText from "@/components/ui/react-bits/ASCIIText";
import { SectionGlow } from "@/components/landing/SectionGlow";
import { FadeIn } from "@/components/ui/animated/FadeIn";

export function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4 sm:p-8 bg-primary relative selection:bg-white/30 overflow-y-auto">
      
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent rounded-full blur-[100px] opacity-60 mix-blend-screen" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary rounded-full blur-[100px] opacity-60 mix-blend-screen" />

      {/* Main Floating Card */}
      <FadeIn delay={0.1} className="w-full max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[550px]">
          
          {/* Left Side - Welcome Panel */}
          <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-primary via-primary to-accent p-12 flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                Welcome to <br/>
                <span className="font-handwriting text-[#FFF066] text-5xl lg:text-6xl inline-block -rotate-2 mt-2 drop-shadow-md">SkillSync</span>
              </h2>
              <p className="text-white/90 text-base font-medium mt-6 leading-relaxed max-w-xs">
                The ultimate platform for student builders. Connect, build incredible projects, and kickstart your tech career.
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FFF066]/20 rounded-full blur-3xl" />
          </div>

          {/* Right Side - Form Container */}
          <div className="w-full md:w-[55%] p-8 sm:p-10 lg:p-14 flex flex-col justify-center lg:pl-16 relative">
            
            {/* Logo */}
            <div className="flex justify-start mb-8">
              <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:-translate-y-1 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight text-foreground">SkillSync</span>
              </Link>
            </div>

            {/* Forms */}
            <div className="w-full max-w-sm">
              <Outlet />
            </div>

          </div>

        </div>
      </FadeIn>
      
    </div>
  );
}
