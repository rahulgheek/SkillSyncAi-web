import { Target, Lightbulb, Gamepad2 } from "lucide-react";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section className="bg-white py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Floating tags */}
        <div className="absolute right-10 top-0 hidden lg:flex flex-col gap-3 opacity-80 z-20">
          <div className="bg-secondary text-primary font-bold px-6 py-2 rounded-full rotate-6 transform translate-x-12 shadow-sm">#matching</div>
          <div className="bg-accent text-foreground font-bold px-6 py-2 rounded-full -rotate-3 shadow-sm">#projects</div>
          <div className="bg-primary text-white font-bold px-6 py-2 rounded-full rotate-3 transform translate-x-4 shadow-sm">#growth</div>
        </div>

        <Reveal>
          <div className="mb-24 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              Smart <span className="font-handwriting text-primary text-5xl md:text-6xl lg:text-7xl inline-block -rotate-2 -translate-y-1">Team</span> Assembly
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our AI analyzes student skill sets, project history, and behavioral traits to construct perfectly balanced, highly competitive teams tailored for specific hackathon requirements. No more random teaming.
            </p>
          </div>
        </Reveal>

        {/* Scroll Stack Container */}
        <div className="relative pb-32">
          
          {/* Card 1 */}
          <div className="sticky top-[15vh] z-10 w-full mb-12">
            <div className="bg-secondary rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden shadow-xl border border-white hover-anti-gravity" style={{ '--hover-shadow-color': 'rgba(139, 92, 246, 0.2)' } as any}>
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-[16px] border-primary/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-[16px] border-primary/10" />
              </div>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary shrink-0 z-10 shadow-sm mt-0 md:mt-2">
                <Target className="w-10 h-10" />
              </div>
              <div className="relative z-10 text-center md:text-left flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">AI Resume Parsing</h3>
                <p className="text-primary/80 font-semibold text-lg md:text-xl leading-relaxed max-w-2xl">
                  Upload your resume and let our Gemini-powered AI instantly extract your core skills, strengths, and experience with zero manual entry.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="sticky top-[18vh] z-20 w-full mb-12">
            <div className="bg-primary rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden shadow-2xl border border-white/20 hover-anti-gravity" style={{ '--hover-shadow-color': 'rgba(139, 92, 246, 0.4)' } as any}>
              <svg className="absolute top-10 right-10 w-40 h-40 text-white/10" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 50 Q 25 20, 50 50 T 90 50 L 90 100 L 10 100 Z" opacity="0.5"/>
              </svg>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md shrink-0 z-10 shadow-sm mt-0 md:mt-2">
                <Lightbulb className="w-10 h-10" />
              </div>
              <div className="relative z-10 text-center md:text-left flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Deep AI Insights</h3>
                <p className="text-white/80 font-semibold text-lg md:text-xl leading-relaxed max-w-2xl">
                  Get comprehensive analytics on your profile. Identify skill gaps and discover your unique competitive advantages in the tech landscape.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="sticky top-[21vh] z-30 w-full">
            <div className="bg-accent rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden shadow-2xl border border-white/40 hover-anti-gravity" style={{ '--hover-shadow-color': 'rgba(251, 191, 36, 0.4)' } as any}>
              <div className="absolute top-10 right-10 grid grid-cols-4 gap-3 opacity-20">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-foreground rounded-full" />
                ))}
              </div>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-foreground shrink-0 z-10 shadow-sm mt-0 md:mt-2">
                <Gamepad2 className="w-10 h-10" />
              </div>
              <div className="relative z-10 text-center md:text-left flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Dynamic Career Roadmap</h3>
                <p className="text-foreground/80 font-semibold text-lg md:text-xl leading-relaxed max-w-2xl">
                  Stop guessing your next steps. Generate a personalized, step-by-step learning path based on your dream roles and current skill level.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}