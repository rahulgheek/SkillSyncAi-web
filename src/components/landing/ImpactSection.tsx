import { Reveal } from "./Reveal";
import { Rocket, Users, Briefcase, Zap } from "lucide-react";

const IMPACT_STATS = [
  { 
    id: 1, 
    value: "80%", 
    label: "Learn a new technology", 
    desc: "Hackathons are the fastest way to pick up a new stack.",
    icon: Zap,
    color: "bg-secondary" 
  },
  { 
    id: 2, 
    value: "3x", 
    label: "Faster Interview Prep", 
    desc: "Real-world projects stand out more than leetcode.",
    icon: Briefcase,
    color: "bg-accent" 
  },
  { 
    id: 3, 
    value: "10k+", 
    label: "Connections Made", 
    desc: "Meet co-founders, mentors, and lifelong friends.",
    icon: Users,
    color: "bg-[#7DD3FC]" 
  }
];

export function ImpactSection() {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-20">
          <Reveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              The true <span className="font-handwriting text-primary text-5xl md:text-6xl lg:text-7xl inline-block rotate-2 -translate-y-1">Impact</span> of Hackathons
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
              It’s not just about winning prizes. It’s about building a portfolio, accelerating your career, and finding your tribe in the tech ecosystem.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {IMPACT_STATS.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 0.15} direction="up">
              <div className={`rounded-[3rem] p-10 ${stat.color} relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-lg`}>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
                
                <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <stat.icon className="w-8 h-8 text-foreground" />
                </div>
                
                <h3 className="text-5xl font-extrabold text-foreground mb-4">{stat.value}</h3>
                <h4 className="text-2xl font-bold text-foreground mb-2 leading-tight">{stat.label}</h4>
                <p className="text-foreground/80 font-medium text-lg leading-relaxed">{stat.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <Reveal delay={0.4}>
          <div className="mt-16 bg-primary rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to make an impact?</h3>
              <p className="text-white/80 font-medium text-xl max-w-xl">Join thousands of students building the future, one weekend at a time.</p>
            </div>
            <button className="relative z-10 bg-accent hover:bg-accent/90 text-foreground font-bold text-lg px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(251,191,36,0.4)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.6)] transition-all flex items-center gap-2 hover:-translate-y-1">
              Find a Team <Rocket className="w-5 h-5" />
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
